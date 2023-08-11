<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

# Index
- ### [1. Install npm and NodeJS](#install-npm-and-nodejs)
  - ##### [1.1 Linux](#linux)
  - ##### [1.1 Arch](#arch)
- ### [2. Install and setup Nest](#install-and-setup-nest)
  - ##### [2.1 Install Nest](#install-nest)
  - ##### [2.2 Create project](#create-project)
  - ##### [2.3 Install nest in a project already created](#install-nest-in-a-project-already-created)
  - ##### [2.4 Nest new command](#nest-new-command)
- ### [3. Launch project](#launch-project)
- ### [4. Reach my project](#reach-my-project)
- ### [Previous Docs : What is NestJS](0-what-is-nestjs.md)
- ### [Next Docs: Configure Database](2-configure-database.md)
### [Back to summary](../Summary.md)

***
# Install npm and nodejs
## Linux
~~~bash
sudo apt-get install -y npm nodejs
~~~

## Arch
~~~bash
sudo pacman -Syu nodejs npm
~~~

# Install and setup Nest
## Install Nest
~~~bash
npm i -g @nestjs/cli
~~~

## Create project
~~~bash
nest new my-project
~~~

## Install nest in a project already created
~~~bash
cd my-project

nest new [nest-project-name]
~~~

## Nest new command
- Will create a backend repo with src folder inside

- This is what src contains :"
    - `app.controller.ts` : A basic controller with a single route.
    - `app.controller.spec.ts` :     The unit tests for the controller.
    - `app.module.ts` :    The root module of the application.
    - `app.service.ts` : A basic service with a single method.
    - `main.ts` : The entry file of the application which uses the core function NestFactory to create a Nest application instance.

# Launch project
- Go to your nest project folder

~~~bash
npm run start
~~~

- **For watch changes directly when tipping code, a dev mode exist with npm**

~~~bash
npm run start:dev
~~~

# Reach my project
- Go to `localhost:3000`, you should get a `Hello World!`
- You can change the port where nest is listening in `src/main.ts` file
~~~typescript
  await app.listen(3080);
~~~

### [Back to summary](../Summary.md)