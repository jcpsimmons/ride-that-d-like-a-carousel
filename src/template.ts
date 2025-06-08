import { join } from "path";
import React from 'react';
import { renderToString } from 'react-dom/server';
import * as sass from "sass";
import { Slide } from './Slide';
import type { CarouselConfig, CarouselSlide } from "./types";

// Compile SCSS to CSS once and cache it
const scssPath = join(process.cwd(), "src/template.scss");
const compiledCssStatic = sass.compile(scssPath).css;

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

  const slideComponent = React.createElement(Slide, {
    slide,
    config,
    slideNumber,
    previewMode: options?.previewMode
  });

  const slideHtml = renderToString(slideComponent);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
${compiledCss}
        </style>
      </head>
      <body class="${options?.previewMode ? 'preview-mode' : ''}">
        ${slideHtml}
      </body>
    </html>
  `;
}
