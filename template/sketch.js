'use strict';

var Circle = function(x, y, minRadius, maxRadius) {
  this.x = x;
  this.y = y;
  this.minRadius = minRadius;
  this.maxRadius = maxRadius;
  this.bouncePeriod = 1000; /* in ms */
  this.bounceFrequency = 1/this.bouncePeriod;
  this.time = 0;
};

Circle.prototype.draw = function(dt) {
  this.time += dt;

  var amplitude = this.maxRadius - this.minRadius;
  var bounce = amplitude*(2 + sin(TWO_PI*this.bounceFrequency*this.time))/2;
  var radius = this.minRadius + bounce;

  ellipse(this.x, this.y, 2*radius);
};

var circle;
var now, then, dt;

function setup() {
  var L = 0.9*min(windowWidth, windowHeight);

  createCanvas(L, L);

  circle = new Circle(L/2, L/2, 0.8*L/4, 0.8*L/2);

  then = millis();
}

function draw() {
  background(255);

  now = millis();
  dt = now - then;

  fill(0, 240, 240);
  circle.draw(dt);

  then = now;
}
