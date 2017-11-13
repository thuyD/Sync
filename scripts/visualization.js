import debounce from './debounce.js';

class Visualization {
  constructor() {
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

  selectStyle() {
    document.getElementById('wave').addEventListener('click', (() => {
      this.activeVisualization = 'wave';
    }).bind(this));

    document.getElementById('ripple').addEventListener('click', (() => {
      this.activeVisualization = 'ripple';
    }).bind(this));
  }

  updateCanvasSize() {
    $('#board').attr({
      width: $(window).width(),
      height: $(window).height()
    });
  }

  setupCanvas() {
    this.updateCanvasSize();
    const resizeCanvas = debounce(() => {
      this.updateCanvasSize();
    }, 250);
    window.addEventListener('resize', resizeCanvas);
  }

  visualizer(analyserNode) {
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    this.drawThenClear(analyserNode, dataArray, bufferLength);
  }

  draw(analyserNode, dataArray, bufferLength) {
    const drawVisual = requestAnimationFrame(
      (() => this.draw(analyserNode, dataArray, bufferLength)).bind(this)
    );
    analyserNode.getByteTimeDomainData(dataArray);

    if (this.activeVisualization === 'ripple') {
      this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawCircle(dataArray, bufferLength);
    } else {
      this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawOscilloscope(dataArray, bufferLength);
    }
  }

  drawThenClear(analyserNode, dataArray, bufferLength) {
    this.draw(analyserNode, dataArray, bufferLength);
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawCircle(dataArray, bufferLength) {
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.strokeStyle = `hsla(${this.hue}, ${this.sat}%, ${this.light}%, 0.6)`;

    this.canvasCtx.beginPath();

    const sliceWidth = this.canvas.width * 1.0 / bufferLength;
    let x = this.canvas.width / 2;
    let radius = 20;

    const numberOfCircles = 60;
    const iterator = Math.floor(dataArray.length / numberOfCircles);

    for (let i = 0; i < dataArray.length; i += iterator) {
      const v = dataArray[i] / 128.0;
      const y = this.canvas.height / 2;
      this.canvasCtx.beginPath();
      this.canvasCtx.arc(x, y, radius * v, 0, Math.PI * 2, true);
      this.canvasCtx.fillStyle = `hsla(${this.hue}, 100%, 40%, 0.02)`;
      this.canvasCtx.fill();

      this.canvasCtx.stroke();
      this.canvasCtx.closePath();
      radius += 5;
      x += sliceWidth;
    }
  }

  drawOscilloscope(dataArray, bufferLength) {
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.strokeStyle = `hsla(${this.hue}, ${this.sat}%, ${this.light}%, ${this.alpha})`;
    this.canvasCtx.beginPath();

    const sliceWidth = this.canvas.width * 1.0 / (bufferLength / 2);
    let x = 0;

    for (let i = 0; i < bufferLength; i += 1) {
      const v = dataArray[i] / 128.0;
      const y = v * this.canvas.height / 2;

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

  incrementColor() {
    if (this.hue + 30 <= 360) {
      this.hue += 30;
    } else {
      this.hue = 52;
    }
  }

  rotateColor() {
    document.getElementById('rotate-color').addEventListener("click", (() => {
      this.intervalId = window.setInterval(this.incrementColor.bind(this), 3000);
      this.rotated = true;
    }).bind(this));
  }

  selectColor() {
    document.getElementById('color-bar').addEventListener("click", ((event) => {
      this.hue = event.clientX * 2 - 20;
    }).bind(this));
  }

  updateIntervalId() {
    if (this.rotated) {
      const newIntervalId = window.setInterval(this.incrementColor.bind(this), 3000);
      this.intervalId = newIntervalId;
    }
  }

  clearIntervalId() {
    if(this.rotated) {
      window.clearInterval(this.intervalId);
    }
  }

}

export default Visualization;
