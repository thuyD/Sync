import debounce from './debounce.js';

/* Visualization */

const canvas = document.getElementById("board");
console.log(canvas);
const canvasCtx = canvas.getContext("2d");
let activeVisualization = 'ripple';

  //Allow users to select styles

document.getElementById('wave').addEventListener('click', () => {
  activeVisualization = 'wave';
});

document.getElementById('ripple').addEventListener('click', () => {
  activeVisualization = 'ripple';
});

  //set default color for visualizer

let hue = 52;
let sat = 95;
let light = 42;
let alpha = 0.8;

  // set canvas width and height and resize appropriately

const updateCanvasSize = () => {
  $('#board').attr({
    width: $(window).width(),
    height: $(window).height()
  });
};

const setupCanvas = () => {
  updateCanvasSize();
  const resizeCanvas = debounce(function() {
    updateCanvasSize();
  }, 250);
  window.addEventListener('resize', resizeCanvas);
};

setupCanvas();

export const visualizer = (analyserNode) => {
  var bufferLength = analyserNode.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  function draw() {
    const drawVisual = requestAnimationFrame(draw);
    analyserNode.getByteTimeDomainData(dataArray);

    if (activeVisualization === 'ripple') {
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      drawCircle(dataArray, bufferLength);
    } else {
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      drawOscilloscope(dataArray, bufferLength);
    }
  }

  const drawThenClear = () => {
    draw();
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  };

  drawThenClear();
};


function drawCircle(dataArray, bufferLength) {
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, 0.6)`;

  canvasCtx.beginPath();

  var sliceWidth = canvas.width * 1.0 / bufferLength;
  var x = canvas.width / 2;
  var radius = 20;

  const numberOfCircles = 60;
  const iterator = Math.floor(dataArray.length / numberOfCircles);

  for (var i = 0; i < dataArray.length; i += iterator) {
    var v = dataArray[i] / 128.0;
    var y = canvas.height / 2;
    canvasCtx.beginPath();
    canvasCtx.arc(x, y, radius * v, 0, Math.PI * 2, true);
    canvasCtx.fillStyle = `hsla(${hue}, 100%, 40%, 0.02)`;
    canvasCtx.fill();

    canvasCtx.stroke();
    canvasCtx.closePath();
    radius += 5;
    x += sliceWidth;
  }
}

const drawOscilloscope = (dataArray, bufferLength) => {
  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;

  canvasCtx.beginPath();

  var sliceWidth = canvas.width * 1.0 / (bufferLength / 2);
  var x = 0;

  for (var i = 0; i < bufferLength; i += 1) {

    var v = dataArray[i] / 128.0;
    var y = v * canvas.height / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
};

/* Pause and resume audio */

export const playMusic = (audioCtx) => {
  if (audioCtx) {
    audioCtx.resume();
    if (rotated) {
      const newIntervalId = window.setInterval(rotateColor, 3000);
      intervalId = newIntervalId;
    }
  }
};

export const pauseMusic = (audioCtx) => {
  if (audioCtx) {
    audioCtx.suspend();
    if (rotated) {
      window.clearInterval(intervalId);
    }
  }
};


/* Color Picker */

let intervalId;
let rotated = false;

  //select a color from the raibow bar

document.getElementById('color-bar').addEventListener("click", (event) => {
  hue = event.clientX * 2;
});

  //rotate color every 3 seconds

document.getElementById('rotate-color').addEventListener("click", () => {
  intervalId = window.setInterval(rotateColor, 3000);
  rotated = true;
});

export const rotateColor = () => {
  if (hue + 30 <= 360) {
    hue += 30;
  } else {
    hue = 52;
  }
};
