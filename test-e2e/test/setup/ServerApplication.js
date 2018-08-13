import {spawn} from 'child_process';
import {request} from 'http';
import Log from 'js-logger';
import {getPortPromise} from 'portfinder';
import { createServer } from 'net';

export default class ServerApplication {

  constructor({isDevMode, artifactPath, javaExecPath}) {
    this.isDevMode = isDevMode;
    this.artifactPath = artifactPath;
    this.javaExecPath = javaExecPath;
    this.port = -1;
    this.proc = null;
  }

  async checkNoServerIsRunningInDevMode() {
    if (!this.isDevMode) {
      return;
    }

    let err;

    for (let i = 0; i < 20; i++) {
      const server = createServer(() => {});
      try {
        await new Promise((resolve, reject) => {
          server.listen(8080, 'localhost', () => {
            server.close(resolve);
          });
          server.on('error', () => reject(new Error('Port 8080 is blocked. Please shutdown server and run test again.')));
        });

        Log.log('port 8080 is free');
        err = undefined;

        break;
      } catch (e) {
        err = e;

        Log.log('port 8080 is not free: do you run server manual? retry in 500ms');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    if (err) {
      throw err;
    }
  }

  async startAndWaitForReadiness() {
    Log.info(`start server and wait for readiness`);

    if (this.isDevMode) {
      this.port = 8080;
    } else {
      this.port = await getPortPromise({port: 50000});
    }

    Log.info(`using server port ${this.port}`);

    const javaArgs = [
      '-jar', this.artifactPath,
      `--server.port=${this.port}`
    ];

    Log.log(`start server: ${this.javaExecPath} ${javaArgs.join(' ')}`);
    this.proc = spawn(this.javaExecPath, javaArgs);

    this.proc.stderr.pipe(process.stderr);
    this.proc.stdout.pipe(process.stdout);

    await new Promise(async (resolve, reject) => {

      let isServerDown = false;
      const exitHandler = (code, signal) => {
        Log.error(`unexpected server shutdown, code: ${code}, signal: ${signal}`);
        isServerDown = true;
      };

      const unregisterExitHandler = () => {
        this.proc.removeListener('exit', exitHandler);
      };

      this.proc.once('exit', exitHandler);

      let healthy;
      let count = 0;
      for (;!isServerDown;) {

        healthy = await new Promise(resolve => {

          const healthinessUrl = `http://localhost:${this.port}/actuator/health`;

          Log.log(`check server healthiness: ${healthinessUrl}`);
          const req = request(healthinessUrl, res => {
            if (res.statusCode < 200 || res.statusCode >= 400) {
              resolve(false);
              return;
            }

            resolve(true);
          });

          req.end();

          req.once('error', () => {
            resolve(false);
          });
        });

        if (healthy) {
          Log.log('server healthy');
          break;
        }

        if (count > 60) {
          Log.error('server did not get healthy within 60s');
          break;
        }

        Log.log('server unhealthy. retry in 1s');
        await new Promise(resolve => setTimeout(resolve, 1000));

        count++;
      }

      unregisterExitHandler();

      if (!healthy) {
        reject();
        return;
      }
      
      resolve();
    });
  }

  async stop() {
    if (!this.proc) {
      return;
    }

    Log.info('stopping server');
    await new Promise(resolve => {
      this.proc.once('exit', () => {
        Log.info('server stopped');
        resolve();
      });
      this.proc.kill('SIGINT');
    });
  }
}