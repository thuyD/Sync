/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _audio_ground = __webpack_require__(1);

var _audio_ground2 = _interopRequireDefault(_audio_ground);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
    var audio = new _audio_ground2.default();

    audio.playSample();
    audio.playYourFile();

    audio.play();
    audio.pause();

    audio.startMonitoring();
    audio.stopMonitoring();

    audio.setUpVisual();

    var modal = document.getElementsByClassName('modal')[0];
    var btn = document.getElementById("open-modal");
    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function () {
        modal.style.display = "block";
    };

    span.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _visualization = __webpack_require__(2);

var _visualization2 = _interopRequireDefault(_visualization);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioGround = function () {
  function AudioGround() {
    _classCallCheck(this, AudioGround);

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.analyserNode = this.audioCtx.createAnalyser();
    this.analyserNode.smoothingTimeConstant = 0.3;
    this.aSourceNode = null;
    this.visual = new _visualization2.default();
    this.microphoneMode = "microphone";
  }

  _createClass(AudioGround, [{
    key: 'setUpVisual',
    value: function setUpVisual() {
      this.visual.selectStyle();
      this.visual.setupCanvas();
      this.visual.selectColor();
      this.visual.rotateColor();
    }
  }, {
    key: 'playSample',
    value: function playSample() {
      var _this = this;

      var playSample = document.getElementById('sample');
      var audio = void 0;
      playSample.addEventListener('click', function () {
        audio = new Audio('journeyman.mp3');
        _this.stage(audio);
      });
    }
  }, {
    key: 'playYourFile',
    value: function playYourFile() {
      var _this2 = this;

      var audioInput = document.getElementById('audio-input');
      var audio = void 0;
      audioInput.addEventListener('change', function (e) {
        audio = new Audio();
        audio.src = URL.createObjectURL(e.target.files[0]);
        _this2.stage(audio);
      });
    }
  }, {
    key: 'stage',
    value: function stage(audio) {
      var _this3 = this;

      audio.addEventListener('canplay', function () {
        _this3.startPlay(audio);
        _this3.visual.visualizer(_this3.analyserNode);
        _this3.togglePlayPause('pause');
      });
    }
  }, {
    key: 'startPlay',
    value: function startPlay(audio) {
      if (this.aSourceNode) {
        this.aSourceNode.disconnect(this.analyserNode);
        this.aSourceNode = null;
      }
      var sourceNode = this.audioCtx.createMediaElementSource(audio);
      this.aSourceNode = sourceNode;
      sourceNode.connect(this.analyserNode);
      this.analyserNode.connect(this.audioCtx.destination);

      audio.play();
    }
  }, {
    key: 'play',
    value: function play() {
      document.getElementsByClassName('fa-play')[0].addEventListener('click', this.playMusic.bind(this));
    }
  }, {
    key: 'pause',
    value: function pause() {
      document.getElementsByClassName('fa-pause')[0].addEventListener('click', this.pauseMusic.bind(this));
    }
  }, {
    key: 'playMusic',
    value: function playMusic() {
      if (this.audioCtx) {
        this.audioCtx.resume();
        this.visual.updateIntervalId();
        this.togglePlayPause('pause');
      }
    }
  }, {
    key: 'pauseMusic',
    value: function pauseMusic() {
      if (this.audioCtx) {
        this.audioCtx.suspend();
        this.visual.clearIntervalId();
        this.togglePlayPause('play');
      }
    }
  }, {
    key: 'togglePlayPause',
    value: function togglePlayPause(mode) {
      if (mode === "play") {
        $("#play").show();
        $("#pause").hide();
      } else if (mode === "pause") {
        $("#pause").show();
        $("#play").hide();
      } else {
        $("#pause").hide();
        $("#play").hide();
      }
    }
  }, {
    key: 'handleMonitoring',
    value: function handleMonitoring() {
      var _this4 = this;

      this.togglePlayPause("none");
      if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function (stream) {
          if (_this4.aSourceNode) {
            _this4.aSourceNode.disconnect(_this4.analyserNode);
            _this4.aSourceNode = null;
          }
          var webSource = _this4.audioCtx.createMediaStreamSource(stream);
          webSource.connect(_this4.analyserNode);
          _this4.analyserNode.connect(_this4.audioCtx.destination);
          _this4.visual.visualizer(_this4.analyserNode);
          _this4.toggleMicrophone('noMicrophone');
          _this4.aSourceNode = webSource;
        }).catch(function (err) {
          console.log("There was an error when getting microphone input: " + err);
        });
      } else {
        console.log('getUserMedia not supported on your browser!');
      }
    }
  }, {
    key: 'handleStopMonitoring',
    value: function handleStopMonitoring() {
      if (this.aSourceNode) {
        this.aSourceNode.disconnect();
        this.aSourceNode = null;
        this.toggleMicrophone('microphone');
      }
    }
  }, {
    key: 'startMonitoring',
    value: function startMonitoring() {
      document.getElementById("mic").addEventListener('click', this.handleMonitoring.bind(this));
    }
  }, {
    key: 'stopMonitoring',
    value: function stopMonitoring() {
      document.getElementById("no-mic").addEventListener('click', this.handleStopMonitoring.bind(this));
    }
  }, {
    key: 'toggleMicrophone',
    value: function toggleMicrophone(mode) {
      if (mode === "noMicrophone") {
        $('#mic').hide();
        $('#no-mic').show();
      } else {
        $('#no-mic').hide();
        $('#mic').show();
      }
    }
  }]);

  return AudioGround;
}();

