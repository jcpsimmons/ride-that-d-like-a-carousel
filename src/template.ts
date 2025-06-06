import { join } from "path";
import * as sass from "sass";
import type { CarouselConfig, CarouselSlide } from "./types";

// Compile SCSS to CSS once and cache it
const scssPath = join(process.cwd(), "src/template.scss");
const compiledCssStatic = sass.compile(scssPath).css;

// Theme colors from Chakra UI config
const theme = {
  brand: "rgb(225, 29, 72)",
  bg: "#1a0602",
  bgMuted: "#241a1a",
  text: "#ffffff", // Adding white text for dark background
};

export function generateSlideHtml(
  slide: CarouselSlide,
  config: CarouselConfig,
  slideNumber: number,
  options?: { previewMode?: boolean },
): string {
  // Recompile SCSS on every render in preview mode for live reload
  const compiledCss = options?.previewMode
    ? sass.compile(scssPath).css
    : compiledCssStatic;

  const merriweatherPath = join(
    process.cwd(),
    "src/fonts/MerriweatherSans-VariableFont_wght.ttf",
  );
  const merriweatherItalicPath = join(
    process.cwd(),
    "src/fonts/MerriweatherSans-Italic-VariableFont_wght.ttf",
  );
  const bbtPath = join(
    process.cwd(),
    "src/fonts/BigBlueTerm437NerdFont-Regular.ttf",
  );

  const content = `
    <div class="content slide_${slideNumber}">
      <h1>${slide.title}</h1>
      ${slide.imageUrl ? `<img src="${slide.imageUrl}" alt="${slide.title}">` : ""}
      <p>${slide.description}</p>
    </div>
  `;

  if (options?.previewMode) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
${compiledCss}
            body {
              margin: 0;
              padding: 2rem;
              min-height: 100vh;
              min-width: 100vw;
              background: #e5e5e5;
              display: flex;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;
              overflow: auto;
            }
            #slide-container {
              width: ${config.width}px;
              height: ${config.height}px;
              background: var(--bg);
              box-shadow: 0 8px 32px rgba(0,0,0,0.35), 0 1.5px 8px rgba(0,0,0,0.18);
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
          </style>
        </head>
        <body>
          <div id="slide-container">
            ${content}
          </div>
        </body>
      </html>
    `;
  }

  const bodyStyle = options?.previewMode
    ? "margin:0;overflow:hidden;background:#e5e5e5;position:relative;"
    : "margin:0;overflow:hidden;background:var(--bg);";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
${compiledCss}
          @font-face {
            font-family: 'MerriweatherSans';
            src: url('file://${merriweatherPath}') format('truetype-variations');
            font-weight: 300 800;
            font-style: normal;
          }

          @font-face {
            font-family: 'MerriweatherSans';
            src: url('file://${merriweatherItalicPath}') format('truetype-variations');
            font-weight: 300 800;
            font-style: italic;
          }

          @font-face {
            font-family: 'BigBlueTerm437';
            src: url('file://${bbtPath}') format('truetype');
            font-weight: normal;
            font-style: normal;
          }

          body {
            margin: 0;
            padding: 0;
            width: 1920px;
            height: 1920px;
            background-color: ${slide.backgroundColor || theme.bg};
            color: ${slide.textColor || theme.text};
            font-family: 'MerriweatherSans', sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
          }
          .content {
            padding: 4rem;
            max-width: 80%;
            background-color: ${theme.bgMuted};
            border-radius: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: 'BigBlueTerm437', monospace;
            font-size: 3.5rem;
            margin-bottom: 1.5rem;
            letter-spacing: 0.05em;
            color: ${theme.brand};
          }
          p {
            font-family: 'MerriweatherSans', sans-serif;
            font-size: 2rem;
            line-height: 1.6;
            font-weight: 300;
            margin: 0;
          }
          img {
            max-width: 100%;
            max-height: 50%;
            object-fit: contain;
            margin: 2rem 0;
            border-radius: 0.5rem;
          }
        </style>
      </head>
      <body style="${bodyStyle}">
        <div id="slide-container" style="width: ${config.width}px; height: ${config.height}px; background: var(--bg);">
          ${content}
        </div>
      </body>
    </html>
  `;
}
