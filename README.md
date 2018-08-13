# PostX

This application should show a possible setup with TestCafe.

A good project setup should have two things:

1. **stable build** with a pipeline + **tests against the final artifact**
1. **acceptable development cycles** to run/build everything any time

Please keep in mind: everything in `test-e2e/test` is customized NodeJS code.
Understand how TestCafe works, understand how to start a SpringBoot application and use a good
scripting language like NodeJS to glue them together.

## Tech Stack

- SpringBoot (/server)
- React (/client)


## Tools

- Maven
- npm
- TestCafe (UI testing)


## Modes


### Production Mode (for build pipeline)

`$ mvn install` from parent folder should:

1. build everything
1. test artifact with TestCafe (headless browser)


### Development Mode

needs:
- **running client** on `localhost:3000` (via `cd client && npm start`)
- **server/target/postx-server-1.0.0-SNAPSHOT.jar** (build via `cd server && mvn install`)

advantages:
- client: **hot reload in a few seconds** after any code change
- server: **build/update JAR-file in a few seconds** after any code change

how to work:
- change client => **just save**, will hot reload
- change server => **build via maven** (or e.g. IntelliJ Maven Projects Plugin)
- rerun test (Visual Studio Code has a cool Plugin to run TestCafe tests)