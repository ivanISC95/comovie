// src/components/dashboard/GenreChart.tsx

import { Paper, Title, Progress, Text, Stack, Group } from '@mantine/core';
import type { Movie } from '../../types/movie';

interface GenreChartProps {
  movies: Movie[];
}

export function GenreChart({ movies }: GenreChartProps) {
  const genreCounts: Record<string, number> = {};
  let totalGenreTags = 0;

  // 1. Recorrer las películas y contar la presencia de cada género
  movies.forEach((movie) => {
    if (movie.genre) {
      // Compatibilidad: asegura iterar ya sea un arreglo o un string legacy
      const genres = Array.isArray(movie.genre) ? movie.genre : [movie.genre];

      genres.forEach((g) => {
        if (g) {
          genreCounts[g] = (genreCounts[g] || 0) + 1;
          totalGenreTags += 1; // Contador global de géneros asignados
        }
      });
    }
  });

  // 2. Ordenar los géneros por cantidad y tomar el Top 5
  const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <Paper p="md" radius="md" withBorder h="100%">
      <Title order={4} mb="md">
        Top Géneros en el Catálogo
      </Title>

      {sortedGenres.length === 0 ? (
        <Text size="sm" c="dimmed">
          No hay películas agregadas aún.
        </Text>
      ) : (
        <Stack gap="sm">
          {sortedGenres.map(([genre, count]) => {
            // Porcentaje representativo del género sobre el total de apariciones de géneros
            const percentage = totalGenreTags > 0 ? Math.round((count / totalGenreTags) * 100) : 0;

            return (
              <div key={genre}>
                <Group justify="space-between" mb={4}>
                  <Text size="sm" fw={500}>
                    {genre}
                  </Text>

                  <Text size="xs" c="dimmed">
                    {count} {count === 1 ? 'película' : 'películas'} ({percentage}%)
                  </Text>
                </Group>

                <Progress value={percentage} color="indigo" size="sm" radius="xl" />
              </div>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}