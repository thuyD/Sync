import Visualization from './visualization.js';

class AudioGround {
  constructor() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.analyserNode = this.audioCtx.createAnalyser();
    this.analyserNode.smoothingTimeConstant = 0.3;
    this.aSourceNode = null;
    this.visual = new Visualization();
    this.microphoneMode = "microphone";
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
      this.togglePlayPause('pause');
    });
  }

  startPlay(audio) {
    this.disconnectSourceNode();
    const sourceNode = this.audioCtx.createMediaElementSource(audio);
    this.aSourceNode = sourceNode;
    sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioCtx.destination);

    audio.play();
  }

  play() {
    document.getElementsByClassName('fa-play')[0]
    .addEventListener('click', this.playMusic.bind(this));
  }

  pause() {
    document.getElementsByClassName('fa-pause')[0]
    .addEventListener('click', this.pauseMusic.bind(this));
  }

  playMusic() {
    if (this.audioCtx) {
      this.audioCtx.resume();
      this.visual.updateIntervalId();
      this.togglePlayPause('pause');
    }
  }

  pauseMusic() {
    if (this.audioCtx) {
      this.audioCtx.suspend();
      this.visual.clearIntervalId();
      this.togglePlayPause('play');
    }
  }

  togglePlayPause(mode) {
    if (mode ===  "play") {
      $("#play").show();
      $("#pause").hide();
    } else if (mode === "pause"){
      $("#pause").show();
      $("#play").hide();
    } else {
      $("#pause").hide();
      $("#play").hide();
    }
  }

  handleMonitoring() {
    this.togglePlayPause("none");
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((stream) => {
        this.disconnectSourceNode();
        const webSource = this.audioCtx.createMediaStreamSource(stream);
        webSource.connect(this.analyserNode);
        this.analyserNode.connect(this.audioCtx.destination);
        this.visual.visualizer(this.analyserNode);
        this.toggleMicrophone('noMicrophone');
        this.aSourceNode = webSource;
      }).catch(function(err) {
        console.log("There was an error when getting microphone input: " + err);
      });
    } else {
      console.log('getUserMedia not supported on your browser!');
    }
  }

  handleStopMonitoring() {
    if (this.aSourceNode) {
      this.toggleMicrophone('microphone');
    }
    this.disconnectSourceNode();
  }

  startMonitoring() {
    document.getElementById("mic")
    .addEventListener('click', this.handleMonitoring.bind(this));
  }

  stopMonitoring() {
    document.getElementById("no-mic")
    .addEventListener('click', this.handleStopMonitoring.bind(this));
  }

  toggleMicrophone(mode) {
    if (mode === "noMicrophone") {
      $('#mic').hide();
      $('#no-mic').show();
    } else {
      $('#no-mic').hide();
      $('#mic').show();
    }
  }

  disconnectSourceNode() {
    if (this.aSourceNode) {
      this.aSourceNode.disconnect();
      this.aSourceNode = null;
    }
  }

}

export default AudioGround;
