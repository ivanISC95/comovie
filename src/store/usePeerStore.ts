// src/store/usePeerStore.ts

import { create } from 'zustand';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import { useMovieStore } from './useMovieStore';
import type { Movie } from '../types/movie';

const savedName = localStorage.getItem('cinepals_username');
const hasSetInitialName = localStorage.getItem('cinepals_has_set_name') === 'true';

export interface ConnectedPeer {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  connection: DataConnection;
}

interface PeerState {
  peer: Peer | null;
  myPeerId: string;
  userName: string;
  isFirstTime: boolean;
  connectedPeers: ConnectedPeer[];
  isConnecting: boolean;
  error: string | null;
  statusMessage: string;

  // Acciones de Perfil
  setUserName: (name: string) => void;
  completeInitialSetup: (name: string) => void;

  // Acciones P2P / PeerJS
  initPeer: () => void;
  connectToPeer: (targetPeerId: string) => void;
  broadcastMovies: (movies?: Movie[]) => void;
  disconnectPeer: (peerId: string) => void;
}

export const usePeerStore = create<PeerState>((set, get) => ({
  peer: null,
  myPeerId: '',
  userName: savedName || 'Usuario',
  isFirstTime: !hasSetInitialName,
  connectedPeers: [],
  isConnecting: false,
  error: null,
  statusMessage: 'Listo para conectar',

  setUserName: (name: string) => {
    localStorage.setItem('cinepals_username', name);
    set({ userName: name });
  },

  completeInitialSetup: (name: string) => {
    localStorage.setItem('cinepals_username', name);
    localStorage.setItem('cinepals_has_set_name', 'true');
    set({ userName: name, isFirstTime: false });
  },

  initPeer: () => {
    if (get().peer) return;

    const peer = new Peer();

    peer.on('open', (id) => {
      set({ myPeerId: id, error: null, statusMessage: 'En línea y listo' });
    });

    peer.on('connection', (conn) => {
      conn.on('open', () => {
        const myMovies = useMovieStore.getState().movies.filter((m) => m.owner === 'me');
        conn.send({
          type: 'HANDSHAKE',
          userName: get().userName,
          movies: myMovies,
        });
      });

      conn.on('data', (data: any) => {
        if (data && data.type === 'HANDSHAKE') {
          const newPeer: ConnectedPeer = {
            id: conn.peer,
            name: data.userName || 'Usuario Remoto',
            status: 'connected',
            connection: conn,
          };

          set((state) => ({
            connectedPeers: [
              ...state.connectedPeers.filter((p) => p.id !== conn.peer),
              newPeer,
            ],
            statusMessage: `Conectado con ${newPeer.name}`,
          }));

          if (Array.isArray(data.movies)) {
            useMovieStore.getState().mergePartnerMovies(conn.peer, data.movies);
          }
        }
      });

      conn.on('close', () => {
        set((state) => ({
          connectedPeers: state.connectedPeers.map((p) =>
            p.id === conn.peer ? { ...p, status: 'disconnected' } : p
          ),
          statusMessage: 'Par desconectado',
        }));
      });

      conn.on('error', (err) => {
        console.error('Error en conexión P2P:', err);
      });
    });

    peer.on('error', (err) => {
      console.error('Error en PeerJS:', err);
      set({ error: 'Error de conexión P2P.', statusMessage: 'Error de red P2P' });
    });

    set({ peer });
  },

  connectToPeer: (targetPeerId: string) => {
    const { peer, connectedPeers } = get();
    const cleanId = targetPeerId.trim();

    if (!peer || !cleanId) return;
    if (connectedPeers.some((p) => p.id === cleanId && p.status === 'connected')) return;

    set({ isConnecting: true, error: null, statusMessage: 'Conectando...' });

    const conn = peer.connect(cleanId);

    conn.on('open', () => {
      const myMovies = useMovieStore.getState().movies.filter((m) => m.owner === 'me');
      conn.send({
        type: 'HANDSHAKE',
        userName: get().userName,
        movies: myMovies,
      });

      set({ isConnecting: false });
    });

    conn.on('data', (data: any) => {
      if (data && data.type === 'HANDSHAKE') {
        const newPeer: ConnectedPeer = {
          id: conn.peer,
          name: data.userName || 'Usuario Remoto',
          status: 'connected',
          connection: conn,
        };

        set((state) => ({
          connectedPeers: [
            ...state.connectedPeers.filter((p) => p.id !== conn.peer),
            newPeer,
          ],
          statusMessage: `Conectado con ${newPeer.name}`,
        }));

        if (Array.isArray(data.movies)) {
          useMovieStore.getState().mergePartnerMovies(conn.peer, data.movies);
        }
      }
    });

    conn.on('close', () => {
      set((state) => ({
        connectedPeers: state.connectedPeers.map((p) =>
          p.id === conn.peer ? { ...p, status: 'disconnected' } : p
        ),
        statusMessage: 'Par desconectado',
      }));
    });

    conn.on('error', (err) => {
      console.error('Error al conectar con el par:', err);
      set({
        isConnecting: false,
        error: 'No se pudo conectar con el par especificado.',
        statusMessage: 'Error al conectar',
      });
    });
  },

  broadcastMovies: (moviesList?: Movie[]) => {
    const { connectedPeers, userName } = get();
    const myMovies = moviesList || useMovieStore.getState().movies.filter((m) => m.owner === 'me');

    connectedPeers.forEach((peer) => {
      if (peer.connection && peer.connection.open && peer.status === 'connected') {
        peer.connection.send({
          type: 'HANDSHAKE',
          userName,
          movies: myMovies,
        });
      }
    });
  },

  disconnectPeer: (peerId: string) => {
    const { connectedPeers } = get();
    const target = connectedPeers.find((p) => p.id === peerId);
    if (target) {
      target.connection.close();
    }
    set((state) => ({
      connectedPeers: state.connectedPeers.map((p) =>
        p.id === peerId ? { ...p, status: 'disconnected' } : p
      ),
      statusMessage: 'Par desconectado',
    }));
  },
}));