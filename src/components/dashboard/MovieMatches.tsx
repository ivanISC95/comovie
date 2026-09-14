// src/components/dashboard/MovieMatches.tsx

import { Paper, Title, Text, Stack, Group, Badge, Avatar } from '@mantine/core';
import { IconFlame } from '@tabler/icons-react';
import type { Movie } from '../../types/movie';

interface MovieMatchesProps {
  movies: Movie[];
}

export function MovieMatches({ movies }: MovieMatchesProps) {
  // Identificar películas compartidas por más de un usuario
  const titleMap: Record<string, Movie[]> = {};

  movies.forEach((movie) => {
    const key = movie.title.toLowerCase().trim();
    if (!titleMap[key]) titleMap[key] = [];
    titleMap[key].push(movie);
  });

  const matches = Object.values(titleMap).filter((list) => list.length > 1);

  return (
    <Paper p="md" radius="md" withBorder h="100%">
      <Group justify="space-between" mb="md">
        <Title order={4}>Coincidencias (CoMovie Matches)</Title>
        <Badge color="red" leftSection={<IconFlame size={12} />} variant="light">
          {matches.length} Matches
        </Badge>
      </Group>

      {matches.length === 0 ? (
        <Text size="sm" c="dimmed">
          Conéctate con un par o importa su lista para descubrir qué películas tienen en común.
        </Text>
      ) : (
        <Stack gap="sm">
          {matches.map((group) => {
            const baseMovie = group[0];

            return (
              <Paper key={baseMovie.title} p="xs" withBorder radius="sm">
                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={600}>
                      {baseMovie.title}
                    </Text>

                    <Text size="xs" c="dimmed">
                      {baseMovie.genre} • {baseMovie.rating}★
                    </Text>
                  </div>

                  <Group gap={4}>
                    {group.map((m) => (
                      <Avatar
                        key={m.id}
                        size="sm"
                        radius="xl"
                        color={m.owner === 'me' ? 'blue' : 'green'}
                      >
                        {m.owner === 'me' ? 'TÚ' : 'PAR'}
                      </Avatar>
                    ))}
                  </Group>
                </Group>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}