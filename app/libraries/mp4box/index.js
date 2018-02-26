#!/bin/env node

{
  const fs = require('fs');
  const {
    exec
  } = require('child_process');
  const debug = require('debug')('mp4box');
  let mp4box = function() {
    'use strict';
    if (!(this instanceof mp4box)) return new mp4box();
  };

  mp4box.prototype.convert = function(source, destination, cb) {
    'use strict';
    exec('MP4Box -add ' + source + ' ' + destination, (error, stdout, stderr) => {
      if (error) {
        cb(error);
      }
      fs.unlink(source, (err) => {
        cb(err);
      });
    });
  };

  module.exports = mp4box();
}
