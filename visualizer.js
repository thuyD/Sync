window.onload = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const playSample = document.getElementById('sample');
  const audioInput = document.getElementById('audio-input');
  let audio, sourceNode, audioCtx, stage, analyserNode, startPlay, playMusic, pauseMusic;

  playSample.addEventListener('click', () => {
    audio = new Audio('journeyman.mp3');
    stage();
  });

  audioInput.addEventListener('change', (e) => {
    audio = new Audio();
    audio.src = URL.createObjectURL(e.target.files[0]);
    stage();
  });

  stage = () => {
    audio.addEventListener('canplay', () => {
      audioCtx = new AudioContext();
      analyserNode = audioCtx.createAnalyser();

      visualizer(analyserNode);
      startPlay();
    });
  };

  startPlay = () => {
    sourceNode = audioCtx.createMediaElementSource(audio);
    sourceNode.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);
    analyserNode.fftSize = 2048;
    analyserNode.smoothingTimeConstant = 0.3;

    audio.play();
  };


  /* Pause and resume audio */

  playMusic = () => {
    audioCtx.resume();
    console.log(audioCtx);
  };

  pauseMusic = () => {
    audioCtx.suspend();
    console.log(audioCtx);
  };

  document.getElementById('play').addEventListener('click', playMusic);
  document.getElementById('pause').addEventListener('click', pauseMusic);


  /* Visualization */

  const canvas = document.getElementById("oscilloscope");
  const canvasCtx = canvas.getContext("2d");
  let activeVisualization = 'ripple';

    /* Allow users to select styles */

  document.getElementById('wave').addEventListener('click', () => {
    activeVisualization = 'wave';
  });

  document.getElementById('ripple').addEventListener('click', () => {
    activeVisualization = 'ripple';
  });

  // set canvas width and height
  $('#oscilloscope').attr({
    width: $(window).width(),
    height: $(window).height()
  });


  const visualizer = () => {
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
    canvasCtx.fillStyle = '#aa8caf';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = '#f0f0f0';

    canvasCtx.beginPath();

    var sliceWidth = canvas.width * 1.0 / bufferLength;
    var x = canvas.width / 2;
    var radius = 20;

    const numberOfCircles = 30;
    const iterator = Math.floor(dataArray.length / numberOfCircles);

    for (var i = 0; i < dataArray.length; i += iterator) {
      var v = dataArray[i] / 128.0;
      var y = canvas.height / 2;
      canvasCtx.beginPath();
      canvasCtx.arc(x, y, radius * v, 0, Math.PI * 2, true);
      canvasCtx.stroke();
      canvasCtx.closePath();
      radius += 7;
      x += sliceWidth;
    }
  }

  const drawOscilloscope = (dataArray, bufferLength) => {
    canvasCtx.fillStyle = '#aa8caf';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = '#f0f0f0';

    canvasCtx.beginPath();

    var sliceWidth = canvas.width * 1.0 / bufferLength;
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


};



/*

Typical Flow:
- Create audio context
- Inside the context, create sources
- Create effects nodes: reverb, biquad filter, panner, compressor
- Choose final destination of audio: system speakers
- Connect the sources up to the effects, and the effects to the destination

Useful methods for later:
*/
