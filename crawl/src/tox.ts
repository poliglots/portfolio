import * as tf from "@tensorflow/tfjs-core";
import toxicity from "@tensorflow-models/toxicity";
import "@tensorflow/tfjs-backend-cpu";
// The minimum prediction confidence.
const threshold = 0.9;
tf.setBackend("cpu");
console.log("Using TensorFlow backend:", tf.getBackend());

// Load the model. Users optionally pass in a threshold and an array of
// labels to include.
toxicity.load(threshold).then((model) => {
  const sentences = ["you suck"];

  model.classify(sentences).then((predictions) => {
    // `predictions` is an array of objects, one for each prediction head,
    // that contains the raw probabilities for each input along with the
    // final prediction in `match` (either `false` or `true`).
    // If neither prediction exceeds the threshold, `match` is `null`.

    console.log(predictions);

    predictions.forEach((prediction) => {
      prediction.results.forEach((result, index) => {
        console.log(`${prediction.label} : ${result.match}`);
      });
    });
  });
});
