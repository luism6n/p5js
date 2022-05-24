'use strict';

var reservoirArea, boardArea;
var boardGroup;
var numCharges = 6, charges, lastDraggedCharges;
var plotGauge, vectorGauge, forceGauge;

var k = 10000; // coulomb's constant

var size, unit; /* unit is size/8 */
var windowResizedToggled;
var dragOffsetX, dragOffsetY;

function initBoard() {
  boardArea = createSprite(3*unit, 3*unit, 6*unit, 6*unit);
  //boardArea.shapeColor = color('#2C2825');
  boardArea.draw = function() {
    push();
    fill(color('#2C2825'));
    rect(0, 0, 6*unit, 6*unit);
    stroke(color(165, 165, 140, 60));
    translate(-this.width/2, -this.height/2);
    drawGrid(this.width, this.height, unit/2, unit/2, 0, 0);
    pop();
  }
}

function initReservoir() {
  reservoirArea = createSprite(7*unit, 3*unit, 2*unit, 6*unit);
  reservoirArea.shapeColor = color('#EFCD6B');
}

function drawGrid(gridWidth, gridHeight, xtic, ytic, xo, yo) {
  var x = xo - xtic*floor(xo/xtic);
  var y = yo - ytic*floor(yo/xtic);
  while (x < gridWidth) {
    line(x, 0, x, gridHeight);
    x += xtic;
  }

  while (y < gridHeight) {
    line(0, y, gridWidth, y);
    y += ytic;
  }
}

function forceDisplay() {
  push();
  /* put origin in the top, left corner of the gauge */
  rectMode(CORNER);
  translate(-this.width/2, -this.height/2);

  fill(color('#A5A58C'));
  rect(0, 0, this.width, this.height);
  fill(color('#2C2825'));
  rect(0, unit/2, this.width, this.height - unit/2);

  fill(color('#2C2825'));
  textSize(18);
  textAlign(LEFT, TOP);
  text(this.text, unit/8, unit/8);

  if (boardGroup.length > 1
      && boardGroup.indexOf(lastDraggedCharges[1]) != -1) {
    /* put origin in the center of the display */
    var reference = lastDraggedCharges[1];
    var rvx = 0, rvy = 0;
    for (var i = 0; i < boardGroup.length; i++) {
      var charge = boardGroup[i];
      if (charge !== reference) {
        var xr = reference.position.x, yr = reference.position.y;
        var xc = charge.position.x, yc = charge.position.y;
        var xv = xr - xc, yv = yr - yc;
        var d = sqrt(pow(xv, 2) + pow(yv, 2));
        var force = k*reference.magnitude*charge.magnitude/pow(d, 2);
        rvx += force*xv/d;
        rvy += force*yv/d;
      }
    }
    var resultingForce = sqrt(pow(rvx, 2) + pow(rvy, 2));

    translate(0, unit/2);
    stroke(color('#A5A58C'));
    fill(color('#A5A58C'));
    text(resultingForce.toFixed(3) + ' N', unit/8, unit/8);
  }
  pop();
}

function plotDisplay() {
  push();
  /* put origin in the top, left corner of the gauge */
  rectMode(CORNER);
  translate(-this.width/2, -this.height/2);

  fill(color('#A5A58C'));
  rect(0, 0, this.width, this.height);
  fill(color('#2C2825'));
  rect(0, unit/2, this.width, this.height - unit/2);

  fill(color('#2C2825'));
  textSize(18);
  textAlign(LEFT, TOP);
  text(this.text, unit/8, unit/8);

  if (boardGroup.indexOf(lastDraggedCharges[1]) != -1
      && boardGroup.indexOf(lastDraggedCharges[0]) != -1) {
    /* put origin in the center of the display */
    var reference = lastDraggedCharges[1];
    var charge = lastDraggedCharges[0];
    var dx = 0.1*unit;
    var xMin = unit, xMax = 10*unit;
    var x = [], y = [];

    var xr = reference.position.x, yr = reference.position.y;
    var xc = charge.position.x, yc = charge.position.y;
    var xv = xr - xc, yv = yr - yc;
    var d = sqrt(pow(xv, 2) + pow(yv, 2));

    for (var i = 2*charge.radius; i < d; i += dx) {
      x.push(i);
      y.push(abs(k*reference.magnitude*charge.magnitude/(i*i)));
    }

    x.push(d);
    y.push(abs(k*reference.magnitude*charge.magnitude/(d*d)));

    for (var i = d; i < xMax; i += dx) {
      x.push(i);
      y.push(abs(k*reference.magnitude*charge.magnitude/(i*i)));
    }

    var plot = new Plot({
      xData: x,
      yData: y,
      xRange: [0, xMax],
      yRange: [0, k/(2*charge.radius*2*charge.radius) + 0.001],
      highlights: [d],
      width: 2*unit - 2*unit/8,
      height: 3*unit/2 - 2*unit/8
    });

    fill('#A5A58C');
    stroke('#A5A58C');
    translate(unit/8, 2*unit - unit/8);
    plot.draw();
  }
  pop();
}

