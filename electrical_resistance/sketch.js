'use strict';

/* 1/(4*PI*epsilon_0) */
var k = 25;

/** Ball class */

var Electron = function(x, y) {
  this.position = createVector(x, y);
  this.velocity = createVector(0, 0);
  this.force = createVector(0, 0);
  this.radius = 0.05*unit;
  this.mass = 1;
  this.charge = -1;
}

Electron.prototype.draw = function() {
  this.velocity.add(this.force.div(this.mass));

  this.position.add(this.velocity);

  if (this.position.x > width) {
    this.position.x = -10;
    this.velocity.set(0, 0);
  }

  if (this.position.y > height - 20 && this.position.y < 20) {
    this.position.sub(this.velocity);
    this.velocity.y = -this.velocity.y;
    this.position.add(this.velocity);
  }

  push();
  translate(this.position.x, this.position.y);
  ellipse(0, 0, this.radius);
  pop();
  this.force.set(0, 0);
}

Electron.prototype.interactWith = function(thing) {
  if (thing === this) {

  } else if (thing instanceof Electron) {
    var r = p5.Vector.sub(this.position, thing.position);
    var d = r.mag();
    var f = p5.Vector.mult(r.normalize(), this.charge*thing.charge*k/(max(10000, d*d)));
    this.force.add(f);
  } else if (thing instanceof Wall) {
    var d = p5.Vector.sub(this.position, thing.position).dot(thing.normal);
    var f = p5.Vector.mult(thing.normal, k*thing.charge*this.charge/(d*d));
    this.force.add(f);
  }
}

var Wall = function(x, y, w, h, normalX, normalY) {
  this.position = createVector(x, y);
  this.width = w;
  this.height = h;
  this.normal = createVector(normalX, normalY);
  this.charge = -5;
}

Wall.prototype.draw = function() {
  push();
  rectMode(CENTER);
  translate(this.position.x, this.position.y);
  rect(0, 0, this.width, this.height);
  pop();
}

var numFreeElectrons = 150;
var numBoundElectrons = 64;
var freeElectrons = [];
var boundElectrons = [];
var allElectrons = [];
var walls = [];
var size, unit;

function setup() {
  size = Math.min(windowWidth, windowHeight) - 20;
  unit = size/7;
  createCanvas(size, size);

  walls.push(new Wall(3.5*unit, 3*unit - 10, size, 20, 0, 1)); /* top wall */
  walls.push(new Wall(3.5*unit, 4*unit + 10, size, 20, 0, -1)); /* bottom wall */

  var sqrtNumBoundElectrons = floor(sqrt(numBoundElectrons));
  for (var i = 0; i < sqrtNumBoundElectrons; i++) {
    for (var j = 0; j < sqrtNumBoundElectrons; j++) {
      var x = 3*unit;
      var y = 3*unit;

      x += constrain(randomGaussian(0.5, 0.05), 0, 1)*unit/sqrtNumBoundElectrons;
      y += constrain(randomGaussian(0.5, 0.05), 0, 1)*unit/sqrtNumBoundElectrons;

      x += j*unit/sqrtNumBoundElectrons;
      y += i*unit/sqrtNumBoundElectrons;

      boundElectrons.push(new Electron(x, y));
    }
  }

  var numFreeElectronsLeft = floor(numFreeElectrons/2);
  var numFreeElectronsRight = numFreeElectrons - numFreeElectronsLeft;
  for (var i = 0; i < numFreeElectronsLeft; i++) {
    var x = 0;
    var y = 3*unit;

    x += constrain(randomGaussian(0.5, 0.05), 0, 1)*3*unit/numFreeElectronsLeft;
    y += constrain(randomGaussian(0.5, 0.05), 0, 1)*unit;

    x += i*3*unit/numFreeElectronsLeft;

    freeElectrons.push(new Electron(x, y));
  }
}

function draw() {
  background(255);
  fill(0, 180, 180);
  stroke(0, 180, 180);

  for (var i = 0; i < walls.length; i++) {
    walls[i].draw();
  }

  for (var i = 0; i < numBoundElectrons; i++) {
    boundElectrons[i].draw();
  }

  for (var i = 0; i < floor(numFreeElectrons/2); i++) {
    for (var j = 0; j < numBoundElectrons; j++) {
      freeElectrons[i].interactWith(boundElectrons[j]);
    }

    for (var j = 0; j < floor(numFreeElectrons/2); j++) {
      freeElectrons[i].interactWith(freeElectrons[j]);
    }

    for (var j = 0; j < walls.length; j++) {
      freeElectrons[i].interactWith(walls[j]);
    }

    freeElectrons[i].force.add(0.002*k, 0);
    freeElectrons[i].draw();
  }
}

function windowResized() {
  var size = Math.min(windowWidth, windowHeight);
  resizeCanvas(size, size);
  ball.baseRadius = 0.4*size;
}

function mousePressed() {
  background(255);
  var electron = electrons[0];
  electron.velocity = p5.Vector.sub(createVector(mouseX, mouseY), electron.position).normalize().mult(k/1000);
}
