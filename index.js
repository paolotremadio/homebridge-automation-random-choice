var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-automation-random-choice", "AutomationRandomChoice", AutomationRandomChoice);
}

function AutomationRandomChoice(log, config) {
  this.log = log;
  this.name = config["name"];
  this.sensors = config["sensors"] || 1;

  this.selectedSensor = 0;
  this.isSwitchOn = false;

  this.serviceSwitch = new Service.Switch(this.name);

  this.serviceSwitch
    .getCharacteristic(Characteristic.On)
    .on('get', this.getOn.bind(this))
    .on('set', this.setOn.bind(this));

  this.serviceMotions = [];

  for (let x = 1; x <= this.sensors; x++) {
    let serviceMotion = new Service.MotionSensor(this.name + ' Trigger ' + x, x);

    serviceMotion.getCharacteristic(Characteristic.MotionDetected)
      .on('get', function(callback) {
        callback(null, this.selectedSensor === x);
      }.bind(this));

    this.serviceMotions.push(serviceMotion);
  }

}

AutomationRandomChoice.prototype.getOn = function(callback) {
  callback(null, this.isSwitchOn);
}

AutomationRandomChoice.prototype.setOn = function(on, callback) {
  if (on) {
    this.log("Switch turned on, picking a random value...");

    //Turn on the switch
    this.isSwitchOn = true;

    // Automatically turn off after one second, to help with the automation
    setTimeout(function() {
      this.isSwitchOn = false;
      this.serviceSwitch.setCharacteristic(Characteristic.On, false);
    }.bind(this), 1000);


    // Pick which sensor to trigger
    const minValue = 1;
    const maxValue = this.sensors;

    this.selectedSensor = parseInt(Math.floor(Math.random() * (maxValue - minValue + 1) + minValue));
    this.log("Firing event on sensor: " + this.selectedSensor);

    //Trigger the sensor
    const sensor = this.serviceMotions[this.selectedSensor - 1];
    sensor.setCharacteristic(Characteristic.MotionDetected, true);

    // Automatically turn off to help with the automation
    setTimeout(function() {
      this.selectedSensor = 0;
      sensor.setCharacteristic(Characteristic.MotionDetected, false);
    }.bind(this), 2000);
  }

  callback();
}

AutomationRandomChoice.prototype.getServices = function() {
  return [this.serviceSwitch, ...this.serviceMotions];
}