function vectorDisplay() {
  push();
  /* put origin in the top, left corner of the gauge */
  rectMode(CORNER);
  translate(-this.width/2, -this.height/2);

  fill(color('#A5A58C'));
  rect(0, 0, this.width, this.height);
  fill(color('#2C2825'));
  rect(0, unit/2, this.width, this.height - unit/2);

  fill(color('#2C2825'));
  textSize(18);
  textAlign(LEFT, TOP);
  text(this.text, unit/8, unit/8);

  if (boardGroup.length > 1
      && boardGroup.indexOf(lastDraggedCharges[1]) != -1) {
    /* put origin in the center of the display */
    var reference = lastDraggedCharges[1];
    var rvx = 0, rvy = 0;
    var vectors = [];
    var forces = [];
    var colors = [];
    for (var i = 0; i < boardGroup.length; i++) {
      var charge = boardGroup[i];
      if (charge !== reference) {
        var xr = reference.position.x, yr = reference.position.y;
        var xc = charge.position.x, yc = charge.position.y;
        var xv = xr - xc, yv = yr - yc;
        var d = sqrt(pow(xv, 2) + pow(yv, 2));
        var force = reference.magnitude*charge.magnitude/pow(d, 2);
        rvx += force*xv/d;
        rvy += force*yv/d;
        vectors.push([xv/d, yv/d]);
        forces.push(force);
        colors.push(charge.fillingColor);
      }
    }
    var resultingForce = sqrt(pow(rvx, 2) + pow(rvy, 2));
    forces.push(resultingForce);
    vectors.push([rvx/resultingForce, rvy/resultingForce]);
    colors.push(color('#A5A58C'));

    /* draw grid */
    var displayHeight = 3*unit/2;
    var displayWidth = 2*unit;
    var maxForce = max(forces.map(function(f) {return abs(f)}));
    var maxVectorLength = displayHeight/2 - unit/8

    var cellSize = maxVectorLength/(pow((unit/2)*5, 2)*maxForce);

    translate(0, unit/2);
    stroke(color(165, 165, 140, 60));
    strokeWeight(1);
    drawGrid(displayWidth, displayHeight, cellSize, cellSize, this.width/2, 3*unit/4);
    translate(this.width/2, 3*unit/4);

    forces = forces.map(function(f) {return maxVectorLength*f/maxForce});
    for (var i = 0; i < vectors.length; i++) {
      var v = vectors[i];
      var f = forces[i];
      stroke(colors[i]);
      fill(colors[i]);
      drawVector(f*v[0], f*v[1]);
    }
  }
  pop();
}

function drawVector(x, y) {
  push();
  strokeWeight(2);
  var angle = atan2(y, x);
  var length = sqrt(x*x + y*y);
  rotate(angle);
  line(0, 0, length, 0);
  strokeWeight(1);
  translate(length, 0);
  beginShape();
    vertex(0, 0);
    vertex(-5, -3);
    vertex(-5, 3);
  endShape(CLOSE);
  pop();
}

function dummyDisplay() {
  push();
  /* put origin in the top, left corner of the gauge */
  rectMode(CORNER);
  translate(-this.width/2, -this.height/2);

  fill(color('#A5A58C'));
  rect(0, 0, this.width, this.height);
  fill(color('#2C2825'));
  rect(0, unit/2, this.width, this.height - unit/2);

  fill(color('#2C2825'));
  textSize(18);
  textAlign(LEFT, TOP);
  text(this.text, unit/8, unit/8);
  pop();
}

function initGauges() {
  plotGauge = createSprite(1*unit, 7*unit, 2*unit - 1, 2*unit - 1);
  plotGauge.draw = plotDisplay;
  plotGauge.text = 'Plot';
  vectorGauge = createSprite(3*unit, 7*unit, 2*unit - 1, 2*unit - 1);
  vectorGauge.draw = vectorDisplay;
  vectorGauge.text = 'Diagram';
  forceGauge = createSprite(5*unit, 7*unit, 2*unit - 1, 2*unit - 1);
  forceGauge.draw = forceDisplay;
  forceGauge.text = 'Magnitude';
}

