'use strict';

/* Constants for right, top, left, bottom. */
var R = 0, T = 1, L = 2, B = 3;

/* Pieces have a number `n`, x and y coordinates `x` and `y`, and a side size
 * `size`. */
var Piece = function(n, x, y, side) {
  this.x = x;
  this.y = y;

  this.n = n;

  this.side = side;

  /* `orient[R]` is true if the piece points to the right. The same applies to
   * `T`, `L`, `B`. */
  this.orient = random([
    [true, true, false, false],
    [false, true, true, false],
    [false, false, true, true],
    [true, false, false, true],

    [true, true, true, false],
    [false, true, true, true],
    [true, false, true, true],
    [true, true, false, true],

    [true, false, false, false],
    [false, true, false, false],
    [false, false, true, false],
    [false, false, true, false],
  ]);

  /* The RGB-color components of the piece. */
  this.r = 0;
  this.g = 120;
  this.b = 120;
}

Piece.prototype.turn = function() {
  /* Roll the array. */
  this.orient.push(this.orient.shift());

  /* Increase the color brightness. */
  this.g += 10;
  this.b += 10;
}

Piece.prototype.draw = function() {
  var third;

  third = this.side/3;

  push();

  translate(this.x, this.y);

  stroke(this.r, this.g, this.b);
  fill(this.r, this.g, this.b);

  rect(third, third, third, third);
  if (this.orient[R]) rect(2*third, third, third, third);
  if (this.orient[T]) rect(third, 0, third, third);
  if (this.orient[L]) rect(0, third, third, third);
  if (this.orient[B]) rect(third, 2*third, third, third);

  pop();
}

var sz; /* Canvas size. */
var N = 25; /* Size of pieces grid. */
var pieces, neighbors; /* Array of pieces and their neighbors. */

/* touched[n] is true if the nth piece was touched by a turning piece in the
 * current round. It's false otherwise.
 *
 * to_turn[n] is true if the nth piece must be turned this round. It's false
 * otherwise.
 *
 * clicked contains the pieces that were clicked on the last round. */
var touched, to_turn, clicked;

function setup() {
  var n, i, j;
  var x, y;
  var right, top_, left, bottom;

  sz = 0.9*min(windowWidth, windowHeight);

  createCanvas(sz, sz);
  frameRate(24);

  pieces = [];
  to_turn = [];
  touched = [];
  for (n = 0; n < N*N; n++) {
    i = floor(n/N);
    j = n%N;
    x = j*sz/N;
    y = i*sz/N;

    pieces[n] = new Piece(n, x, y, sz/N);
    to_turn[n] = false;
    touched[n] = false;
  }

  neighbors = [];
  for (n = 0; n < N*N; n++) {
    i = floor(n/N);
    j = n%N;

    /* No wrap. */
    right  = (j == N - 1) ? null : pieces[i*N + (j + 1)];
    top_   = (i == 0)     ? null : pieces[(i - 1)*N + j];
    left   = (j == 0)     ? null : pieces[i*N + (j - 1)];
    bottom = (i == N - 1) ? null : pieces[(i + 1)*N + j];

    neighbors[n] = [right, top_, left, bottom];
  }

  clicked = [];
}

function draw() {
  var c, n, m;
  var tmp;
  var piece, neighs;

  background(255);

  /* Marked clicked pieces to be turned. */
  for (c = 0; c < clicked.length; c++) {
    to_turn[clicked[c]] = true;
  }

  /* Reset clicked pieces. */
  clicked = [];

  /* Turn pieces marked to be turned. */
  for (n = 0; n < N*N; n++) {
    if (to_turn[n]) pieces[n].turn();
  }

  /* Reset the pieces that are touched. */
  for (n = 0; n < N*N; n++) {
    touched[n] = false;
  }

  for (n = 0; n < N*N; n++) {
    if (to_turn[n]) {
      piece = pieces[n];
      neighs = neighbors[n];

      /* If the right neighbor points to the left and the piece points to the
       * right, they're touching. Same for top, left and bottom neighbors. The
       * Neighbors might be null, hence the first test. */
      if (neighs[R] && neighs[R].orient[L] && piece.orient[R])
        touched[neighs[R].n] = true;

      if (neighs[T] && neighs[T].orient[B] && piece.orient[T])
        touched[neighs[T].n] = true;

      if (neighs[L] && neighs[L].orient[R] && piece.orient[L])
        touched[neighs[L].n] = true;

      if (neighs[B] && neighs[B].orient[T] && piece.orient[B])
        touched[neighs[B].n] = true;
    }
  }

  for (n = 0; n < N*N; n++) {
    pieces[n].draw();
  }

  /* Pieces touched should now turn. */
  tmp = to_turn;
  to_turn = touched;
  touched = tmp;
}

function mousePressed() {
  var i, j;

  j = floor(mouseX/(sz/N));
  i = floor(mouseY/(sz/N));

  if (i >= 0 && i < N && j >= 0 && j < N) {
    clicked.push(i*N + j);
  }
}
