# metakit

[![npm version](https://badge.fury.io/js/metakit.svg)](https://badge.fury.io/js/metakit)

A toolkit to handle storage, playback and distribution of structured alphanumerical data. It is written in ES6 JavaScript for use with [Node.js](https://nodejs.org), uses [LMDB](https://en.wikipedia.org/wiki/Lightning_Memory-Mapped_Database) and (soon) [HDF5](https://support.hdfgroup.org/HDF5/) to store data and provides realtime data playback through [OSC](http://opensoundcontrol.org/osc) over various transports, such as UDP, TCP and [WebSocket](https://en.wikipedia.org/wiki/WebSocket).

## Setup

:rocket: Tested on:
* macOS 10.11 & 10.12
* Ubuntu 14.04
* Windows 8.1

### Add to project

```shell
npm install --save metakit
```

### Prerequisites

Node.js >= v9.0.0
  - [NVM](https://github.com/creationix/nvm#installation) (recommended)
  - "one-click" [Installer](https://nodejs.org/en/download/current/)
  - your favourite
  [Package Manager](https://nodejs.org/en/download/package-manager/).

### Build tools

#### macOS

[![Build Status](https://travis-ci.org/PieceMeta/node-metakit.svg?branch=master)](https://travis-ci.org/PieceMeta/node-metakit)

```shell
xcode-select --install
```

#### Ubuntu 14.04

[![Build Status](https://travis-ci.org/PieceMeta/node-metakit.svg?branch=master)](https://travis-ci.org/PieceMeta/node-metakit)

```shell
sudo apt-get install build-essential gcc-4.9 g++-4.9
export CC=gcc-4.9 && CXX=g++-4.9
```

#### Windows

[![Build status](https://ci.appveyor.com/api/projects/status/2ca1sqrv6p3x98i1?svg=true)](https://ci.appveyor.com/project/dasantonym/node-metakit)

Install required software ([Visual Studio 2015](https://www.visualstudio.com/downloads/) and [MinGW](https://sourceforge.net/projects/mingw/files/Installer/)) manually, or use this [fetch script gist](https://gist.github.com/dasantonym/74a15caa27a93ab20903badba94783b5):

```shell
npm install bluebird node-wget-promise fs-extra
curl -fsSL https://gist.githubusercontent.com/dasantonym/74a15caa27a93ab20903badba94783b5/raw/mtk-dl-dependencies.js | node -r bluebird
```

Then install node related build tools:

```shell
npm i -g windows-build-tools node-gyp mocha
npm config set msvs_version 2015 --global
```

### Optional features

#### HDF5 library

Adds HDF5 compatibility in addition to LMDB. Needs a rebuild of the project, not (currently) available through NPM.

Note: This is not yet implemented as a proper build option, so for now don't bother reading any further.

Before rebuild, add the hdf5 module with ``npm i hdf5``, then uncomment the HDF refs in ``src/convert/index.js`` and ``src/output/index.js`` and rebuild (see below).

  - [Official maintainer](https://www.hdfgroup.org/downloads/hdf5/)
  - macOS ([Homebrew](https://docs.brew.sh/Installation.html)):
  ``brew install hdf5``
  - Ubuntu: ``sudo apt-get install libhdf5-dev``

## Development

[![Maintainability](https://api.codeclimate.com/v1/badges/7f4dbdb7d4dc17aa9dcb/maintainability)](https://codeclimate.com/github/PieceMeta/node-metakit/maintainability)
[![Greenkeeper badge](https://badges.greenkeeper.io/PieceMeta/node-metakit.svg)](https://greenkeeper.io/)
[![Dependency Status](https://gemnasium.com/badges/github.com/PieceMeta/node-metakit.svg)](https://gemnasium.com/github.com/PieceMeta/node-metakit)

Before pushing changes, please make sure to lint the code using ``npm run eslint``.

### Build project

Transpiles ES6 code and copies assets to ``dist``.

```shell
npm run build
```

### Release

Cleans ``dist``, ``lib`` and ``install`` and lints the code before building.

```shell
npm run release
```