function createCharge(positionsInterval) {
  var x, y;
  var radius = 6*unit/20;
  x = positionsInterval[0] + radius + random()*(positionsInterval[2] - positionsInterval[0] - 2*radius);
  y = positionsInterval[1] + radius + random()*(positionsInterval[3] - positionsInterval[1] - 2*radius);
  var charge = createSprite(x, y);

  charge.radius = radius;

  if (random() >= 0.5) {
    charge.fillingColor = color('#4C8A73');
    charge.magnitude = +1;
  } else {
    charge.fillingColor = color('#D0502B');
    charge.magnitude = -1;
  }

  charge.setCollider('circle', 0, 0, radius);

  charge.draw = function() {
    push();
    fill(this.fillingColor);
    ellipse(0, 0, 2*radius, 2*radius);

    var highlight = 0;
    if (this === lastDraggedCharges[1]) {
      highlight = 4;
    } else if (this === lastDraggedCharges[0]) {
      highlight = 2;
    }
    strokeWeight(highlight);
    stroke(255);
    noFill();
    ellipse(0, 0, 2*radius - highlight/2, 2*radius - highlight/2);
    pop();
  };

  charge.dragged = false;

  return charge;
}

function initCharges() {
  charges = new Group();
  lastDraggedCharges = [];
  lastDraggedCharges[0] = createCharge([0, 0, boardArea.width/2, boardArea.height/2]);
  lastDraggedCharges[1] = createCharge([boardArea.width/2, boardArea.height/2, boardArea.width, boardArea.height]);
  lastDraggedCharges[0].addToGroup(charges);
  lastDraggedCharges[1].addToGroup(charges);
  for (var i = 2; i < numCharges; i++) {
    var interval = [boardArea.width, 0, width, reservoirArea.height];
    var charge = createCharge(interval);
    charge.addToGroup(charges);
    for (var j = 0; j < charges.length; j++) {
      charge.displace(charges[j]);
    }
  }
}

function updateBoardGroup() {
  boardGroup = new Group();

  for (var i = 0; i < charges.length; i++) {
    var charge = charges[i];
    if (boardArea.overlapPoint(charge.position.x, charge.position.y)) {
      charge.addToGroup(boardGroup);
    }
  }
}

function setup() {
  size = Math.min(windowWidth - 50, windowHeight - 50);
  unit = size/8;

  createCanvas(size, size);
  initBoard();
  initReservoir();
  initCharges();
  updateBoardGroup();
  initGauges();
}

function moveLastDraggedCharge() {
  var charge = lastDraggedCharges[1];
  charge.position.x = mouseX + dragOffsetX;
  charge.position.y = mouseY + dragOffsetY;
}

function displaceCharges() {
  var toMove = [lastDraggedCharges[1]];
  var moved = [];

  while (toMove.length != 0) {
    var displacer = toMove[0];
    for (var i = 0; i < charges.length; i++) {
      var displaced = charges[i];
      if (displaced !== displacer
          && displacer.displace(displaced)
          && moved.indexOf(displaced) == -1
          && toMove.indexOf(displaced) == -1) {
        toMove.push(displaced);
      }
    }
    moved.push(displacer);
    toMove.shift();
  }
}

function draw() {
  background(255);

  if (lastDraggedCharges[1].dragged) {
    moveLastDraggedCharge();
    displaceCharges();
  }

  updateBoardGroup();
  drawSprites(boardArea);
  drawGrid(boardArea.width, boardArea.height, unit/2, unit/2, 0, 0);
  drawSprites();
}

function dragCharge(charge) {
  if (lastDraggedCharges[1] !== charge) {
    lastDraggedCharges.shift();
    lastDraggedCharges.push(charge);
  }
  dragOffsetX = charge.position.x - mouseX;
  dragOffsetY = charge.position.y - mouseY;
  lastDraggedCharges[1].dragged = true;
}

function checkDragged() {
  for (var i = 0; i < charges.length; i++) {
    var charge = charges[i];
    if (charge.overlapPoint(mouseX, mouseY)) {
      dragCharge(charge);
    }
  }
}

function mousePressed() {
  checkDragged();
}

function mouseReleased() {
  lastDraggedCharges[1].dragged = false;
}

function windowResized() {
  var size = Math.min(windowWidth, windowHeight);
  resizeCanvas(size, size);
}
