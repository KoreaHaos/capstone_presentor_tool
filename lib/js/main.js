var videoElement = document.querySelector('video');

var videoSelect = document.querySelector('select#videoSource');

var selectors = [videoSelect];

function gotDevices(deviceInfos) {
  
  var values = selectors.map(function(select) {
    return select.value;
  });
  
  selectors.forEach(function(select) {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
      videoSelect.appendChild(option);
    } else {
      //console.log('Some other kind of source/device: ', deviceInfo);
    }


  }
  selectors.forEach(function(select, selectorIndex) {
    if (Array.prototype.slice.call(select.childNodes).some(function(n) {
      return n.value === values[selectorIndex];
    })) {
      select.value = values[selectorIndex];
    }
  });
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function start() {
  
  if (window.stream) {
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  
  var videoSource = videoSelect.value;
  
  var constraints = {
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  
  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    window.stream = stream;
    videoElement.srcObject = stream;
    return navigator.mediaDevices.enumerateDevices();
  })
  .then(gotDevices)
  .catch(errorCallback);
}

document.getElementById("video").muted = true;
videoSelect.onchange = start;
start();
