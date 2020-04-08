let faceapi;
let video;
let detections;

var Leyex;
var Leyey;
var Reyex;
var Reyey;
var Tnosex;
var Tnosey;

var Bnosex;
var Bnosey;
var mouthx;
var mouthy;

var Leye4x;
var Leye4y;

var gameScreen = 0;

// by default all options are set to true
const detection_options = {
  withLandmarks: true,
  withDescriptors: false,
}


function setup() {
  createCanvas(360, 270);

  // load up your video
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide(); // Hide the video element, and just show the canvas
  faceapi = ml5.faceApi(video, detection_options, modelReady)
  textAlign(RIGHT);
}

function modelReady() {
  console.log('ready!')
  console.log(faceapi)
  faceapi.detect(gotResults)

}

function gotResults(err, result) {
  if (err) {
    console.log(err)
    return
  }
  // console.log(result)
  detections = result;

  // background(220);
  background(255);
  //image(video, 0, 0, width, height)
  if (detections) {
    if (detections.length > 0) {
      console.log(detections);
      // drawBox(detections);
      drawLandmarks(detections);
    }
  }
  faceapi.detect(gotResults);
}

  
function draw() {

  if (gameScreen == 0) {
    initScreen();

  } else if (gameScreen == 1) {
    PlayScreen(detections);

  } else if (gameScreen == 2) {
    EndScreen();
  }
}

function initScreen() {

  background(225);
  textAlign(CENTER, CENTER);
  fill(22, 146, 212);
  textSize(50);
  text("Crazy Face", width / 2, height - 160);

  fill(100, 120, 80);
  textSize(30);
  text("Click to Start", width / 2, height - 70);

}

function PlayScreen(detections) {
  
  background();
  var FaceScore = 0;
  text(FaceScore, 10, 10);
  stroke(0);
  textSize(20);
  
  var Time = 60
  text(Time, width / 2, 10);
  stroke(0);
  textSize(20);
  
  
  noFill();
  stroke(161, 95, 251)
  strokeWeight(2)

  for (let i = 0; i < detections.length; i++) {
    const mouth = detections[i].parts.mouth;
    const nose = detections[i].parts.nose;
    const leftEye = detections[i].parts.leftEye;
    const rightEye = detections[i].parts.rightEye;
    const rightEyeBrow = detections[i].parts.rightEyeBrow;
    const leftEyeBrow = detections[i].parts.leftEyeBrow;

    drawPart(mouth, true);
    drawPart(nose, false);
    drawPart(leftEye, true);
    drawPart(leftEyeBrow, false);
    drawPart(rightEye, true);
    drawPart(rightEyeBrow, false);

    //distance between two eyes
    Leyex = detections[i].parts.leftEye[0].x;
    Leyey = detections[i].parts.leftEye[0].y;
    Reyex = detections[i].parts.rightEye[3].x;
    Reyey = detections[i].parts.rightEye[3].y;

    line(Leyex, Leyey, Reyex, Reyey);
    var eyeDistance = dist(Leyex, Leyey, Reyex, Reyey);

    //distance between top and bot nose
    Tnosex = detections[i].parts.nose[0].x;
    Tnosey = detections[i].parts.nose[0].y;
    Bnosex = detections[i].parts.nose[6].x;
    Bnosey = detections[i].parts.nose[6].y;

    line(Tnosex, Tnosey, Bnosex, Bnosey);
    var noseDistance = dist(Tnosex, Tnosey, Bnosex, Bnosey);

    //distance between eye and mouth
    Leye4x = detections[i].parts.leftEye[4].x;
    Leye4y = detections[i].parts.leftEye[4].y;
    mouthx = detections[i].parts.mouth[0].x;
    mouthy = detections[i].parts.mouth[0].y;

    line(Leye4x, Leye4y, mouthx, mouthy);
    var LeyemouthDistance = dist(Leye4x, Leye4y, mouthx, mouthy);

    //distance between eye and eyebrow
    var Leyebrow2x = detections[i].parts.leftEyeBrow[2].x;
    var Leyebrow2y = detections[i].parts.leftEyeBrow[2].y;
    var Leye1x = detections[i].parts.leftEye[1].x;
    var Leye1y = detections[i].parts.leftEye[1].y;

    line(Leyebrow2x, Leyebrow2y, Leye1x, Leye1y);
    var LeyeandborwDistance = dist(Leyebrow2x, Leyebrow2y, Leye1x, Leye1y);

    var mouth6x = detections[i].parts.mouth[6].x;
    var mouth6y = detections[i].parts.mouth[6].y;

    line(mouthx, mouthy, mouth6x, mouth6y);
    var mouthDistance = dist(mouthx, mouthy, mouth6x, mouth6y);

    var smileNumber = eyeDistance / LeyemouthDistance;
    var LeyebrowNumber = eyeDistance / LeyeandborwDistance;
    var mouthNumber = eyeDistance / mouthDistance;
    print(mouthNumber);

    //smile,
    //neture is 1.23~1.32,  smile is 1.46~1.52
    if (smileNumber > 1.44) {
      stroke(0);
      textSize(15);
      textAlign(CENTER);
      text("Smiling", height / 2, width / 2);
    }

    //o pose,
    //o pose is 1.18~1.22
    if (smileNumber < 1.21) {
      stroke(0);
      textSize(15);
      textAlign(CENTER);
      text("O_pose", height / 2, width / 2);
    }

    //raise Leyebrow
    //neture is 3.7, Up is 2.8
    if (LeyebrowNumber < 3.3) {
      stroke(0);
      textSize(15);
      textAlign(CENTER);
      text("RaiseLEyeBrow", height / 2, width / 2);
    }

    //sad,
    //neture is 1.23~1.32, sad is 1.1~1.2
    if (smileNumber < 1.2) {
      stroke(0);
      textSize(15);
      textAlign(CENTER);
      text("Sad", height / 2, width / 2);
    }

    //side face
    //neture is 1.88-2.0, side face
    // if (mouthNumber ) {
    //   stroke(255);
    //   textSize(20);
    //   textAlign(CENTER);
    //   text("SideFace", height / 2, width / 2);
    // }
  }
}

function EndScreen() {

  background(225);
  fill(255, 0, 0);
  textSize(50);
  text("Nice Done!", 300, 250);
  fill(100, 120, 80);
  textSize(30);
  text("Click to Start Again", width / 2, height - 80);
  textAlign(CENTER, CENTER);
}


function drawPart(feature, closed) {

  beginShape();
  for (let i = 0; i < feature.length; i++) {
    const x = feature[i]._x
    const y = feature[i]._y
    vertex(x, y)
  }

  if (closed === true) {
    endShape(CLOSE);
  } else {
    endShape();
  }

}

function mousePressed() {

  if (gameScreen == 0 || gameScreen == 2) {
    gameScreen = 1;
  }
}
  
// mouth 48 - 54, bigger would be ,smile
// leftEye[4] - mouth[0]
// RightEye[4] - mouth[6]

// Left eyebrow 37 - 19, bigger would be ,up eyebrow
// Right eyebrow 44 - 24

// mouth 66 - 62, bigger would be ,open mouth

// 48 - 54 small, 66 - 62 not as big as open mouth, pout
