// Parameters
let p = null;
let offset = null;

function setup() {
  createCanvas(windowWidth - 100, windowHeight - 100);

  colorMode(RGB, 100);
  frameRate(50);

  p = {
    numPoints: 750,
    a1: (t) => 100,
    a2: (t) => 100,
    a3: (t) => 100,
    a4: (t) => 100,
    p1: (t) => (PI * t) / 12,
    p2: (t) => PI,
    p3: (t) => PI / 2,
    p4: (t) => (PI * t) / 5,
    f1: (t) => 14 + sin((PI * t) / 25),
    f2: (t) => 14 + cos((PI * t) / 35),
    f3: (t) => 15 + 2 * sin((PI * t) / 35),
    f4: (t) => 14,
    d1: (t) => 0.00001,
    d2: (t) => 0.00001,
    d3: (t) => 0.00001,
    d4: (t) => 0.00001,
  };

  offset = 100 * random();
}

function draw() {
  background(25);
  t = millis() / 1000 + offset;
  drawHarmonograph(t);
}

function drawHarmonograph(t) {
  push();

  translate(width / 2, height / 2);

  const c1 = color(100, 30, 20, 70 + 30 * sin((PI * t) / 8));
  const c2 = color(20, 100, 100, 70 + 30 * sin((PI * t) / 8));
  fill(lerpColor(c1, c2, 0.5 + 0.5 * cos((PI * t) / 4)));
  noStroke();
  for (let n = 0; n < p.numPoints; n++) {
    const x =
      p.a1(t) *
        sin((p.f1(t) * PI * n) / p.numPoints + p.p1(t)) *
        exp(-p.d1(t) * n) +
      p.a2(t) *
        sin((p.f2(t) * PI * n) / p.numPoints + p.p2(t)) *
        exp(-p.d2(t) * n);

    const y =
      p.a3(t) *
        sin((p.f3(t) * PI * n) / p.numPoints + p.p3(t)) *
        exp(-p.d3(t) * n) +
      p.a4(t) *
        sin((p.f4(t) * PI * n) / p.numPoints + p.p4(t)) *
        exp(-p.d4(t) * n);

    // console.log({ x, y });
    ellipse(x, y, 4 * exp(0.0001 * n));
  }

  pop();
}
