
[![Build Status](https://travis-ci.org/McCallTech/vendingMachineKata.svg?branch=master)](https://travis-ci.org/McCallTech/vendingMachineKata/builds) 
[![Gh-Pages](https://img.shields.io/badge/gh--pages-Deployment%20courtesy%20of%20Travis--CI-green.svg)](http://mccalltech.github.io/vendingMachineKata/)
[![Kanban Board](https://img.shields.io/badge/huboard-ScrumBan-blue.svg)](https://huboard.com/McCallTech/vendingMachineKata/#/)
[![codenvy](https://img.shields.io/badge/Codenvy-Better%20Agile%20Experience-brightgreen.svg)](https://codenvy.com/)
![chromebook](https://img.shields.io/badge/Chromebook%20Approved-100%25-green.svg)

# Dev | DevOps: CM | DevOps: CI


This kata utilizes containerized environments to run a development environment locally, on your own cloud hosted VPS, or with a service like codenvy / koding. 
* The docker container is bootstrapped with node v4.4.5 and mounts the node repo to /vendingMachineKata. 
* Committing and pushing to master triggers a travis-ci build task that tests your app.
  * On success, travis-ci deploys to github pages.
  * On success, travis-ci pushes to docker hub.
* Build status shield from travis-ci can be seen on your github repo. 
* Developer is notified via email on success / failure of buildTravis-ci. 

The repo also contains the configuration management needed to (re)build a linode vps. 
* On boot the Linode VPS will take a base Ubuntu 14.04 image 
  * set up the dependencies needed (with bash, makefiles, salt and docker)
  * automatically run the Eclipse Che container s(port 8080) 
  * automatically run  the node app container ( on port 80) 

Linode can then be used as a development environment, a host for Eclipse Che (development environment manager) or can host the deployed app which can be connected to via ssh for development inside the docker container. Auto deploy scripts that update the docker containers with minimal down time. 

This project also includes:
- ScrumBan board: [![Kanban Board](https://img.shields.io/badge/huboard-ScrumBan-blue.svg)](https://huboard.com/McCallTech/vendingMachineKata/#/)

- codenvy factory link: [![codenvy](https://img.shields.io/badge/Codenvy%20Factory-Click%20to%20launch%20cloud%20instance-brightgreen.svg)](http://beta.codenvy.com/f?name=kata&user=joshmccall221)
  - *note:* you will need a codeny account (OAuth signup available  

##Kata:
#### Dev Option 1: [Vending Machine Kata](https://github.com/guyroyse/vending-machine-kata#vending-machine-kata)

#### DevOps Option 1:[Configuration Management](https://docs.google.com/document/d/1aXIFgDu9mDzCHpbjv4ybWAxWLcOneNqtih3WOrhRvIg/edit?usp=sharing)

- [x] a: Install/configure the CM tool of your choice.
	- Bash / Makefiles / Salt / Docker 
- [x] b: Automate the provisioning of a web application stack. An example stack might be, but is in no way limited to, redis/passenger/nginx. 
	- Linode (VPS host)  / Docker (serves app/webserver) 
- [x] c: Automate the deployment of a simple &#39;ping&#39; page that establishes that each of the 3 layers in the stack
are available.
	- Deployment of Linode triggers auto CM, pulls latest docker and serves it over port 80

- [x] d: Provide us with access to your RCS and identify a few issues that represent the next configurations to
be managed in your environment; don&#39;t be surprised if someone proposes a change that addresses
one of the issues...  Your project should be complete as delivered, but every project has a &#39;next step&#39;
and we&#39;d like to know what you think your next steps are.
	- Next steps:
		- DevOps CI: Working cron job triggering a docker pull / stop / remove / run. This has minimal downtime but I would like to flush out blue green deploy strategy that does not rely on a service (aws/dockerhub/digital Ocean).  
		- DevOps CI: Travis CI currently builds after every push. Limiting to only code files and tagged commits would better optimize resources. 
		- DevOps CI: Local or containerized travis-ci
		- DevOps CM: utilize salt for scaling beyond one node.
		- DevOps CM: docker swarm for scaling 
		- DevOps CM: run CaptianHooks for api endpoints to trigger deployment lifecycles 

#### DevOps Option 2: [Continuous Integration/Deployment](https://docs.google.com/document/d/1aXIFgDu9mDzCHpbjv4ybWAxWLcOneNqtih3WOrhRvIg/edit?usp=sharing)

- [x] a: Build a simple application with reasonable unit and/or integration tests; there really aren&#39;t any
constraints here, but it should do something that we can see the results of.
	- Node app with few simple test to be used in ping test. 

- [x] b: Configure a Continuous Integration solution to monitor a Version Control System and execute the unit
and/or integration tests when new commits are made.
	- git push master triggers travis-ci that builds and runs test. After success travis-ci runs github pages deploy, docker hub push. 

- [x] c: Provide us with access to your RCS and identify a few issues that represent the next features to be
delivered in your application; don&#39;t be surprised if someone commits a change that addresses one of
the issues...  Your project should be complete as delivered, but every project has a &#39;next step&#39; and
we&#39;d like to know what you think your next steps are.

- [x] d: Configure a Continuous Deployment solution to automatically deploy the application when CI is
successful and notify the Software Engineer when CI fails.
	- Push to master triggers travis-ci job and docker build, both of which run test. 

#Solution:
## Dev Option 1: vendingMachineKata (node/react/webpack)
*note*: current state, only starter version for use in CM/CI (to be continued ...)

## DevOps Option 1: CM
### Linode Ubuntu 14.04
#### Specs (linode 1024 or lindoe 4096):   
#####  StackScripts / Bash
- Linodes custom scripts are run when server is (re)built
```
#!/bin/bash 
apt-get update && \
apt-get install make curl -y && \
cd ~ && \
curl -o- https://raw.githubusercontent.com/McCallTech/vendingMachineKata/master/Makefile > ~/Makefile && make init

```
##### Makefile
- make init && make start_kataDocker
	- Spins up eclipse che and pulls joshmccall221/vendingMachineDocker to server on port 80
	- Eclipse Che : ${linode.ip}:8080
	- vendingMachineKata :  ${linode.ip}
```
init:
	- curl -o- https://raw.githubusercontent.com/McCallTech/vendingMachineKata/master/salt >> salt && bash salt 
	- git clone https://github.com/joshmccall221/dotfiles.git  ~/dotfiles && cd ~/dotfiles &&  make eclipse_che && make start_kataDocker 

```
##### Salt
  
```
#Add key   
wget -O - https://repo.saltstack.com/apt/ubuntu/14.04/amd64/latest/SALTSTACK-GPG-KEY.pub | sudo apt-key add -
echo 'deb http://repo.saltstack.com/apt/ubuntu/14.04/amd64/latest trusty main ' >> /etc/apt/sources.list.d/salt.list
#Install salt
sudo apt-get update -y
sudo apt-get install salt-minion -y
#use salt to bootstrap system
salt-call --local pkg.install git make vim tmux ack-grep 

#Use salt formula to install docker
mkdir /srv/salt
cd /srv/salt/
git clone https://github.com/saltstack-formulas/docker-formula.git
cp -R ./docker-formula/docker/ .
salt-call --local state.sls docker
  ```
##### Development Environment: 
- Local
- http://beta.codenvy.com/
- ${linode.ip):8080 (eclipse che)
##### Eclipse Che
- container based (docker) cloud ide 
- Open source version of codenvy [more info]( https://codenvy.com/product/technology/)
- Swagger api for creating users/workspaces/projects
	
##### Docker (joshmccall221/vendingmachinekata)
- can be run:
	- locally
	- codenvy
	- Any VPS
- All cloud based means laptop / chromebook / ipad development :)
	
## DevOps Option 2: CI
##### github:
	- push to master triggers travis-ci build
##### travis-ci: 
- runs npm test
- builds dockerfile
- after_success
	- deploys to github pages
	- push to docker hub
- Notifies via email either success or failure
```
language: node_js

node_js:
- '4.4.3'
services:
  - docker
script: 
  - npm install
  - npm test
  - docker login -e="$DOCKER_EMAIL" -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
  - docker build -t joshmccall221/vendingmachinekata .
  - docker tag joshmccall221/vendingmachinekata joshmccall221/vendingmachinekata:$TRAVIS_BUILD_NUMBER
  - docker run -d -p 127.0.0.1:80:80 --name vendingmachinekata joshmccall221/vendingmachinekata:$TRAVIS_BUILD_NUMBER
  - docker ps | grep -q vendingmachinekata 
  
after_success:
  - webpack
  - chmod a+x deploy-ghpages.sh
  - npm run-script deploy
  - docker push joshmccall221/vendingmachinekata
  - docker push joshmccall221/vendingmachinekata:$TRAVIS_BUILD_NUMBER

```




#### Sources, reading list and credits: 
### Agile Board: 
[huboard](https://huboard.com/McCallTech/vendingMachineKata/#/)
### CM: 
[Linode peformance with low tier memory](https://www.centos.org/docs/5/html/5.2/Deployment_Guide/s2-swap-creating-file.html)

##### Deployment: 
[Docker Blue/Green](https://botleg.com/stories/blue-green-deployment-with-docker/)

[consul](https://hub.docker.com/r/progrium/consul/)

[blueGreen](https://github.com/nicferrier/docker-shell-deploy)

[dockerSwarm](https://github.com/vfarcic/docker-swarm-blue-green)

[dockerSwarm](https://technologyconversations.com/2015/11/25/deploying-containers-with-docker-swarm-and-docker-networking/)

[dockerSwarm generic driver (docker-machine create on linux)](https://docs.docker.com/machine/drivers/generic/)

[docker deep dive (generic driver)] (https://blog.docker.com/2015/06/docker-machine-0-3-0-deep-dive/)
##### Container:
[Docker hub deployment: github, travis, dockerhub (blue/green with depcon)](http://depcon.containx.io/docs/travis)

[Docker formulas with Salt](https://github.com/saltstack-formulas/docker-formula#docker-containers)

[Docker Cheat Sheet](https://github.com/wsargent/docker-cheat-sheet)

[Docker exec] (https://docs.docker.com/engine/reference/commandline/exec/)
##### GitHub:
[Awesome Sheilds](http://shields.io/)

##### Fun
[I swapped my MacBook for an iPad+Linode](http://yieldthought.com/post/12239282034/swapped-my-macbook-for-an-ipad)

### Screen shots: 
#### Docker pulled from joshmccall221/vendingmachinekata running in codenvy with passing test and serving from web-pack-dev-server:

![Passing_Test_Hi_Momma](Passing_Test_Hi_Momma_Blue.png)

####ScrumBan

![ScrumBanScrumBan](ScrumBan.png)

#### Travis-CI deployed to gh-pages and docker:

![gh-pages_linode](gh-pages_linode.png)

#### Github, Travis-CI, Docker hub: 

![github_travis_docker_hub](github_travis_docker_hub.png)


