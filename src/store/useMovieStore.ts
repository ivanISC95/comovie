// src/store/useMovieStore.ts

import { create } from 'zustand';
import { db } from '../db';
import type { Movie, Genre } from '../types/movie';

export type ActiveTab = 'home' | 'my-list' | 'community';

interface MovieState {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
  activeTab: ActiveTab;

  // Estados de filtros y modales
  searchQuery: string;
  selectedGenre: Genre | 'all';
  isAddModalOpen: boolean;

  // Acciones
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedGenre: (genre: Genre | 'all') => void;
  setIsAddModalOpen: (isOpen: boolean) => void;

  fetchMovies: () => Promise<void>;
  addMovie: (movieData: Omit<Movie, 'id' | 'createdAt' | 'owner'>) => Promise<void>;
  updateMovie: (id: string, movieData: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  toggleWatched: (id: string) => Promise<void>;
  mergePartnerMovies: (partnerId: string, partnerMovies: Movie[]) => Promise<void>;
  
  // Respaldo JSON
  exportMoviesJSON: () => void;
  importMoviesJSON: (jsonString: string) => Promise<void>;
}

export const useMovieStore = create<MovieState>((set, get) => ({
  movies: [],
  isLoading: false,
  error: null,
  activeTab: 'home',

  // Valores iniciales de filtros y UI
  searchQuery: '',
  selectedGenre: 'all',
  isAddModalOpen: false,

  setActiveTab: (activeTab: ActiveTab) => set({ activeTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedGenre: (selectedGenre) => set({ selectedGenre }),
  setIsAddModalOpen: (isAddModalOpen) => set({ isAddModalOpen }),

  fetchMovies: async () => {
    set({ isLoading: true, error: null });
    try {
      const movies = await db.movies.toArray();
      set({ movies, isLoading: false });
    } catch (err) {
      console.error('Error fetching movies:', err);
      set({ error: 'Error al cargar las películas', isLoading: false });
    }
  },

  addMovie: async (movieData) => {
    const newMovie: Movie = {
      ...movieData,
      id: crypto.randomUUID(),
      owner: 'me',
      createdAt: Date.now(),
    };

    await db.movies.add(newMovie);
    set((state) => ({ movies: [...state.movies, newMovie] }));
  },

  updateMovie: async (id, movieData) => {
    await db.movies.update(id, movieData);
    set((state) => ({
      movies: state.movies.map((m) => (m.id === id ? { ...m, ...movieData } : m)),
    }));
  },

  deleteMovie: async (id) => {
    await db.movies.delete(id);
    set((state) => ({
      movies: state.movies.filter((m) => m.id !== id),
    }));
  },

  toggleWatched: async (id) => {
    const movie = get().movies.find((m) => m.id === id);
    if (!movie) return;

    const updatedWatched = !movie.watched;
    await db.movies.update(id, { watched: updatedWatched });

    set((state) => ({
      movies: state.movies.map((m) =>
        m.id === id ? { ...m, watched: updatedWatched } : m
      ),
    }));
  },

  mergePartnerMovies: async (partnerId, partnerMovies) => {
    const existingMovies = get().movies;
    const partnerMoviesFormatted = partnerMovies.map((m) => ({
      ...m,
      owner: 'partner' as const,
      partnerId,
    }));

    for (const movie of partnerMoviesFormatted) {
      const exists = existingMovies.some(
        (m) => m.id === movie.id || (m.title.toLowerCase() === movie.title.toLowerCase() && m.owner === 'partner')
      );
      if (!exists) {
        await db.movies.put(movie);
      }
    }

    const allMovies = await db.movies.toArray();
    set({ movies: allMovies });
  },

  exportMoviesJSON: () => {
    const myMovies = get().movies.filter((m) => m.owner === 'me');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(myMovies, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cinepals-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  importMoviesJSON: async (jsonString: string) => {
    try {
      const importedMovies: Movie[] = JSON.parse(jsonString);
      if (!Array.isArray(importedMovies)) return;

      for (const movie of importedMovies) {
        const formatted: Movie = {
          ...movie,
          id: movie.id || crypto.randomUUID(),
          owner: 'partner',
        };
        await db.movies.put(formatted);
      }

      const allMovies = await db.movies.toArray();
      set({ movies: allMovies });
    } catch (e) {
      console.error('Error al importar archivo JSON:', e);
    }
  },
}));