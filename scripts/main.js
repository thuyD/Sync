import AudioGround from './audio_ground.js';
import Wave from './wave.js';

window.onload = () => {
  const audio = new AudioGround();

  audio.playSample();
  audio.playYourFile();

  audio.play();
  audio.pause();

  audio.startMonitoring();
  audio.stopMonitoring();

  audio.setUpVisual();

  Wave();
};
