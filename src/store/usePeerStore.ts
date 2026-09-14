// src/store/usePeerStore.ts

import { create } from 'zustand';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';
import { useMovieStore } from './useMovieStore';
import type { PeerUser, PeerSyncPayload } from '../types/movie';

interface PeerState {
  peer: Peer | null;
  myPeerId: string;
  userName: string;
  connectedPeers: PeerUser[];
  activeConnections: Map<string, DataConnection>;
  isConnecting: boolean;
  statusMessage: string | null;

  // Acciones
  setUserName: (name: string) => void;
  initPeer: () => void;
  connectToPeer: (remotePeerId: string) => void;
  syncMoviesWithPeer: (conn: DataConnection) => void;
  broadcastMovies: () => void;
  disconnectPeer: (peerId: string) => void;
}

// Helper privado para configurar los eventos de cada conexión WebRTC
const setupConnectionListeners = (
  conn: DataConnection,
  get: () => PeerState,
  set: (fn: (state: PeerState) => Partial<PeerState>) => void
) => {
  conn.on('open', () => {
    const { activeConnections, syncMoviesWithPeer } = get();
    activeConnections.set(conn.peer, conn);

    const partnerName = conn.metadata?.name || 'Amigo CoMovie';

    set((state) => ({
      activeConnections: new Map(activeConnections),
      connectedPeers: [
        ...state.connectedPeers.filter((p) => p.id !== conn.peer),
        {
          id: conn.peer,
          name: partnerName,
          status: 'connected',
          lastSyncedAt: Date.now(),
        },
      ],
      statusMessage: `Conectado con ${partnerName}`,
      isConnecting: false,
    }));

    // Sincronizar películas al abrir canal
    syncMoviesWithPeer(conn);
  });

  // Listener para recepción de datos
  conn.on('data', async (data: unknown) => {
    const payload = data as PeerSyncPayload;
    if (payload && payload.type === 'SYNC_MOVIES_RESPONSE') {
      const { mergePartnerMovies } = useMovieStore.getState();

      await mergePartnerMovies(payload.senderId, payload.movies);

      set((state) => ({
        connectedPeers: state.connectedPeers.map((p) =>
          p.id === payload.senderId
            ? { ...p, name: payload.senderName || p.name, lastSyncedAt: Date.now() }
            : p
        ),
        statusMessage: `Sincronizadas ${payload.movies.length} películas de ${payload.senderName || 'tu par'}`,
      }));
    }
  });

  conn.on('close', () => {
    const newConnections = new Map(get().activeConnections);
    newConnections.delete(conn.peer);

    set((state) => ({
      activeConnections: newConnections,
      connectedPeers: state.connectedPeers.map((p) =>
        p.id === conn.peer ? { ...p, status: 'disconnected' } : p
      ),
      statusMessage: 'Conexión cerrada',
    }));
  });
};

export const usePeerStore = create<PeerState>((set, get) => ({
  peer: null,
  myPeerId: '',
  userName: 'Miembro CoMovie',
  connectedPeers: [],
  activeConnections: new Map(),
  isConnecting: false,
  statusMessage: null,

  setUserName: (name: string) => set({ userName: name }),

  initPeer: () => {
    const currentPeer = get().peer;

    // Si ya existe una instancia activa y conectada, no creamos otra
    if (currentPeer && !currentPeer.destroyed && get().myPeerId) {
      return;
    }

    // Si había una previa destruida o fallida, la limpiamos primero
    if (currentPeer && !currentPeer.destroyed) {
      currentPeer.destroy();
    }

    try {
      // Instancia de PeerJS
      const peer = new Peer({
        debug: 1, // Muestra errores importantes en consola
      });

      peer.on('open', (id) => {
        set(() => ({ myPeerId: id, peer, statusMessage: 'Peer ID listo' }));
      });

      peer.on('connection', (conn) => {
        setupConnectionListeners(conn, get, set);
      });

      peer.on('error', (err) => {
        console.error('PeerJS Error:', err);
        set(() => ({ 
          statusMessage: `Error P2P (${err.type}): Intenta recargar la página.`, 
          isConnecting: false 
        }));
      });

      peer.on('disconnected', () => {
        // Intenta reconectarse automáticamente al servidor de señalización
        if (!peer.destroyed) {
          peer.reconnect();
        }
      });
    } catch (e) {
      console.error('Error al inicializar PeerJS:', e);
    }
  },

  connectToPeer: (remotePeerId: string) => {
    const { peer, activeConnections, myPeerId, userName } = get();
    const cleanId = remotePeerId.trim();

    if (!peer || !cleanId) return;
    if (cleanId === myPeerId) {
      set(() => ({ statusMessage: 'No puedes conectarte a tu propio Peer ID' }));
      return;
    }
    if (activeConnections.has(cleanId)) {
      set(() => ({ statusMessage: 'Ya estás conectado con este par' }));
      return;
    }

    set(() => ({ isConnecting: true, statusMessage: 'Conectando...' }));

    const conn = peer.connect(cleanId, {
      metadata: { name: userName || 'Amigo CoMovie' },
    });

    setupConnectionListeners(conn, get, set);
  },

  syncMoviesWithPeer: (conn: DataConnection) => {
    const { movies } = useMovieStore.getState();
    const { myPeerId, userName } = get();
    const myMoviesOnly = movies.filter((m) => m.owner === 'me');

    const payload: PeerSyncPayload = {
      type: 'SYNC_MOVIES_RESPONSE',
      senderId: myPeerId,
      senderName: userName || 'Amigo CoMovie',
      movies: myMoviesOnly,
    };

    if (conn.open) {
      conn.send(payload);
    }
  },

  broadcastMovies: () => {
    const { activeConnections, syncMoviesWithPeer } = get();
    activeConnections.forEach((conn) => {
      syncMoviesWithPeer(conn);
    });
  },

  disconnectPeer: (peerId: string) => {
    const conn = get().activeConnections.get(peerId);
    if (conn) {
      conn.close();
    }
  },
}));