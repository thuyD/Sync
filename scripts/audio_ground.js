import Visualization from './visualization.js';

class AudioGround {
  constructor() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.analyserNode = this.audioCtx.createAnalyser();
    this.analyserNode.smoothingTimeConstant = 0.3;
    this.webSource = null;
    this.visual = new Visualization();
  }

  setUpVisual() {
    this.visual.selectStyle();
    this.visual.setupCanvas();
    this.visual.selectColor();
    this.visual.rotateColor();
  }

  playSample() {
    const playSample = document.getElementById('sample');
    let audio;
    playSample.addEventListener('click', () => {
      audio = new Audio('journeyman.mp3');
      this.stage(audio);
    });
  }

  playYourFile() {
    const audioInput = document.getElementById('audio-input');
    let audio;
    audioInput.addEventListener('change', (e) => {
      audio = new Audio();
      audio.src = URL.createObjectURL(e.target.files[0]);
      this.stage(audio);
    });
  }

  stage(audio) {
    audio.addEventListener('canplay', () => {
      this.startPlay(audio);
      this.visual.visualizer(this.analyserNode);
    });
  }

  startPlay(audio) {
    const sourceNode = this.audioCtx.createMediaElementSource(audio);
    sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioCtx.destination);

    audio.play();
  }

  play() {
    document.getElementById('play')
    .addEventListener('click', this.playMusic.bind(this));
  }

  pause() {
    document.getElementById('pause')
    .addEventListener('click', this.pauseMusic.bind(this));
  }

  playMusic() {
    if (this.audioCtx) {
      this.audioCtx.resume();
      this.visual.updateIntervalId();
    }
  }

  pauseMusic() {
    if (this.audioCtx) {
      this.audioCtx.suspend();
      this.visual.clearIntervalId();
    }
  }

  handleMonitoring() {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((stream) => {
        this.webSource = this.audioCtx.createMediaStreamSource(stream);
        this.webSource.connect(this.analyserNode);
        this.analyserNode.connect(this.audioCtx.destination);
        this.visual.visualizer(this.analyserNode);
      }).catch(function(err) {
        console.log("There was an error when getting microphone input: " + err);
      });
    } else {
      console.log('getUserMedia not supported on your browser!');
    }
  }

  handleStopMonitoring() {
    if (this.webSource) {
      this.webSource.disconnect();
      this.webSource = null;
    }
  }

  startMonitoring() {
    document.getElementById('start-monitoring')
    .addEventListener('click', this.handleMonitoring.bind(this));
  }

  stopMonitoring() {
    document.getElementById('stop-monitoring')
    .addEventListener('click', this.handleStopMonitoring.bind(this));
  }

}

export default AudioGround;
