import 'testcafe';
import fs from 'fs';
import Log from 'js-logger';
import ServerApplication from './ServerApplication';
import dotenv from 'dotenv';

dotenv.config();

const isDevMode = process.env.NODE_TESTCAFE_MODE !== 'prod';
const javaExecPath = process.env.NODE_TESTCAFE_JAVA_EXECPATH || 'java';
const serverArtifactPath = process.env.NODE_TESTCAFE_SERVER_ARTIFACT_PATH
  || __dirname + '/../../../server/target/postx-server-1.0.0-SNAPSHOT.jar';

Log.useDefaults();
Log.info(`fixtures using:
  isDevMode          = ${isDevMode}
  javaExecPath       = ${javaExecPath}
  serverArtifactPath = ${serverArtifactPath}
`);

if (!isDevMode && !fs.existsSync(serverArtifactPath)) {
  throw new Error(`server artifact '${serverArtifactPath}' does not exist`);
}

export const setup = (...fixtureArgs) => {

  return fixture(...fixtureArgs)

    .before(async ctx => {

      const serverApp = ctx.serverApp = new ServerApplication({
        isDevMode,
        javaExecPath,
        artifactPath: serverArtifactPath
      });

      await serverApp.checkNoServerIsRunningInDevMode();

      await serverApp.startAndWaitForReadiness();

      if (isDevMode) {
        ctx.serverPath = path => `http://localhost:3000${path}`;
      } else {
        ctx.serverPath = path => `http://localhost:${serverApp.port}${path}`;
      }
      
    })
    .after(async ctx => {
      const {serverApp, testDb} = ctx;

      if (serverApp) {
        await serverApp.stop();
      }

      if (testDb) {
        await testDb.dropDb();
        await testDb.close();
      }
    });
};