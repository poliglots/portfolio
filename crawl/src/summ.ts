import { pipeline } from "@xenova/transformers";
import newsData from "../../dist/news.json";

async function sumIt() {
  const summarizer = await pipeline(
    "summarization",
    "Xenova/distilbart-cnn-12-6"
  );
  let counter = 0;
  for (let news of newsData) {
    // if (counter >= 1) {
    //   return;
    // }
    let summ = await summarizer(news.details);
    console.log(summ[0]);
    counter++;
  }
}

sumIt();
