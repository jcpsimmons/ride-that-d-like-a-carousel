export interface CarouselSlide {
  title: string;
  description: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface CarouselConfig {
  width: number;
  height: number;
  slides: CarouselSlide[];
} 
