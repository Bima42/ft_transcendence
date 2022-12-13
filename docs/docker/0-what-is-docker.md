<p align="center">
  <a href="https://docs.docker.com" target="blank"><img src="https://cdn.worldvectorlogo.com/logos/docker.svg" width="120" alt="Nest Logo" /></a>
</p>

***

# Index
- ### [1. Getting Started](#getting-started)
- ### [2. Play With Docker](#play-with-docker)
- ### [3. Why Docker ?](#why-docker-?)
  - ##### [3.1 Isolation Problem](#isolation)
  - ##### [3.2 Environment Problem](#environment)
  - ##### [3.3 Speed Problem](#speed)
- ### [4. Sources](#sources)
- ### [5. Next Docs : Install Docker](1-install-docker.md)
### [Back to summary](../Summary.md)

***

# Getting Started
- Docker makes development efficient and predictable
- Docker takes away repetitive, mundane configuration tasks and is used throughout the development lifecycle for fast, easy and portable application development – desktop and cloud
- Docker’s comprehensive end to end platform includes UIs, CLIs, APIs and security that are engineered to work together across the entire application delivery lifecycle

# Play with Docker

- Awesome tool to start with Docker and test some commands
- <a href="https://labs.play-with-docker.com" target="_blank">Play with Docker !</a>

# Why Docker ?
- Docker needed to exist because the old ways were full of friction and complexity when met with the modern area of software development and the speed at which we needed to operate
    - The Problem of Isolation
    - The Problem of Environments
    - The Problem of Speed

## Isolation
- Over the years 2000s, Virtual Machine became reality. Became the way to manage software deelopment, and the daily use of sysadmin
- We got the `one app, one VM model`
    - Python on one VM
    - PHP on another ..
- Manage this is really heavy, and has a cost
- There was less time for innovation and new projetcs because of managing those VMs
- Docker allow us to still isolate our apps but without all the unecessary VM sprawl

## Environment
- WOMM problem : `Works on My Machine`
- Problem that all devs encountered one time in his life. All works on his machine, but not on another
- Developers had to adapt their software for all environments
- Docker allow us now to tests those environments easily
- One of the design goals of Docker images and containers was to create a new level of abstraction
    - contract between the developer build instructions for the app (Dockerfile)
    - and environment it runs in (container runtime)

## Speed
- We talk about business speed here
- The speed of a company is able to deliver a new product to answer a customer problem or whatever
- By combining ideas of the image, registry and container, Docker improves the time-to-complete in nearly every part of the softwre lifecycle :
    - develop faster
    - build
    - test
    - deploy
    - update
    - recover
- Some datas about Docker efficiency :
    - 70% reduction VM costs
    - 50% developper productivty boost
    - 10x average CPU utilization
    - 90% reduction in maintenance costs
    - 50% increase in speed of build-test-deploy cycles

# Sources

- <a href="https://www.docker.com" target="_blank">Docker Home Page</a>
- <a href="https://docs.docker.com" target="_blank">Docker Docs</a>
- <a href="https://hub.docker.com" target="_blank">Docker Hub</a>
- <a href="https://github.com/docker" target="_blank">Docker Github</a>

### [Back to summary](../Summary.md)