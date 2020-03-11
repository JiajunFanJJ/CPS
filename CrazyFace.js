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
  // video.hide(); // Hide the video element, and just show the canvas
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
      console.log(detections)
      // drawBox(detections)
      drawLandmarks(detections)
    }

  }
  faceapi.detect(gotResults);
}

// function drawBox(detections) {
//   for (let i = 0; i < detections.length; i++) {
//     const alignedRect = detections[i].alignedRect;
//     const x = alignedRect._box._x
//     const y = alignedRect._box._y
//     const boxWidth = alignedRect._box._width
//     const boxHeight = alignedRect._box._height

//     noFill();
//     stroke(161, 95, 251);
//     strokeWeight(2);
//     rect(x, y, boxWidth, boxHeight);
//   }

// }

function drawLandmarks(detections) {
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

    var smileNumber = eyeDistance / LeyemouthDistance;
    print(smileNumber);

    //smile,
    //neture is 1.23~1.32,  smile is 1.46~1.52
    if (smileNumber > 1.44) {
      fill(255);
      textSize(10);
      textAlign(CENTER);
      text("Smiling", height / 2, width / 2);
    }

    //o pose,
    //o pose is 1.18~1.22
    if (smileNumber < 1.21) {
      fill(255);
      textSize(10);
      textAlign(CENTER);
      text("O_pose", height / 2, width / 2);
    }
  }
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


// mouth 48 - 54, bigger would be ,smile
// leftEye[4] - mouth[0]
// RightEye[4] - mouth[6]

// Left eyebrow 37 - 19, bigger would be ,up eyebrow
// Right eyebrow 44 - 24

// mouth 66 - 62, bigger would be ,open mouth

// 48 - 54 small, 66 - 62 not as big as open mouth, pout
