const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const source = audioCtx.createBufferSource();
const arrayBuffer =
audioCtx.decodedAudioData(arrayBuffer).then((decodedData) => {
  source.buffer = decodedData;
});

const finalOutput = audioCtx.destination;
//connect the AudioBufferSourceNode to the destination aka system speaker
source.connect(finalOutput);
//start the source playing
source.start();

/*
Typical Flow:
- Create audio context
- Inside the context, create sources
- Create effects nodes: reverb, biquad filter, panner, compressor
- Choose final destination of audio: system speakers
- Connect the sources up to the effects, and the effects to the destination



Useful methods for later:
AudioContext.resume() - resumes the audioContext
AudioContext.suspend() - pauses the audioContext
AudioBufferSourceNode: represents an audio source consisting of in-memory
data, stored in an AudioBuffer - audio node that acts as an audio source
*/
