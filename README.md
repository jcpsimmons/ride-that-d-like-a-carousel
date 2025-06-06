# Carousel Image Generator

A TypeScript tool that generates carousel images from structured JSON data. This tool uses HTML/CSS for layout and Puppeteer for converting the HTML to images.

## Features

- Generate high-quality carousel images from JSON configuration
- Customizable slide dimensions
- Support for titles, descriptions, and images
- Customizable colors and styling
- Outputs JPEG images

## Installation

```bash
bun install
```

## Usage

1. Create a configuration object following the `CarouselConfig` interface:

```typescript
const config: CarouselConfig = {
  width: 1920,  // Width in pixels
  height: 1080, // Height in pixels
  slides: [
    {
      title: "Slide Title",
      description: "Slide description text",
      backgroundColor: "#ffffff", // Optional
      textColor: "#000000",      // Optional
      imageUrl: "path/to/image.jpg" // Optional
    }
    // Add more slides as needed
  ]
};
```

2. Run the generator:

```bash
bun run src/index.ts
```

The generated images will be saved in the `output` directory.

## Configuration Options

### CarouselConfig
- `width`: number - Width of the output images in pixels
- `height`: number - Height of the output images in pixels
- `slides`: CarouselSlide[] - Array of slide configurations

### CarouselSlide
- `title`: string - The slide title
- `description`: string - The slide description
- `imageUrl?`: string - Optional URL to an image
- `backgroundColor?`: string - Optional background color (hex or CSS color)
- `textColor?`: string - Optional text color (hex or CSS color)

## Development

Built with:
- TypeScript
- Bun
- Puppeteer
