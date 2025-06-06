import { mkdir, readFile, rm, writeFile } from "fs/promises";
import { join, resolve } from "path";
import puppeteer from "puppeteer";
import { generateSlideHtml } from "./template";
import type { CarouselConfig } from "./types";

async function generateImages(
  config: CarouselConfig,
  outputDir: string = "output",
) {
  // Clean output directory if it exists
  const absoluteOutputDir = resolve(process.cwd(), outputDir);
  await rm(absoluteOutputDir, { recursive: true, force: true }).catch(() => {});
  await mkdir(absoluteOutputDir, { recursive: true });

  // Launch browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set viewport to config dimensions
  await page.setViewport({
    width: config.width,
    height: config.height,
    deviceScaleFactor: 1,
  });

  // Generate images for each slide
  for (let i = 0; i < config.slides.length; i++) {
    const slide = config.slides[i];
    const html = generateSlideHtml(slide, config, i);

    // Write HTML to temporary file
    const tempHtmlPath = join(absoluteOutputDir, `slide-${i}.html`);
    await writeFile(tempHtmlPath, html);

    // Load the HTML file using absolute path
    const fileUrl = `file://${tempHtmlPath}`;
    await page.goto(fileUrl, { waitUntil: "networkidle0" });

    // Take screenshot with config dimensions
    await page.screenshot({
      path: `${join(absoluteOutputDir, `slide-${i}`)}.jpeg`,
      type: "jpeg",
      quality: 90,
      clip: { x: 0, y: 0, width: config.width, height: config.height },
    });
  }

  await browser.close();
}

async function main() {
  const configPath = join(process.cwd(), "src/slides.json");
  const configData = await readFile(configPath, "utf-8");
  const config: CarouselConfig = JSON.parse(configData);
  await generateImages(config);
}

main().catch(console.error);
