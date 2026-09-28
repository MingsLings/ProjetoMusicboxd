export interface MusicCatalogItem {
  id: string;
  title: string;
  artist: string;
  duration: number; // em segundos
  genre: string;
}

export interface MusicLog {
  id: string;
  userId: string;
  title: string;
  artist: string;
  rating: number;
  listenedAt: Date;
  review: string;
  createdAt: Date;
}

export interface MusicLogInput {
  userId: string;
  title: string;
  artist: string;
  rating: number;
  listenedAt: Date;
  review: string;
}
