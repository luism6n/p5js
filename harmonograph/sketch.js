let gui;
let phaseInitial = 0,
  phaseMax = 3.2,
  phaseMin = 0,
  phaseStep = 0.1;
let freqInitial = 1,
  freqMax = 10,
  freqMin = 0,
  freqStep = 0.1;

let params = {
  numPoints: 20,
  numPointsMax: 300,
  a1: 100,
  a2: 100,
  a3: 100,
  a4: 100,
  f1: freqInitial,
  f2: freqInitial,
  f3: freqInitial,
  f4: freqInitial,
  f1Max: freqMax,
  f2Max: freqMax,
  f3Max: freqMax,
  f4Max: freqMax,
  f1Min: freqMin,
  f2Min: freqMin,
  f3Min: freqMin,
  f4Min: freqMin,
  f1Step: freqStep,
  f2Step: freqStep,
  f3Step: freqStep,
  f4Step: freqStep,
  p1: phaseInitial,
  p2: phaseInitial,
  p3: phaseInitial,
  p4: phaseInitial,
  p1Max: phaseMax,
  p2Max: phaseMax,
  p3Max: phaseMax,
  p4Max: phaseMax,
  p1Min: phaseMin,
  p2Min: phaseMin,
  p3Min: phaseMin,
  p4Min: phaseMin,
  p1Step: phaseStep,
  p2Step: phaseStep,
  p3Step: phaseStep,
  p4Step: phaseStep,
  d1: 100,
  d2: 100,
  d3: 100,
  d4: 100,
};

function setup() {
  createCanvas(windowWidth - 100, windowHeight - 100);

  gui = createGui("Harmonograph");
  gui.addObject(params);
  // gui.addGlobals(
  //   "numPoints",
  //   "a1",
  //   "a2",
  //   "a3",
  //   "a4",
  //   "f1",
  //   "f2",
  //   "f3",
  //   "f4",
  //   "p1",
  //   "p2",
  //   "p3",
  //   "p4",
  //   "d1",
  //   "d2",
  //   "d3",
  //   "d4"
  // );
}

function draw() {
  background(220);

  drawHarmonograph();
}

function drawHarmonograph() {
  push();

  translate(width / 2, height / 2);

  for (let n = 0; n < params.numPoints * 2; n++) {
    const x =
      params.a1 * sin((params.f1 * PI * n) / params.numPoints + params.p1) +
      params.a2 * sin((params.f2 * PI * n) / params.numPoints + params.p2);

    const y =
      params.a3 * sin((params.f3 * PI * n) / params.numPoints + params.p3) +
      params.a4 * sin((params.f4 * PI * n) / params.numPoints + params.p4);

    ellipse(x, y, 3);
  }

  pop();
}
