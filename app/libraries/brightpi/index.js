#!/bin/env node

{
  const i2c = require('i2c');
  const debug = require('debug')('sc620');
  let sc620 = function() {
    'use strict';
    if (!(this instanceof sc620)) return new sc620();
    this.device_address = 0x70;
    this.led_control_all_white = 0x5a;
    this.led_control_all_ir = 0xa5;
    this.gain_register = 0x09;
    this.bus = (process.env.BRIGHTPI_I2C_BUS == null) ? '/dev/i2c-1' : process.env.BRIGHTPI_I2C_BUS;
    this.wire = new i2c(this.device_address, {
      device: this.bus
    });
  };

  sc620.prototype.switch_white_leds_on = function() {
    'use strict';
    this.wire.write(Buffer([0x00, this.led_control_all_white]), (err) => {
      debug(err);
    });
  };
  sc620.prototype.switch_ir_leds_on = function() {
    'use strict';
    this.wire.write(Buffer([0x00, this.led_control_all_ir]), (err) => {
      debug(err);
    });
  };
  sc620.prototype.switch_leds_off = function() {
    'use strict';
    this.wire.write(Buffer([0x00, 0x00]), (err) => {
      debug(err);
    });
  };
  sc620.prototype.dim_led = function(led, value) {
    'use strict';
    this.wire.write(Buffer([led, value]), (err) => {
      debug(err);
    });
  };
  sc620.prototype.dim_leds = function(value) {
    'use strict';
    for (var i = 1; i < 9; i++) {
      this.dim_led(i,value);
    }
  };
  sc620.prototype.set_default_gain = function() {
    'use strict';
    this.wire.write(Buffer([this.gain_register, 0b1000]), (err) => {
      debug(err);
    });
  };

  module.exports = sc620();
}
