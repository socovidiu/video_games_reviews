export interface Game {
  id: number;
  title: string;
  genre: string;
  rating: number;
  released: Date;
  description: string;
  platforms: string;
  gameimage: [
    {
        "imageUrl": string; // URL of the game's cover image
    }
  ]
}