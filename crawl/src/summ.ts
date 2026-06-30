import { pipeline } from "@xenova/transformers";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function sumIt() {
  const newsDataPath = join(__dirname, "../dist/news.json");
  const newsData: Array<{ details: string }> = JSON.parse(
    readFileSync(newsDataPath, "utf-8")
  );

  const summarizer = await pipeline(
    "summarization",
    "Xenova/distilbart-cnn-12-6"
  );
  let counter = 0;
  for (const news of newsData) {
    let summ = await summarizer(news.details);
    console.log(summ[0]);
    counter++;
  }
}

sumIt();
