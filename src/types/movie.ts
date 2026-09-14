// src/types/movie.ts

export type Genre =
  | 'Acción'
  | 'Comedia'
  | 'Drama'
  | 'Terror'
  | 'Ciencia Ficción'
  | 'Romance'
  | 'Animación'
  | 'Documental'
  | 'Thriller'
  | 'Otro';

export interface Movie {
  id: string;
  title: string;
  genre: Genre;
  rating?: number;
  watched: boolean;
  createdAt: number;
  owner: 'me' | 'partner';
  partnerId?: string;

  // Campos opcionales que faltaban
  imageUrl?: string;
  year?: number;
  comment?: string;
}

export interface PeerUser {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  lastSyncedAt?: number;
}

export interface PeerSyncPayload {
  type: 'SYNC_MOVIES_RESPONSE';
  senderId: string;
  senderName: string;
  movies: Movie[];
}