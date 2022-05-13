let modelo = null;
let procesando = false;
const names = [
  "",
  "Army_navy",
  "Bulldog",
  "Castroviejo",
  "Forceps",
  "Frazier",
  "Hemostat",
  "Iris",
  "Mayo_metz",
  "Needle",
  "Potts",
  "Richardson",
  "Scalpel",
  "Towel_clip",
  "Weitlaner",
  "Yankauer",
];

async function cargarModelo() {
  modelo = await tf.loadGraphModel("model/model.json");
}

async function procesar(canvas) {
  if (procesando) {
    return;
  }
  if (!modelo) {
    return;
  }

  procesando = true;
  _detecciones = [];

  let [modelWidth, modelHeight] = modelo.inputs[0].shape.slice(1, 3);
  const input = tf.tidy(() => {
    return tf.image
      .resizeBilinear(tf.browser.fromPixels(canvas), [modelWidth, modelHeight])
      .div(255.0)
      .expandDims(0);
  });
  const res = await modelo.executeAsync(input);
  const [boxes, scores, classes, valid_detections] = res;
  const boxes_data = boxes.dataSync();
  const scores_data = scores.dataSync();
  const classes_data = classes.dataSync();
  const valid_detections_data = valid_detections.dataSync()[0];

  tf.dispose(res);
  for (i = 0; i < valid_detections_data; ++i) {
    let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
    x1 *= canvas.width;
    x2 *= canvas.width;
    y1 *= canvas.height;
    y2 *= canvas.height;
    const width = x2 - x1;
    const height = y2 - y1;
    const clase = names[classes_data[i]];

    const score = scores_data[i].toFixed(2);
    if (score > 0.6) {
      _detecciones.push({
        ctx,
        clase,
        index_clase: classes_data[i],
        width,
        height,
        score,
        x1,
        y1,
      });
    }
  }
  detecciones = _detecciones;

  procesando = false;
}
