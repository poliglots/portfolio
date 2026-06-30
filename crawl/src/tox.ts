import * as tf from "@tensorflow/tfjs-core";
import * as toxicity from "@tensorflow-models/toxicity";
import "@tensorflow/tfjs-backend-cpu";

const THRESHOLD = 0.9;

tf.setBackend("cpu");
console.log("Using TensorFlow backend:", tf.getBackend());

// Load the model and run a sample classification.
async function runToxicityCheck() {
  const model = await toxicity.load(THRESHOLD, []);
  const sentences = ["you suck"];

  const predictions = await model.classify(sentences);
  console.log(predictions);

  predictions.forEach((prediction) => {
    prediction.results.forEach((result) => {
      console.log(`${prediction.label} : ${result.match}`);
    });
  });
}

runToxicityCheck();
