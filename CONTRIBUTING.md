# How to contribute

## Quick Overview
  - Create a new issue with clear description and steps to reproduce in case of a bug
  - Fork repository
  - Clone your fork
  - Make your change, make sure each commit is atomaric and has meaningful message
  - Push you commits to your forked repository
  - Create pull request

## Dependencies
SugoiOverflow is built on [nodejs](https://nodejs.org/)
You can install it from [official download page](https://nodejs.org/download/) or use your operating system's package manager to get it:
### Mac OS X ([brew](http://brew.sh/))
```brew install nodejs```

### Debian/Ubuntu/Mint/ElementaryOS/...(apt-get)
```sudo apt-get install nodejs```

### Windows([chocolatey](https://chocolatey.org/))
```choco install nodejs```

In order to build all packages you will need to have:
- [node-gyp](https://github.com/TooTallNate/node-gyp): ```npm install node-gyp -g```
- [python 2](https://www.python.org/download/releases/2.7.6/)
- Windows users will need to have [Microsoft Visual Studio C++ 2012/13 for Windows Desktop](http://www.microsoft.com/en-nz/download/details.aspx?id=34673) installed and specify ```--msvs_version=<vs version>``` when you run ```npm install``` command

In order to downscale avatars SugoiOverflow uses [GraphicsMagick](http://graphicsmagick.org) utility which you can easily install:
### Mac OS X ([brew](http://brew.sh/))
```brew install graphicsmagick```

### Debian/Ubuntu/Mint/ElementaryOS/...(apt-get)
```sudo apt-get install graphicsmagick```

### Windows([chocolatey](https://chocolatey.org/))
```choco install graphicsmagick```

## Install

```
git clone <your fork url>
cd <your fork folder>
npm install [don't forget --msvs_version=<vs version> if you use windows]
```

You are now all set and can start working.

##Structure
The whole app is divided on server and client parts. Server runs on [node.js](https://nodejs.org/), uses [express](http://expressjs.com/) as REST framework, [mongoDB](https://www.mongodb.org/) for storing data and [mongoose](http://mongoosejs.com/) to make data management even easier.

##Sublime Text users

There are three sublime projects:
 - server: ```./server/server.sublime-project```
 - client: ```./client/client.sublime-project```
 - everything else: ```./util.sublime-project```


## Gulp tasks
SugoiOverflow uses [gulp](http://gulpjs.com/) as task runner. To use it you need to run ```npm install gulp -g``` prior to running any command. After just by typing "gulp" in terminal you run default task ```gulp run``` which compiles client-side code, runs node process with entry point at ```./server/index.js``` and adds watch on all files in project.