exports.default = AudioGround;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debounce = __webpack_require__(3);

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Visualization = function () {
  function Visualization() {
    _classCallCheck(this, Visualization);

    this.canvas = document.getElementById("board");
    this.canvasCtx = this.canvas.getContext("2d");
    this.activeVisualization = 'ripple';
    this.hue = 52;
    this.sat = 95;
    this.light = 42;
    this.alpha = 0.8;
    this.intervalId = '';
    this.rotated = false;
  }

  _createClass(Visualization, [{
    key: "selectStyle",
    value: function selectStyle() {
      var _this = this;

      document.getElementById('wave').addEventListener('click', function () {
        _this.activeVisualization = 'wave';
      }.bind(this));

      document.getElementById('ripple').addEventListener('click', function () {
        _this.activeVisualization = 'ripple';
      }.bind(this));
    }
  }, {
    key: "updateCanvasSize",
    value: function updateCanvasSize() {
      $('#board').attr({
        width: $(window).width(),
        height: $(window).height()
      });
    }
  }, {
    key: "setupCanvas",
    value: function setupCanvas() {
      var _this2 = this;

      this.updateCanvasSize();
      var resizeCanvas = (0, _debounce2.default)(function () {
        _this2.updateCanvasSize();
      }, 250);
      window.addEventListener('resize', resizeCanvas);
    }
  }, {
    key: "visualizer",
    value: function visualizer(analyserNode) {
      var bufferLength = analyserNode.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);

      this.drawThenClear(analyserNode, dataArray, bufferLength);
    }
  }, {
    key: "draw",
    value: function draw(analyserNode, dataArray, bufferLength) {
      var _this3 = this;

      var drawVisual = requestAnimationFrame(function () {
        return _this3.draw(analyserNode, dataArray, bufferLength);
      }.bind(this));
      analyserNode.getByteTimeDomainData(dataArray);

      if (this.activeVisualization === 'ripple') {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCircle(dataArray, bufferLength);
      } else {
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawOscilloscope(dataArray, bufferLength);
      }
    }
  }, {
    key: "drawThenClear",
    value: function drawThenClear(analyserNode, dataArray, bufferLength) {
      this.draw(analyserNode, dataArray, bufferLength);
      this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }, {
    key: "drawCircle",
    value: function drawCircle(dataArray, bufferLength) {
      this.canvasCtx.lineWidth = 2;
      this.canvasCtx.strokeStyle = "hsla(" + this.hue + ", " + this.sat + "%, " + this.light + "%, 0.6)";

      this.canvasCtx.beginPath();

      var sliceWidth = this.canvas.width * 1.0 / bufferLength;
      var x = this.canvas.width / 2;
      var radius = 20;

      var numberOfCircles = 60;
      var iterator = Math.floor(dataArray.length / numberOfCircles);

      for (var i = 0; i < dataArray.length; i += iterator) {
        var v = dataArray[i] / 128.0;
        var y = this.canvas.height / 2;
        this.canvasCtx.beginPath();
        this.canvasCtx.arc(x, y, radius * v, 0, Math.PI * 2, true);
        this.canvasCtx.fillStyle = "hsla(" + this.hue + ", 100%, 40%, 0.02)";
        this.canvasCtx.fill();

        this.canvasCtx.stroke();
        this.canvasCtx.closePath();
        radius += 5;
        x += sliceWidth;
      }
    }
  }, {
    key: "drawOscilloscope",
    value: function drawOscilloscope(dataArray, bufferLength) {
      this.canvasCtx.strokeStyle = "hsla(" + this.hue + ", " + this.sat + "%, " + this.light + "%, " + this.alpha + ")";
      this.canvasCtx.beginPath();
      this.canvasCtx.lineWidth = 6;

      var sliceWidth = this.canvas.width * 1.0 / (bufferLength / 2);
      var x = 0;

      for (var i = 0; i < bufferLength; i += 1) {
        var v = dataArray[i] / 128.0;
        var y = v * this.canvas.height / 2;

        if (i === 0) {
          this.canvasCtx.moveTo(x, y);
        } else {
          this.canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      this.canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2);
      this.canvasCtx.stroke();
    }
  }, {
    key: "incrementColor",
    value: function incrementColor() {
      if (this.hue + 30 <= 360) {
        this.hue += 30;
      } else {
        this.hue = 52;
      }
    }
  }, {
    key: "rotateColor",
    value: function rotateColor() {
      var _this4 = this;

      document.getElementById('rotate-color').addEventListener("click", function () {
        _this4.intervalId = window.setInterval(_this4.incrementColor.bind(_this4), 3000);
        _this4.rotated = true;
      }.bind(this));
    }
  }, {
    key: "selectColor",
    value: function selectColor() {
      var _this5 = this;

      document.getElementById('color-bar').addEventListener("click", function (event) {
        _this5.hue = event.clientX * 2 - 25;
      }.bind(this));
    }
  }, {
    key: "updateIntervalId",
    value: function updateIntervalId() {
      if (this.rotated) {
        var newIntervalId = window.setInterval(this.incrementColor.bind(this), 3000);
        this.intervalId = newIntervalId;
      }
    }
  }, {
    key: "clearIntervalId",
    value: function clearIntervalId() {
      if (this.rotated) {
        window.clearInterval(this.intervalId);
      }
    }
  }]);

  return Visualization;
}();

exports.default = Visualization;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

exports.default = debounce;

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map