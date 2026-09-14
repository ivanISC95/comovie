// src/views/MyListView.tsx

import { useState } from 'react';
import {
  Container, Title, Group, TextInput, Select, SimpleGrid,
  SegmentedControl, Text, Stack, Paper, Button
} from '@mantine/core';
import { IconSearch, IconLayoutGrid, IconList, IconPlus, IconMovie } from '@tabler/icons-react';
import { useMovieStore } from '../store/useMovieStore';
import type { Genre, Movie } from '../types/movie';
import { MovieCard } from '../components/MovieCard';
import { MovieTable } from '../components/MovieTable';
import { MovieFormModal } from '../components/MovieFormModal';

export function MyListView() {
  const {
    movies,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    setIsAddModalOpen,
    isAddModalOpen
  } = useMovieStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);

  // Filtrado y ordenamiento seguro de películas
  const filteredMovies = movies
    .filter((m) => {
      const safeTitle = (m.title || '').toLowerCase();
      const safeQuery = (searchQuery || '').toLowerCase();
      const matchesSearch = safeTitle.includes(safeQuery);

      const matchesGenre = selectedGenre === 'all' || m.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'title-asc') return (a.title || '').localeCompare(b.title || '');
      // 'date-desc' usando `createdAt` (o Date.now() de respaldo)
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

  return (
    <Container size="lg" py="md">
      {/* Encabezado */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Mis Películas</Title>
          <Text c="dimmed" size="sm">
            {movies.length} {movies.length === 1 ? 'película registrada' : 'películas registradas'}
          </Text>
        </div>

        <Button
          leftSection={<IconPlus size={18} />}
          onClick={() => setIsAddModalOpen(true)}
          color="blue"
        >
          Agregar Película
        </Button>
      </Group>

      {/* Controles y Filtros */}
      <Paper p="md" radius="md" withBorder mb="lg">
        <Group justify="space-between" align="center" gap="md">
          <Group gap="sm" style={{ flex: 1 }}>
            <TextInput
              placeholder="Buscar película..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, minWidth: 200 }}
            />

            <Select
              placeholder="Género"
              value={selectedGenre || 'all'}
              onChange={(val) => setSelectedGenre((val as Genre | 'all') || 'all')}
              data={[
                { value: 'all', label: 'Todos los géneros' },
                { value: 'Acción', label: 'Acción' },
                { value: 'Comedia', label: 'Comedia' },
                { value: 'Drama', label: 'Drama' },
                { value: 'Terror', label: 'Terror' },
                { value: 'Ciencia Ficción', label: 'Ciencia Ficción' },
                { value: 'Romance', label: 'Romance' },
                { value: 'Animación', label: 'Animación' },
                { value: 'Documental', label: 'Documental' },
                { value: 'Thriller', label: 'Thriller' },
                { value: 'Otro', label: 'Otro' },
              ]}
              style={{ width: 180 }}
            />

            <Select
              placeholder="Ordenar por"
              value={sortBy}
              onChange={(val) => setSortBy(val || 'date-desc')}
              data={[
                { value: 'date-desc', label: 'Más recientes' },
                { value: 'rating-desc', label: 'Mejor calificadas' },
                { value: 'title-asc', label: 'Título (A-Z)' },
              ]}
              style={{ width: 170 }}
            />
          </Group>

          <SegmentedControl
            value={viewMode}
            onChange={(val) => setViewMode(val as 'grid' | 'list')}
            data={[
              { value: 'grid', label: <IconLayoutGrid size={16} /> },
              { value: 'list', label: <IconList size={16} /> },
            ]}
          />
        </Group>
      </Paper>

      {/* Listado de Películas o Estado Vacío */}
      {filteredMovies.length === 0 ? (
        <Paper p="xl" radius="md" withBorder style={{ backgroundColor: 'transparent' }}>
          <Stack align="center" gap="xs">
            <IconMovie size={48} color="var(--mantine-color-gray-5)" />
            <Text fw={500}>No se encontraron películas</Text>
            <Text size="sm" c="dimmed">
              Prueba cambiando los filtros o agrega una nueva película a tu lista.
            </Text>
          </Stack>
        </Paper>
      ) : viewMode === 'grid' ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onEdit={(m) => setMovieToEdit(m)}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Paper radius="md" withBorder style={{ overflow: 'hidden' }}>
          <MovieTable
            movies={filteredMovies}
            onEdit={(m) => setMovieToEdit(m)}
          />
        </Paper>
      )}

      <MovieFormModal
        opened={isAddModalOpen || !!movieToEdit}
        onClose={() => {
          setIsAddModalOpen(false);
          setMovieToEdit(null);
        }}
        movieToEdit={movieToEdit}
      />
    </Container>
  );
}