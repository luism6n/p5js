/*
 * This is based on a sketch done by Ale from OpenProcessing. I took advantage
 * of the manual labour: the transcript of the rules they made in their code.
 * The original sketch can be found here:
 * https://www.openprocessing.org/sketch/162169
 * and the tiling codes here:
 * http://jacques-andre.fr/faqtypo/truchet/truchet-planches.pdf
 */

'use strict';

/* Most variables are initialized in setup(). */

/* Board has size `L` by `L` and `N` by `N` tiles. `NMin` and `NMax` are
 * defined because of the GUI. */
var L, N = 10, NMin = 5, NMax = 25;
/* Tiles array. */
var tiles;
/* Dark and light colors palettes. */
var dark_colors, light_colors;
/* Graphical user interface. */
var gui;
/* `patterns` is an object mapping the pattern code to the pattern. `pattern`
 * is the current pattern and `prev_pattern` is the previous pattern. `code` is
 * the current code and `prev_code` is the previous code, to check if pattern
 * changed. */
var patterns, pattern, prev_pattern, prev_code;
var code = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
  'R', 'S', 'T', 'V', 'U', 'X', 'Y', 'Z', 'Aa', 'Ba', 'Ca', 'Da', 'Ea', 'Fa',
  'Ga', 'Ha', 'Ia', 'Ka', 'La', 'Ma', 'Na', 'Oa', 'Pa', 'Qa', 'Ra', 'Sa', 'Ta',
  'Va', 'Ua', 'Xa', 'Ya', 'Za', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Hb',
  'Ib', 'Kb', 'Lb', 'Mb', 'Nb', 'Ob', 'Pb', 'Qb', 'Rb', 'Sb', 'Tb', 'Vb', 'Ub',
  'Xb', 'Yb', 'Zb', 'Ac', 'Bc', 'Cc', 'Dc', 'Ec', 'Fc', 'Gc', 'Hc', 'Ic', 'Kc',
  'Lc', 'Mc', 'Nc', 'Oc', 'Pc', 'Qc', 'Rc', 'Sc', 'Tc', 'Vc', 'Uc', 'Xc', 'Yc',
  'Zc'
]

/* `orient` is one of: 'ul', 'ur', 'dl', 'dr'. 'ul' means the dark colored
 * half of the tile "points" to the up-left direction. 'ur' is up-right, 'dl'
 * is down-left and 'dr' is down-right. `side` is the size of its side and `x`
 * and `y` are its x and y coordinates. */
var Tile = function(x, y, orient, side) {
  this.x = x;
  this.y = y;
  this.orient = orient;
  this.dark_color = random(dark_colors);
  this.light_color = random(light_colors);
  this.side = side;
};

Tile.prototype.draw = function() {
  push();

  translate(this.x, this.y);

  strokeWeight(0);

  /* Decide if diagonal goes up or down, and which is the top and bottom
   * color. */
  var diagonal, top_color, bottom_color;
  switch (this.orient) {
    case 'ul':
      diagonal = 'up';
      top_color = this.dark_color;
      bottom_color = this.light_color;
      break;
    case 'ur':
      diagonal = 'down';
      top_color = this.dark_color;
      bottom_color = this.light_color;
      break;
    case 'dr':
      diagonal = 'up';
      top_color = this.light_color;
      bottom_color = this.dark_color;
      break;
    case 'dl':
      diagonal = 'down';
      top_color = this.light_color;
      bottom_color = this.dark_color;
      break;
  }

  /* Draw top triangle. */
  fill(top_color);
  if (diagonal == 'up') {
    triangle(0, this.side, 0, 0, this.side, 0);
  } else if (diagonal == 'down') {
    triangle(0, 0, this.side, 0, this.side, this.side, 0);
  }

  /* Draw bottom triangle. */
  fill(bottom_color);
  if (diagonal == 'up') {
    triangle(0, this.side, this.side, this.side, this.side, 0);
  } else if (diagonal == 'down') {
    triangle(0, 0, 0, this.side, this.side, this.side);
  }

  pop();
};

function setup() {
  L = 0.8*min(windowWidth, windowHeight);

  createCanvas(L, L);

  gui = createGui('Settings');
  gui.addGlobals('N', 'code');

  dark_colors = [
    color('#726255'),
    color('#372e29'),
    color('#000000'),
  ];
  light_colors = [
    color('#ecb939'),
    color('#f0c75e'),
  ];

  patterns = getPatterns();
  pattern = patterns[code];

  createTiles();
};

function createTiles() {
  var cols, rows, text;

  tiles = [];
  var board_row, board_col, pattern_row, pattern_col, x, y, orient;
  for (var n = 0; n < N*N; n++) {
    board_row = floor(n/N); // row on the board
    board_col = (n%N); // column on the board
    x = board_col*L/N;
    y = board_row*L/N;

    /* Mathsy math to repeat the pattern. */
    pattern_row = board_row%pattern.length;
    pattern_col = board_col%pattern[pattern_row].length;
    orient = pattern[pattern_row][pattern_col];

    tiles.push(new Tile(x, y, orient, L/N));
  }
};

