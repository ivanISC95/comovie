// src/db/index.ts

import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Movie } from '../types/movie';

export class CinePalsDatabase extends Dexie {
  movies!: Table<Movie, string>;

  constructor() {
    super('CinePalsDB');

    this.version(1).stores({
      movies: 'id, title, genre, rating, watchedAt, owner, addedAt',
    });
  }
}

export const db = new CinePalsDatabase();