import AudioGround from './audio_ground.js';

window.onload = () => {
  const audio = new AudioGround();

  audio.playSample();
  audio.playYourFile();

  audio.play();
  audio.pause();

  audio.startMonitoring();
  audio.stopMonitoring();

  audio.setUpVisual();

  const modal = document.getElementsByClassName('modal')[0];
  const btn = document.getElementById("open-modal");
  const span = document.getElementsByClassName("close")[0];

  btn.onclick = function() {
      modal.style.display = "block";
  };

  span.onclick = function() {
      modal.style.display = "none";
  };

  window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
  };

};
