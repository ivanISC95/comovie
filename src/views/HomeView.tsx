// src/views/HomeView.tsx

import { useEffect } from 'react';
import { Container, Title, Text, Grid, Stack } from '@mantine/core';
import { useMovieStore } from '../store/useMovieStore';
import { usePeerStore } from '../store/usePeerStore';
import { StatCards } from '../components/dashboard/StatCards';
import { GenreChart } from '../components/dashboard/GenreChart';
import { MovieMatches } from '../components/dashboard/MovieMatches';

export function HomeView() {
  const { movies, fetchMovies } = useMovieStore();
  const { connectedPeers } = usePeerStore();

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const activePeersCount = connectedPeers.filter((p) => p.status === 'connected').length;

  return (
    <Container size="md" py="md">
      <Title order={2}>Dashboard & Resumen</Title>
      <Text c="dimmed" size="sm" mb="lg">
        Estadísticas generales de tu videoteca y sincronización con tu comunidad.
      </Text>

      <Stack gap="lg">
        {/* KPI Cards */}
        <StatCards movies={movies} connectedPeersCount={activePeersCount} />

        {/* Gráficas y Coincidencias */}
        <Grid grow>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <GenreChart movies={movies} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <MovieMatches movies={movies} />
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}