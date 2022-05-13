const video = document.getElementById("webcam");

function getUserMediaSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

if (!getUserMediaSupported()) {
  alert("No se puede acceder a la camara. Navegador no compatible");
}

function obtenerCamaras() {
  const devices = [];

  navigator.mediaDevices.enumerateDevices().then(function (devices) {
    devices.forEach(function (device) {
      if (device.kind === "videoinput") {
        var option = document.createElement("option");
        option.value = device.deviceId;
        option.text = device.label;
        selectorCamara.appendChild(option);
      }
    });
  });
}

function abrirCamara(p) {
  const constraints = {
    video: true,
    ...p,
  };
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      video.srcObject = stream;
      video.addEventListener("loadeddata", resolve);
    });
  });
}
