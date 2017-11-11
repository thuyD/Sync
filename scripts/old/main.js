import {
  visualizer, rotateColor, playMusic, pauseMusic
} from './visualization.js';

window.onload = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const playSample = document.getElementById('sample');
  const audioInput = document.getElementById('audio-input');
  const audioCtx = new AudioContext();
  const analyserNode = audioCtx.createAnalyser();
  let audio, sourceNode, stage, startPlay;

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
      startPlay();
      visualizer(analyserNode);
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

  document.getElementById('play')
  .addEventListener('click', () => playMusic(audioCtx));

  document.getElementById('pause')
  .addEventListener('click', () => pauseMusic(audioCtx));

  /* Using microphone */

  let webSource;
  document.getElementById('start-monitoring')
  .addEventListener('click', handleMonitoring);

  document.getElementById('stop-monitoring')
  .addEventListener('click', handleStopMonitoring);

  function handleMonitoring() {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(function (stream) {
        webSource = audioCtx.createMediaStreamSource(stream);
        webSource.connect(analyserNode);
        analyserNode.connect(audioCtx.destination);
        analyserNode.fftSize = 2048;
        analyserNode.smoothingTimeConstant = 0.3;
        visualizer();
      }).catch(function(err) {
        console.log("There was an error when getting microphone input: " + err);
      });
    } else {
      console.log('getUserMedia not supported on your browser!');
    }
  }

  function handleStopMonitoring() {
    if (webSource) {
      webSource.disconnect();
      webSource = null;
    }
  }
};
