const cargando = document.getElementById("cargando");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const font = "16px sans-serif";
const tools = document.querySelectorAll("#tools img");
const selectorCamara = document.getElementById("select-camaras");
let detecciones = [];

function DrawBoxDetection({ ctx, x1, y1, width, height, clase, score }) {
  ctx.strokeStyle = "#00FFFF";
  ctx.lineWidth = 4;
  ctx.strokeRect(x1, y1, width, height);
  ctx.fillStyle = "#00FFFF";
  ctx.font = font;
  ctx.fillText(clase + ":" + score, x1, y1 + 10);
}

function toggleStateTools() {
  tools.forEach((tool) => {
    const c = parseInt(tool.getAttribute("clase"));
    if (detecciones.some((d) => d.index_clase == c)) {
      tool.classList.add("active");
    } else {
      tool.classList.remove("active");
    }
  });
}

async function Loop() {
  const naturalWidth = video.videoWidth;
  const naturalHeight = video.videoHeight;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "#F2F3F4";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const ratio = Math.min(
    canvas.width / naturalWidth,
    canvas.height / naturalHeight
  );
  const newWidth = Math.round(naturalWidth * ratio);
  const newHeight = Math.round(naturalHeight * ratio);
  ctx.drawImage(
    video,
    0,
    0,
    naturalWidth,
    naturalHeight,
    (canvas.width - newWidth) / 2,
    (canvas.height - newHeight) / 2,
    newWidth,
    newHeight
  );

  procesar(canvas);

  detecciones.forEach((d) => {
    DrawBoxDetection(d);
  });

  toggleStateTools();

  requestAnimationFrame(Loop);
}

function esperar(t = 500) {
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve();
    }, t);
  });
}

async function Init() {
  cargando.style.display = "block";
  obtenerCamaras();
  await esperar(1000);

  console.log("Abrir camara");

  await abrirCamara({
    video: {
      deviceId: selectorCamara.options[0].value,
      width: { exact: 640 },
      height: { exact: 480 },
    },
  });
  console.log("Ok");
  console.log("Cargar modelo");
  cargarModelo();
  console.log("Ok");
  cargando.style.display = "none";
  Loop();
}

selectorCamara.onchange = async function () {
  cargando.style.display = "block";
  await abrirCamara({
    video: {
      deviceId: this.value,
      width: { exact: 640 },
      height: { exact: 480 },
    },
  });
  cargando.style.display = "none";
};

Init();
