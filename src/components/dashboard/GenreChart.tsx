// src/components/dashboard/GenreChart.tsx

import { Paper, Title, Progress, Text, Stack, Group } from '@mantine/core';
import type { Movie } from '../../types/movie';

interface GenreChartProps {
  movies: Movie[];
}

export function GenreChart({ movies }: GenreChartProps) {
  const genreCounts: Record<string, number> = {};

  movies.forEach((movie) => {
    if (movie.genre) {
      genreCounts[movie.genre] = (genreCounts[movie.genre] || 0) + 1;
    }
  });

  const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxCount = sortedGenres[0]?.[1] || 1;

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
            const percentage = Math.round((count / maxCount) * 100);

            return (
              <div key={genre}>
                <Group justify="space-between" mb={4}>
                  <Text size="sm" fw={500}>
                    {genre}
                  </Text>

                  <Text size="xs" c="dimmed">
                    {count} película(s)
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