function draw() {
  background(255);

  /* If user changed N or pattern code. */
  if (N*N != tiles.length) {
    createTiles();
  } else if (code != prev_code) {
    pattern = patterns[code];
    prev_code = code;
    createTiles();
  }

  for (var i = 0; i < N*N; i++) {
    tiles[i].draw();
  }
};

function getPatterns() {
  return {"Ra": [["ul", "ur", "ul", "ur", "dr", "dl", "dr", "dl"], ["dl", "dr", "dl", "dr", "ur", "ul", "ur", "ul"], ["ul", "ur", "ul", "ur", "dr", "dl", "dr", "dl"], ["dl", "dr", "dl", "dr", "ur", "ul", "ur", "ul"], ["dr", "dl", "dr", "dl", "ul", "ur", "ul", "ur"], ["ur", "ul", "ur", "ul", "dl", "dr", "dl", "dr"], ["dr", "dl", "dr", "dl", "ul", "ur", "ul", "ur"], ["ur", "ul", "ur", "ul", "dl", "dr", "dl", "dr"]], "Rb": [["ul", "dr", "dl", "dr", "dl", "ur"], ["dr", "ul", "dr", "dl", "ur", "dl"], ["ur", "dl", "ur", "ul", "dr", "ul"], ["dl", "ur", "ul", "ur", "ul", "dr"]], "Rc": [["dr", "ur", "dr", "ul", "dr", "ul", "dr", "ur"], ["ul", "dr", "ul", "dl", "ur", "dl", "ul", "dr"], ["dr", "ul", "dr", "ur", "dl", "ur", "dr", "ul"], ["ur", "dl", "ul", "dr", "ul", "dr", "ul", "dl"]], "Ba": [["dl", "dr", "ul", "ur", "dl", "dr"], ["ur", "dl", "dr", "dl", "dr", "ul"]], "Bb": [["dr", "ur", "dl", "ur", "ul", "ur", "dl", "ur"], ["ur", "dl", "ur", "ul", "ur", "dl", "ur", "dr"], ["dl", "ur", "ul", "ur", "dl", "ur", "dr", "ur"], ["ur", "ul", "ur", "dl", "ur", "dr", "ur", "dl"], ["ul", "ur", "dl", "ur", "dr", "ur", "dl", "ur"], ["ur", "dl", "ur", "dr", "ur", "dl", "ur", "ul"], ["dl", "ur", "dr", "ur", "dl", "ur", "ul", "ur"], ["ur", "dr", "ur", "dl", "ur", "ul", "ur", "dl"]], "Bc": [["dr", "dl", "dr", "dl", "dl", "dr"], ["ur", "dl", "dr", "ul", "ur", "ul"], ["ul", "ur", "ul", "ur", "dl", "dr"], ["dl", "ur", "ul", "dr", "ur", "ul"]], "D": [["ul", "dr", "dr"], ["dr", "ul", "dr"], ["dr", "dr", "ul"]], "H": [["ul", "ur", "dr", "dl"], ["ur", "ul", "dl", "dr"], ["dr", "dl", "ul", "ur"], ["dl", "dr", "ur", "ul"]], "Oc": [["ul", "ur", "dl", "ur", "dl", "dr", "ul", "dr"], ["dl", "dr", "ul", "dr", "ul", "ur", "dl", "ur"], ["ur", "ul", "dr", "ul", "dr", "dl", "ur", "dl"], ["dl", "dr", "ul", "dr", "ul", "ur", "dl", "ur"], ["ur", "ul", "dr", "ul", "dr", "dl", "ur", "dl"], ["dr", "dl", "ur", "dl", "ur", "ul", "dr", "ul"], ["ul", "ur", "dl", "ur", "dl", "dr", "ul", "dr"], ["dr", "dl", "ur", "dl", "ur", "ul", "dr", "ul"]], "Ob": [["ul", "ur", "dr", "dl"], ["dr", "ul", "ul", "dr"]], "Oa": [["ul", "dr", "dl", "dr"], ["dl", "dr", "ul", "ur"]], "P": [["ul", "ur", "dr", "dl"], ["dr", "dl", "ul", "ur"]], "T": [["ul", "ur", "dr", "dl"]], "X": [["ul", "ul", "ur", "ur", "dr", "dr", "dl", "dl"], ["ul", "ul", "ur", "ur", "dr", "dr", "dl", "dl"], ["ur", "ur", "ul", "ul", "dl", "dl", "dr", "dr"], ["ur", "ur", "ul", "ul", "dl", "dl", "dr", "dr"]], "Xb": [["ul", "dr", "dl", "ur", "dr", "ul", "ur", "dl"], ["dr", "dl", "dr", "dl", "ul", "ur", "ul", "ur"], ["ur", "ul", "ur", "ul", "dl", "dr", "dl", "dr"], ["dl", "ur", "ul", "dr", "ur", "dl", "dr", "ul"], ["dr", "ul", "ur", "dl", "ul", "dr", "dl", "ur"], ["ul", "ur", "ul", "ur", "dr", "dl", "dr", "dl"], ["dl", "dr", "dl", "dr", "ur", "ul", "ur", "ul"], ["ur", "dl", "dr", "ul", "dl", "ur", "ul", "dr"]], "Gc": [["ur", "dl", "ur", "dr", "dl", "ur", "ur", "ul"], ["dr", "dl", "ul", "ur", "ul", "dl", "ul", "dl"], ["ur", "ul", "ur", "dl", "ur", "dr", "dl", "ur"], ["ul", "dl", "dr", "dl", "ul", "ur", "ul", "dl"], ["dl", "ur", "ur", "ul", "ur", "dl", "ur", "dr"], ["ul", "dl", "ul", "dl", "dr", "dl", "ul", "ur"], ["ur", "dr", "dl", "ur", "ur", "ul", "ur", "dl"], ["ul", "ur", "ul", "dl", "ul", "dl", "dr", "dl"]], "Gb": [["ul", "dr", "dl", "ur"], ["ur", "dl", "dr", "ul"]], "Ga": [["dr", "dl", "dr", "dl", "ul", "ur", "ul", "ur"], ["ur", "dl", "dr", "ul", "dl", "dl", "dr", "dr"], ["dr", "ul", "ur", "dl", "ul", "ul", "ur", "ur"], ["ur", "ul", "ur", "ul", "dl", "dr", "dl", "dr"], ["ul", "ur", "ul", "ur", "dr", "dl", "dr", "dl"], ["dl", "dl", "dr", "dr", "ur", "dl", "dr", "ul"], ["ul", "ul", "ur", "ur", "dr", "ul", "ur", "dl"], ["dl", "dr", "dl", "dr", "ur", "ul", "ur", "ul"]], "Xc": [["ul", "ur"], ["dl", "dr"], ["ul", "dr", "ul", "ur", "dl", "ur"], ["dr", "ul", "dr", "dl", "ur", "dl"], ["ur", "ul"], ["dr", "dl"], ["ur", "dl", "ur", "ul", "dr", "ul"], ["dl", "ur", "dl", "dr", "ul", "dr"]], "Pb": [["ul", "dl", "ur", "dr"], ["dl", "ur", "dr", "ur"]], "Pc": [["ul", "ul", "ul", "dr", "ul", "ur", "dl", "ur", "ur", "ur"], ["ul", "ul", "dr", "ul", "dr", "dl", "ur", "dl", "ur", "ur"], ["ul", "dr", "ul", "dr", "ul", "ur", "dl", "ur", "dl", "ur"], ["dr", "ul", "dr", "ul", "ul", "ur", "ur", "dl", "ur", "dl"], ["ul", "dr", "ul", "ul", "dr", "dl", "ur", "ur", "dl", "ur"], ["dl", "ur", "dl", "dl", "ur", "ul", "dr", "dr", "ul", "dr"], ["ur", "dl", "ur", "dl", "dl", "dr", "dr", "ul", "dr", "ul"], ["dl", "ur", "dl", "ur", "dl", "dr", "ul", "dr", "ul", "dr"], ["dl", "dl", "ur", "dl", "ur", "ul", "dr", "ul", "dr", "dr"], ["dl", "dl", "dl", "ur", "dl", "dr", "ul", "dr", "dr", "dr"]], "Pa": [["ul", "ur", "dr"], ["dr", "ul", "ur"], ["ur", "dr", "ul"]], "G": [["ul", "ur"], ["dl", "dr"]], "Hb": [["ul", "dr", "dl", "ur"], ["dl", "ur", "ul", "dr"]], "Hc": [["ul", "dr", "ur"], ["dl", "ul", "ur"], ["dr", "ur", "dl"], ["ul", "dr", "dl"], ["dr", "ur", "ul"], ["ul", "ur", "dl"], ["ur", "dl", "dr"], ["dr", "dl", "ul"], ["ur", "ul", "dr"], ["ur", "dl", "ul"], ["dl", "dr", "ur"], ["dl", "ul", "dr"]], "Ha": [["ul", "dr", "dr", "ul"], ["dr", "ul", "ul", "dr"], ["dr", "ul", "ul", "dr"], ["ul", "dr", "dr", "ul"]], "C": [["dr"]], "Ma": [["dr", "dl", "ul", "ur"], ["ur", "dr", "dl", "ul"]], "Mc": [["dl", "dr", "ur", "ul"], ["dl", "dr", "ur", "ul"], ["ur", "ul", "dl", "dr"], ["ur", "ul", "dl", "dr"]], "Mb": [["ul", "dr", "ur", "dl", "dr", "ul", "dl", "ur"], ["dr", "ul", "dl", "ur", "ul", "dr", "ur", "dl"], ["ur", "dl", "ul", "dr", "dl", "ur", "dr", "ul"], ["dl", "ur", "dr", "ul", "ur", "dl", "ul", "dr"], ["dr", "ul", "dl", "ur", "ul", "dr", "ur", "dl"], ["ul", "dr", "ur", "dl", "dr", "ul", "dl", "ur"], ["dl", "ur", "dr", "ul", "ur", "dl", "ul", "dr"], ["ur", "dl", "ul", "dr", "dl", "ur", "dr", "ul"]], "K": [["ul", "dl", "dr", "ur"], ["ur", "dr", "dl", "ul"], ["dr", "ur", "ul", "dl"], ["dl", "ul", "ur", "dr"]], "O": [["ul", "ur"], ["dr", "dl"]], "Vc": [["dr", "ul", "ur", "ul", "ur", "dl"], ["ul", "dr", "dl", "dr", "dl", "ur"], ["dl", "ur", "dr", "dl", "ul", "dr"], ["ul", "dr", "ur", "ul", "dl", "ur"], ["dl", "ur", "ul", "ur", "ul", "dr"], ["ur", "dl", "dr", "dl", "dr", "ul"]], "S": [["dr", "dr", "ur", "ur", "dr", "dr", "dl", "dl", "ul", "ul", "dl", "dl"], ["ul", "ul", "dl", "dl", "ul", "ul", "ur", "ur", "dr", "dr", "ur", "ur"]], "Ua": [["ul", "ur", "dr", "dl"], ["dl", "ur", "ur", "dl"], ["dl", "dr", "ur", "ul"]], "Uc": [["dr", "dl", "ur", "ul"], ["ur", "ul", "dr", "dl"], ["dr", "dl", "ul", "ur", "dl", "dr", "ul", "ur"], ["ul", "ur", "ul", "dr", "ul", "ur", "dl", "ur"], ["ul", "ur", "dr", "dl"], ["dl", "dr", "ur", "ul"], ["dl", "dr", "dl", "ur", "dl", "dr", "ul", "dr"], ["ur", "ul", "dl", "dr", "ul", "ur", "dl", "dr"], ["dr", "dl", "ur", "ul"], ["ur", "ul", "dr", "dl"], ["dr", "dl", "ul", "ur", "dl", "dr", "ul", "ur"], ["ul", "ur", "ul", "dr", "ul", "ur", "dl", "ur"], ["ul", "ur", "dr", "dl"], ["dl", "dr", "ur", "ul"], ["dl", "dr", "dl", "ur", "dl", "dr", "ul", "dr"], ["ur", "ul", "dl", "dr", "ul", "ur", "dl", "dr"]], "Ub": [["ul"], ["dl", "ul", "ur", "dr"], ["dl", "dl", "ur", "ur"], ["ul", "ul", "dr", "dr"], ["ul", "dl", "dr", "ur"], ["dl"]], "Qa": [["ul", "ur", "ur", "ul", "ul", "ur"], ["dl", "dl", "dr", "dl", "dr", "dr"]], "Ea": [["ul", "dr", "ur", "dl"]], "Za": [["dr", "dr", "dl", "dl", "ul", "ul", "ur", "ur"], ["ur", "ur", "ul", "ul", "dl", "dl", "dr", "dr"], ["dr", "ul", "ur", "dl", "ul", "dr", "dl", "ur"], ["ur", "dl", "dr", "ul", "dl", "ur", "ul", "dr"]], "Ec": [["dr", "dl", "dr", "dl", "ul", "ur", "ul", "ur"], ["ur", "dl", "ul", "ul", "dl", "ur", "dr", "dr"], ["dr", "dr", "ur", "dl", "ul", "ul", "dl", "ur"], ["ur", "ul", "ur", "ul", "dl", "dr", "dl", "dr"], ["ul", "ur", "ul", "ur", "dr", "dl", "dr", "dl"], ["dl", "ur", "dr", "dr", "ur", "dl", "ul", "ul"], ["ul", "ul", "dl", "ur", "dr", "dr", "ur", "dl"], ["dl", "dr", "dl", "dr", "ur", "ul", "ur", "ul"]], "Eb": [["ul", "dr", "dl", "ur"], ["ur", "ul", "dr", "dl"], ["dl", "ur", "ul", "dr"], ["dr", "dl", "ur", "ul"]], "Na": [["ur", "dl"], ["ur", "ul"]], "Nb": [["dr", "dr", "ul", "ur"], ["ur", "ur", "ul", "dr"]], "Nc": [["dr", "ul", "dl", "dr", "ur", "dl"], ["ul", "dr", "ul", "ur", "dl", "ur"], ["ur", "ul", "dr", "dl", "ur", "ul"], ["dr", "dl", "ur", "ul", "dr", "dl"], ["dl", "ur", "dl", "dr", "ul", "dr"], ["ur", "dl", "ul", "ur", "dr", "ul"]], "Fa": [["dl", "dr", "ul"], ["ur", "dl", "dr"]], "Fb": [["dr", "ul", "dl"], ["ul", "dl", "dr"], ["dl", "dr", "ul"]], "Fc": [["ul", "ur", "ul", "ur", "dr", "dl", "dr", "dl"], ["ur", "dl", "dr", "ul", "dl", "ur", "ul", "dr"], ["dr", "ul", "ur", "dl", "ul", "dr", "dl", "ur"], ["dl", "dr", "dl", "dr", "ur", "ul", "ur", "ul"], ["dr", "dl", "dr", "dl", "ul", "ur", "ul", "ur"], ["dl", "ur", "ul", "dr", "ur", "dl", "dr", "ul"], ["ul", "dr", "dl", "ur", "dr", "ul", "ur", "dl"], ["ur", "ul", "ur", "ul", "dl", "dr", "dl", "dr"]], "Kc": [["dr", "ul", "ur"], ["dl", "dr", "ul"]], "Kb": [["ul", "dr", "ur", "dl"], ["dr", "ul", "dl", "ur"], ["dl", "ur", "dr", "ul"], ["ur", "dl", "ul", "dr"]], "Ka": [["dr", "dl"], ["ur", "dr"]], "B": [["dr", "ul"]], "F": [["ul", "dr"], ["dr", "ul"], ["dr", "ul"], ["ul", "dr"]], "Vb": [["ur", "ur", "dr", "dl"], ["ur", "dr", "ul", "dr"]], "N": [["ul", "dl"], ["dr", "ur"]], "R": [["ul", "dr", "dl", "ur"], ["ul", "dr", "dl", "ur"]], "V": [["dr", "dl", "dr", "dl", "ul", "ur", "ul", "ur"], ["ul", "ur", "ul", "ur", "dr", "dl", "dr", "dl"]], "Sc": [["ur", "dr", "ul", "dr", "ul", "ur", "dl", "ur", "dl", "ul", "dr", "ul", "dr", "dl", "ur", "dl", "ur", "dr"], ["ul", "dl", "ur", "dl", "ur", "ul", "dr", "ul", "dr", "ur", "dl", "ur", "dl", "dr", "ul", "dr", "ul", "dl"], ["dr", "ur", "dl", "ur", "dl", "dr", "ul", "dr", "ul", "dl", "ur", "dl", "ur", "ul", "dr", "ul", "dr", "ur"], ["ul", "dl", "ur", "dl", "ur", "ul", "dr", "ul", "dr", "ur", "dl", "ur", "dl", "dr", "ul", "dr", "ul", "dl"], ["dr", "ur", "dl", "ur", "dl", "dr", "ul", "dr", "ul", "dl", "ur", "dl", "ur", "ul", "dr", "ul", "dr", "ur"], ["ur", "dr", "ul", "dr", "ul", "ur", "dl", "ur", "dl", "ul", "dr", "ul", "dr", "dl", "ur", "dl", "ur", "dr"], ["dl", "ul", "dr", "ul", "dr", "dl", "ur", "dl", "ur", "dr", "ul", "dr", "ul", "ur", "dl", "ur", "dl", "ul"], ["ur", "dr", "ul", "dr", "ul", "ur", "dl", "ur", "dl", "ul", "dr", "ul", "dr", "dl", "ur", "dl", "ur", "dr"], ["dl", "ul", "dr", "ul", "dr", "dl", "ur", "dl", "ur", "dr", "ul", "dr", "ul", "ur", "dl", "ur", "dl", "ul"], ["dr", "ur", "dl", "ur", "dl", "dr", "ul", "dr", "ul", "dl", "ur", "dl", "ur", "ul", "dr", "ul", "dr", "ur"], ["ul", "dl", "ur", "dl", "ur", "ul", "dr", "ul", "dr", "ur", "dl", "ur", "dl", "dr", "ul", "dr", "ul", "dl"], ["dr", "ur", "dl", "ur", "dl", "dr", "ul", "dr", "ul", "dl", "ur", "dl", "ur", "ul", "dr", "ul", "dr", "ur"], ["ul", "dl", "ur", "dl", "ur", "ul", "dr", "ul", "dr", "ur", "dl", "ur", "dl", "dr", "ul", "dr", "ul", "dl"], ["dl", "ul", "dr", "ul", "dr", "dl", "ur", "dl", "ur", "dr", "ul", "dr", "ul", "ur", "dl", "ur", "dl", "ul"], ["ur", "dr", "ul", "dr", "ul", "ur", "dl", "ur", "dl", "ul", "dr", "ul", "dr", "dl", "ur", "dl", "ur", "dr"], ["dl", "ul", "dr", "ul", "dr", "dl", "ur", "dl", "ur", "dr", "ul", "dr", "ul", "ur", "dl", "ur", "dl", "ul"], ["dr", "dr", "ul", "dr", "ul", "ur", "dl", "ur", "dl", "ul", "dr", "ul", "dr", "dl", "ur", "dl", "ur", "dr"], ["ul", "dl", "ur", "dl", "ur", "ul", "dr", "ul", "dr", "ur", "dl", "ur", "dl", "dr", "ul", "dr", "ul", "dl"]], "Sb": [["dl", "dr", "dr", "dl"], ["ur", "ul", "ur", "ul"], ["dr", "dl", "dr", "dl"], ["ur", "ul", "ul", "ur"]], "Sa": [["ul", "ur", "ur", "ul", "ul", "ur"], ["dl", "dl", "dr", "dl", "dr", "dr"], ["ul", "ul", "ur", "ul", "ur", "ur"], ["dl", "dr", "dr", "dl", "dl", "dr"]], "Z": [["ul", "dl", "dr", "ur", "dr", "ur"], ["ur", "dr", "dl", "ul", "dl", "ul"], ["dr", "ur", "ul", "dl", "ul", "dl"], ["dl", "ul", "ur", "dr", "ur", "dr"], ["dr", "ur", "ul", "dl", "ul", "dl"], ["dl", "ul", "ur", "dr", "ur", "dr"]], "Cc": [["dr", "dr", "ur", "ul", "dl", "dr", "ur", "ur"], ["ur", "ul", "dl", "dl", "ul", "ul", "dl", "dr"]], "Cb": [["ul", "ul", "ur", "ul", "ul", "dr", "dl", "dr"], ["ul", "dr", "dr", "dl", "dr", "dr", "ul", "ur"], ["dl", "dr", "ul", "ul", "ur", "ul", "ul", "dr"], ["ul", "ur", "ul", "dr", "dr", "dl", "dr", "dr"], ["ul", "dr", "dl", "dr", "ul", "ul", "ur", "ul"], ["dr", "dr", "ul", "ur", "ul", "dr", "dr", "dl"], ["ur", "ul", "ul", "dr", "dl", "dr", "ul", "ul"], ["dr", "dl", "dr", "dr", "ul", "ur", "ul", "dr"]], "Ca": [["ul", "dr", "dl", "ur"], ["dr", "ul", "ur", "dl"]], "Xa": [["dl", "dr", "dl", "dr", "ur", "ul", "ur", "ul"], ["ul", "dr", "dl", "ur", "dr", "ul", "ur", "dl"], ["dl", "ur", "ul", "dr", "ur", "dl", "dr", "ul"], ["ul", "ur", "ul", "ur", "dr", "dl", "dr", "dl"], ["ur", "ul", "ur", "ul", "dl", "dr", "dl", "dr"], ["dr", "ul", "ur", "dl", "ul", "dr", "dl", "ur"], ["ur", "dl", "dr", "ul", "dl", "ur", "ul", "dr"], ["dr", "dl", "dr", "dl", "ul", "ur", "ul", "ur"]], "Lb": [["ul", "dr", "dl", "ur"], ["dr", "ul", "ur", "dl"], ["ur", "dl", "dr", "ul"], ["dl", "ur", "ul", "dr"]], "Lc": [["ur", "ul", "dl", "ul", "ur", "dr"], ["ul", "ur", "ur", "ur", "ul", "ul"]], "La": [["dr", "dl", "dr", "dl", "ul", "ur", "ul", "ur"], ["ur", "dr", "dl", "ul", "dl", "ul", "ur", "dr"], ["dr", "ur", "ul", "dl", "ul", "dl", "dr", "ur"], ["ur", "ul", "ur", "ul", "dl", "dr", "dl", "dr"], ["ul", "ur", "ul", "ur", "dr", "dl", "dr", "dl"], ["dl", "ul", "ur", "dr", "ur", "dr", "dl", "ul"], ["ul", "dl", "dr", "ur", "dr", "ur", "ul", "dl"], ["dl", "dr", "dl", "dr", "ur", "ul", "ur", "ul"]], "Zb": [["ul", "dr", "ur", "ul", "dl", "ur", "dr", "ul", "dl", "dr", "ur", "dl"], ["dr", "ul", "dl", "dr", "ur", "dl", "ul", "dr", "ur", "ul", "dl", "ur"], ["dl", "ur", "ul", "ur", "ul", "dr", "ur", "dl", "dr", "dl", "dr", "ul"], ["ul", "dr", "dl", "dr", "dl", "ur", "dr", "ul", "ur", "ul", "ur", "dl"], ["ur", "dl", "ul", "ur", "dr", "ul", "dl", "ur", "dr", "dl", "ul", "dr"], ["dl", "ur", "dr", "dl", "ul", "dr", "ur", "dl", "ul", "ur", "dr", "ul"], ["dr", "ul", "dl", "dr", "ur", "dl", "ul", "dr", "ur", "ul", "dl", "ur"], ["ul", "dr", "ur", "ul", "dl", "ur", "dr", "ul", "dl", "dr", "ur", "dl"], ["ur", "dl", "dr", "dl", "dr", "ul", "dl", "ur", "ul", "ur", "ul", "dr"], ["dr", "ul", "ur", "ul", "ur", "dl", "ul", "dr", "dl", "dr", "dl", "ur"], ["dl", "ur", "dr", "dl", "ul", "dr", "ur", "dl", "ul", "ur", "dr", "ul"], ["ur", "dl", "ul", "ur", "dr", "ul", "dl", "ur", "dr", "dl", "ul", "dr"]], "Zc": [["ul", "dr", "ul", "dr", "ul", "ur", "dl", "ur"], ["ul", "ur", "dl", "ur", "ul", "dr", "ul", "dr"], ["dr", "dl", "ur", "dl", "dr", "ul", "dr", "ul"], ["dr", "ul", "dr", "ul", "dr", "dl", "ur", "dl"]], "Tb": [["ul", "ur", "dl"], ["dr", "ul", "ur"], ["ul", "dl", "dr"]], "Tc": [["ul", "ur", "ul", "ur", "ul", "ur", "dr", "dl", "dr", "dl", "dr", "dl"], ["dl", "dr", "dr", "dl", "dl", "dr", "ur", "ul", "ul", "ur", "ur", "ul"], ["ul", "dr", "ul", "ur", "dl", "ur", "dr", "ul", "dr", "dl", "ur", "dl"], ["dl", "ur", "dl", "dr", "ul", "dr", "ur", "dl", "ur", "ul", "dr", "ul"], ["ul", "ur", "ur", "ul", "ul", "ur", "dr", "dl", "dl", "dr", "dr", "dl"], ["dl", "dr", "dl", "dr", "dl", "dr", "ur", "ul", "ur", "ul", "ur", "ul"], ["dr", "dl", "dr", "dl", "dr", "dl", "ul", "ur", "ul", "ur", "ul", "ur"], ["ur", "ul", "ul", "ur", "ur", "ul", "dl", "dr", "dr", "dl", "dl", "dr"], ["dr", "ul", "dr", "dl", "ur", "dl", "ul", "dr", "ul", "ur", "dl", "ur"], ["ur", "dl", "ur", "ul", "dr", "ul", "dl", "ur", "dl", "dr", "ul", "dr"], ["dr", "dl", "dl", "dr", "dr", "dl", "ul", "ur", "ur", "ul", "ul", "ur"], ["ur", "ul", "ur", "ul", "ur", "ul", "dl", "dr", "dl", "dr", "dl", "dr"]], "Ta": [["ul", "dr", "dl"], ["dl", "dr", "ul"], ["dr", "ul", "ur"], ["ur", "ul", "dr"]], "Ya": [["ul", "dr", "dl", "ur", "dr", "ul", "ur", "dl"], ["ul", "ur", "ul", "ur", "dr", "dl", "dr", "dl"], ["dl", "dr", "dl", "dr", "ur", "ul", "ur", "ul"], ["ul", "dr", "dl", "ur", "dr", "ul", "ur", "dl"], ["ul", "ur", "ul", "ur", "dr", "dl", "dr", "dl"], ["dl", "dr", "dl", "dr", "ur", "ul", "ur", "ul"]], "Yc": [["dr", "dl", "ul", "ur", "dl", "dr", "ul", "ur"], ["ul", "ur", "ul", "dr", "ul", "ur", "dl", "ur"], ["dr", "dl", "dr", "ul", "dr", "dl", "ur", "dl"], ["ul", "ur", "ul", "dr", "ul", "ur", "dl", "ur"], ["dl", "dr", "dl", "ur", "dl", "dr", "ul", "dr"], ["ur", "ul", "ur", "dl", "ur", "ul", "dr", "ul"], ["dl", "dr", "dl", "ur", "dl", "dr", "ul", "dr"], ["ur", "ul", "dl", "dr", "ul", "ur", "dl", "dr"], ["dr", "dl", "ur", "ul"], ["ur", "ul", "dr", "dl"]], "Yb": [["dl", "dl", "ur", "ul", "ur", "ul", "dr", "dr"], ["ul", "ur", "dr", "ul", "ur", "dl", "ul", "ur"], ["dr", "ul", "dl", "dr", "dl", "dr", "ur", "dl"], ["dr", "dl", "ur", "ur", "ul", "ul", "dr", "dl"], ["ur", "ul", "dr", "dr", "dl", "dl", "ur", "ul"], ["ur", "dl", "ul", "ur", "ul", "ur", "dr", "ul"], ["dl", "dr", "ur", "dl", "dr", "ul", "dl", "dr"], ["ul", "ul", "dr", "dl", "dr", "dl", "ur", "ur"]], "Db": [["dr", "ul", "dl", "ur", "dr", "ul", "ur", "dl"], ["ul", "dl", "ur", "dr", "ul", "ur", "dl", "dr"], ["dl", "ur", "dr", "ul", "ur", "dl", "dr", "ul"], ["ur", "dr", "ul", "ur", "dl", "dr", "ul", "dl"], ["dr", "ul", "ur", "dl", "dr", "ul", "dl", "ur"], ["ul", "ur", "dl", "dr", "ul", "dl", "ur", "dr"], ["ur", "dl", "dr", "ul", "dl", "ur", "dr", "ul"], ["dl", "dr", "ul", "dl", "ur", "dr", "ul", "ur"]], "Dc": [["ul", "dr", "dl", "ur", "dr", "ul", "ur", "dl"], ["ur", "ul", "ur", "ul", "dl", "dr", "dl", "dr"], ["dr", "dl", "dr", "dl", "ul", "ur", "ul", "ur"], ["dl", "ur", "ul", "dr", "ur", "dl", "dr", "ul"], ["dr", "ul", "ur", "dl", "ul", "dr", "dl", "ur"], ["dl", "dr", "dl", "dr", "ur", "ul", "ur", "ul"], ["ul", "ur", "ul", "ur", "dr", "dl", "dr", "dl"], ["ur", "dl", "dr", "ul", "dl", "ur", "ul", "dr"]], "Da": [["dl", "dr", "ul", "ur"], ["dr", "ul", "ur", "dl"]], "A": [["ul", "dr"], ["dr", "ul"]], "E": [["dr", "ul", "ul", "dr"]], "I": [["dr", "ur"], ["dl", "ul"]], "M": [["ul", "ur"], ["ur", "ul"]], "L": [["dr", "dl"], ["ur", "dr", "dl", "ul"], ["dr", "ur", "ul", "dl"], ["ur", "ul"]], "Q": [["dr", "dr", "dl", "dl"], ["ul", "ul", "ur", "ur"]], "Qc": [["dr", "ul", "dr", "ul", "ur", "dl", "ur", "dl", "dr", "dl"], ["ul", "dr", "ul", "dr", "dl", "ur", "dl", "ur", "ul", "ur"], ["dr", "ul", "dr", "ur", "ul", "dl", "ur", "dl", "dr", "dl"], ["ul", "dr", "dl", "dr", "dl", "dr", "dl", "ur", "ul", "ur"], ["dl", "ur", "ul", "ur", "ul", "ur", "ul", "dr", "dl", "dr"], ["ur", "dl", "ur", "dr", "dl", "ul", "dr", "ul", "ur", "ul"], ["dl", "ur", "dl", "ur", "ul", "dr", "ul", "dr", "dl", "dr"], ["ur", "dl", "ur", "dl", "dr", "ul", "dr", "ul", "ur", "ul"], ["dr", "ul", "dr", "ul", "ur", "dl", "ur", "dl", "ul", "ur"], ["ur", "dl", "ur", "dl", "dr", "ul", "dr", "ul", "dl", "dr"]], "Qb": [["ul", "ul", "ur", "ur", "dr", "dr", "dl", "dl"], ["dr", "dl", "dr", "dl", "ul", "ur", "ul", "ur"], ["ur", "ul", "ur", "ul", "dl", "dr", "dl", "dr"], ["dr", "dr", "dl", "dl", "ul", "ul", "ur", "ur"], ["ul", "ur", "ul", "ur", "dr", "dl", "dr", "dl"], ["dl", "dr", "dl", "dr", "ur", "ul", "ur", "ul"]], "U": [["dr", "dl"]], "Y": [["dr", "dr", "dl", "dl"], ["dr", "dr", "dl", "dl"], ["ur", "ur", "ul", "ul"], ["ur", "ur", "ul", "ul"]], "Aa": [["ul", "dr", "ur", "dl"], ["dr", "ul", "dl", "ur"]], "Va": [["ul", "ur", "ul", "ur", "dr", "dl", "dr", "dl"], ["ul", "dl", "dr", "ur", "dr", "ur", "ul", "dl"]], "Ac": [["dr", "dl", "dr", "dl", "ul", "ul", "ur", "ur"], ["ur", "ur", "ul", "ul", "dl", "dr", "dl", "dr"]], "Ab": [["ul", "dr", "dr", "dl", "dr", "ul"], ["dr", "dr", "ul", "ul", "ur", "ul"], ["dr", "ul", "ul", "dr", "dr", "dl"], ["ur", "ul", "dr", "dr", "ul", "ul"], ["dr", "dl", "dr", "ul", "ul", "dr"], ["ul", "ul", "ur", "ul", "dr", "dr"]], "Ia": [["ul", "dr", "dl", "ur"], ["ul", "ul", "ur", "ur"], ["dl", "dl", "dr", "dr"], ["dl", "ur", "ul", "dr"]], "Ic": [["dr", "dr", "ur", "dl"], ["ul", "ul", "ur", "dl"], ["ur", "dl", "dr", "dr"], ["ur", "dl", "ul", "ul"]], "Ib": [["ul", "dr", "dl", "ur", "dr", "ul", "ur", "dl"], ["dl", "ur", "ul", "dr", "ur", "dl", "dr", "ul"], ["dr", "ul", "ur", "dl", "ul", "dr", "dl", "ur"], ["ur", "dl", "dr", "ul", "dl", "ur", "ul", "dr"]]}
};
