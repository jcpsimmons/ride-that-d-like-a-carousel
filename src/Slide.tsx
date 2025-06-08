import React from "react";
import type { CarouselConfig, CarouselSlide } from "./types";

interface SlideProps {
  slide: CarouselSlide;
  config: CarouselConfig;
  slideNumber: number;
  previewMode?: boolean;
}

export const Slide: React.FC<SlideProps> = ({
  slide,
  config,
  slideNumber,
  previewMode: _,
}) => {
  const content = (
    <div className={`content slide_${slideNumber}`}>
      <div className="header">
        <h1>{slide.title}</h1>
      </div>
      <div className="body">
        {slide.imageUrl && <img src={slide.imageUrl} alt={slide.title} />}
        <p style={{ whiteSpace: 'pre-wrap' }}>{slide.description}</p>
      </div>
      <div className="footer">
        <div className="slide-number">
          {slideNumber + 1}/{config.slides.length}
        </div>
        <div className="wordmark">
          <span>Dr. J</span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      id="slide-container"
      style={{
        width: config.width,
        height: config.height,
        flexShrink: 0,
      }}
    >
      {content}
    </div>
  );
};
