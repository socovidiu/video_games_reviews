export interface GameData {
  id: number;
  title: string;
  genre: string;
  rating: number;
  released: string;
  
}

export interface GameDetails {
  description: string;
  platforms: string;
}

export interface GameImage {
  imageUrl: string;
}

export type GameImages = GameImage[];


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