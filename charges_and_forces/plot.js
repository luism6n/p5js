'use strict';

/** Plot class */

var Plot = function(description) {
  this.axisWeight = 2;
  this.pointWeight = 1;
  this.hightlightWeight = 5;
  for (var opt in description) {
    if (description.hasOwnProperty(opt)) {
      this[opt] = description[opt];
    }
  }
}

Plot.prototype.draw = function() {
  push();
  scale(1, -1);
  strokeWeight(this.axisWeight);
  this.drawAxes();
  strokeWeight(this.pointWeight);
  this.drawPoints();
  strokeWeight(this.hightlightWeight);
  this.drawHighLights();
  pop();
}

Plot.prototype.drawAxes = function() {
  var w = this.width;
  var h = this.height;

  line(0, 0, w, 0);
  line(0, 0, 0, h);
}

Plot.prototype.mapInterval = function(value, oldMin, oldMax, newMin, newMax) {
  return (value - oldMin)*(newMax - newMin)/(oldMax - oldMin) + newMin;
}

Plot.prototype.drawPoints = function() {
  var xData = this.xData;
  var yData = this.yData;
  var xRange = this.xRange;
  var yRange = this.yRange;
  var width = this.width;
  var height = this.height;

  beginShape();
  noFill();
  for (var i = 0; i < xData.length; i++) {
    var x = this.mapInterval(xData[i], xRange[0], xRange[1], 0, width);
    var y = this.mapInterval(yData[i], yRange[0], yRange[1], 0, height);
    var xInside = x >= 0 && x < width;
    var yInside = y >= 0 && y < height;
    if (xInside && yInside) {
      vertex(x, y);
    }
  }
  endShape();
}

Plot.prototype.drawHighLights = function() {
  var highlights = this.highlights;
  var xData = this.xData;
  var yData = this.yData;
  var xRange = this.xRange;
  var yRange = this.yRange;
  var width = this.width;
  var height = this.height;

  for (var i = 0; i < highlights.length; i++) {
    var highlight = highlights[i];
    var k = xData.indexOf(highlight);
    if (k >= 0) {
      var x = this.mapInterval(xData[k], xRange[0], xRange[1], 0, width);
      var y = this.mapInterval(yData[k], yRange[0], yRange[1], 0, height);
      var xInside = x >= 0 && x < width;
      var yInside = y >= 0 && y < height;
      if (xInside && yInside) {
        point(x, y);
      }
    }
  }
}
