# metakit

A toolkit to handle storage, playback and distribution of structured alphanumerical data. It is written in ES6 JavaScript for use with [Node.js](https://nodejs.org), uses [LMDB](https://en.wikipedia.org/wiki/Lightning_Memory-Mapped_Database) and (soon) [HDF5](https://support.hdfgroup.org/HDF5/) to store data and provides realtime data playback through [OSC](http://opensoundcontrol.org/osc) over various transports, such as UDP, TCP and [WebSocket](https://en.wikipedia.org/wiki/WebSocket).

[![npm version](https://badge.fury.io/js/metakit.svg)](https://badge.fury.io/js/metakit)
[![Maintainability](https://api.codeclimate.com/v1/badges/7f4dbdb7d4dc17aa9dcb/maintainability)](https://codeclimate.com/github/PieceMeta/node-metakit/maintainability)
[![Build Status](https://travis-ci.org/PieceMeta/node-metakit.svg?branch=master)](https://travis-ci.org/PieceMeta/node-metakit)
[![Dependency Status](https://gemnasium.com/badges/github.com/PieceMeta/node-metakit.svg)](https://gemnasium.com/github.com/PieceMeta/node-metakit)

## Requirements

:rocket: Tested on:
* macOS 10.11 & 10.12
* Ubuntu 14.04

### Dependencies

#### Build tools
  - macOS: ``xcode-select --install``
  - Ubuntu 14.04: ``sudo apt-get install build-essential gcc-4.9 g++-4.9``
  
#### Node.js >= 8.6.0
  - [NVM](https://github.com/creationix/nvm#installation) (recommended)
  - "one-click" [Installer](https://nodejs.org/en/download/current/)
  - your favourite
  [Package Manager](https://nodejs.org/en/download/package-manager/).

#### HDF5 library (Optional)

Adds HDF5 compatibility in addition to LMDB. Needs a rebuild of the project, not (currently) available through NPM.

Note: This is not yet implemented as a proper build option, so for now don't bother reading any further.

Before rebuild, add the hdf5 module with ``npm i hdf5``, then uncomment the HDF refs in ``src/convert/index.js`` and ``src/output/index.js`` and rebuild (see below).

  - [Official maintainer](https://www.hdfgroup.org/downloads/hdf5/)
  - macOS ([Homebrew](https://docs.brew.sh/Installation.html)):
  ``brew install hdf5``
  - Ubuntu: ``sudo apt-get install libhdf5-dev``

## Install

```shell
# On Ubuntu 14.04 first select the correct compiler
export CC=gcc-4.9 && CXX=g++-4.9

# Otherwise only run this
npm install -g metakit
```

## Build

```shell
# Clone the repo, then run
npm run build
```
