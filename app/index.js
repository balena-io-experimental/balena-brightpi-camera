{
  const chalk = require("chalk");
  const fs = require('fs');
  const PiCamera = require('pi-camera');
  const brightpi = require(__dirname + '/libraries/brightpi/index.js');
  const mp4box = require(__dirname + '/libraries/mp4box/index.js');
  const express = require('express');
  const compression = require('compression');
  const bodyParser = require("body-parser");
  const nocache = require('nocache');
  const app = express();
  const camera = new PiCamera({
    mode: 'video',
    output: `/data/video.h264`,
    width: 800,
    height: 600,
    timeout: 15000, // Record for 5 seconds
    nopreview: true,
    rotation: 90
  });

  let currentVideo = "";
  let currentTempVideo = "";

  recordLoop = function() {
    'use strict';
    camera.record()
      .then((result) => {
        currentTempVideo = '/data/' + Math.floor(new Date() / 1000) + '.mp4';
        mp4box.convert(`/data/video.h264`, currentTempVideo, (err) => {
          if (err) {
            console.log(chalk.red(err));
          }
          fs.unlink(currentVideo, (err) => {
            if (err) {
              console.log(chalk.red(err));
            }
            currentVideo = currentTempVideo;
          });
        });

      })
      .catch((error) => {
        console.log(chalk.red(error));
      });
  };

  errorHandler = (err, req, res, next) => {
    'use strict';
    res.status(500);
    res.render('error', {
      error: err
    });
  };
  app.use(compression());
  app.use(bodyParser.json());
  app.use(nocache());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(function(req, res, next) {
    'use strict';
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use(errorHandler);

  app.post('/v1/white/', (req, res) => {
    'use strict';
    // Draws the Emoji on the LED Display
    brightpi.switch_white_leds_on();
    res.status(200).send('OK');
  });

  app.post('/v1/ir/', (req, res) => {
    'use strict';
    // Draws the Emoji on the LED Display
    brightpi.switch_ir_leds_on();
    res.status(200).send('OK');
  });

  app.delete('/v1/all/', (req, res) => {
    'use strict';
    // Draws the Emoji on the LED Display
    brightpi.switch_leds_off();
    res.status(200).send('OK');
  });

  app.put('/v1/brightness/:value', (req, res) => {
    'use strict';
    if (!req.params.value || req.params.value < 1 || req.params.value > 50) {
      return res.status(400).send('Bad Request');
    }
    // Draws the Emoji on the LED Display
    brightpi.dim_leds(parseInt(req.params.value));
    res.status(200).send('OK');
  });

  app.get('/v1/video/', (req, res) => {
    'use strict';
    res.set("Content-Disposition", "attachment;filename=" + currentVideo);
    res.sendFile(currentVideo);
  });

  recordLoop();
  let recordInterval = setInterval(recordLoop, 25000);

  app.listen(80, () => {
    'use strict';
    console.log(chalk.cyan('Boot complete'));
  });

}
