
var ready = false;

// Solves chrome for andriod issue 178297 Require user gesture
// https://code.google.com/p/chromium/issues/detail?id=178297
// Fix based on code from http://blog.foolip.org/2014/02/10/media-playback-restrictions-in-blink/
function watchForUserEvents() {
  if (mediaPlaybackRequiresUserGesture()) {
    window.addEventListener('keydown', removeBehaviorsRestrictions);
    window.addEventListener('mousedown', removeBehaviorsRestrictions);
    window.addEventListener('touchstart', removeBehaviorsRestrictions);
  } else {
    ready = true;
  }
}

function mediaPlaybackRequiresUserGesture() {
  // test if play() is ignored when not called from an input event handler
  var video = document.createElement('video');
  video.play();
  return video.paused;
}

function removeBehaviorsRestrictions() {
  for (var soundId in sounds) {
    sounds[soundId].load();
  }

  window.removeEventListener('keydown', removeBehaviorsRestrictions);
  window.removeEventListener('mousedown', removeBehaviorsRestrictions);
  window.removeEventListener('touchstart', removeBehaviorsRestrictions);
  
  ready = true;
}

function setVolume(id, volume) {
    sounds[id].volumne = volume;
}

function playSound(sound) {
  for (var key in sounds) {
    sounds[key].pause();
  }

  sounds[sound].load();
  sounds[sound].play();
}

var sounds = {};

function captureAudioElements() {
  var audioElements = document.getElementsByTagName('audio');

  var wasReady = ready;
  for (var i = 0; i < audioElements.length; i++) {
    if (!sounds[audioElements[i].id]) {
      ready = false;
    }
    sounds[audioElements[i].id] = audioElements[i];
  }
  
  if (wasReady && !ready) {
    watchForUserEvents();
  }
}


captureAudioElements();
watchForUserEvents();


module.exports = {
  playSound: playSound,
  captureAudioElements: captureAudioElements,
  setVolume: setVolume
};
