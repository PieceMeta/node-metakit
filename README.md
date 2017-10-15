# metakit

A toolkit to handle storage, playback and distribution of structured alphanumerical data.

[![npm version](https://badge.fury.io/js/metakit.svg)](https://badge.fury.io/js/metakit)
[![Code Climate](https://codeclimate.com/github/PieceMeta/node-metakit/badges/gpa.svg)](https://codeclimate.com/github/PieceMeta/node-metakit)
[![Build Status](https://travis-ci.org/PieceMeta/node-metakit.svg?branch=master)](https://travis-ci.org/PieceMeta/node-metakit)

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

Adds HDF5 compatibility. Needs a rebuild of the project, not (currently) available through npm.

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
