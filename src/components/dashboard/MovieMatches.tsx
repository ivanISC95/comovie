// src/components/dashboard/MovieMatches.tsx

import { Paper, Title, Text, Stack, Group, Badge, Avatar } from '@mantine/core';
import { IconFlame } from '@tabler/icons-react';
import type { Movie } from '../../types/movie';

interface MovieMatchesProps {
  movies: Movie[];
}

// Normalización básica de títulos
const normalizeTitle = (title: string) =>
  title
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export function MovieMatches({ movies }: MovieMatchesProps) {
  // 1. Agrupar por Título + Año
  const matchMap: Record<string, Movie[]> = {};

  movies.forEach((movie) => {
    const cleanTitle = normalizeTitle(movie.title);
    const year = movie.year || 'unknown';
    // Clave compuesta: ej. "dumbo-1941" vs "dumbo-2019"
    const key = `${cleanTitle}-${year}`;

    if (!matchMap[key]) matchMap[key] = [];
    matchMap[key].push(movie);
  });

  // 2. Filtrar grupos que pertenezcan a DISTINTOS propietarios (mía vs amigo)
  const matches = Object.values(matchMap).filter((group) => {
    const hasMyMovie = group.some((m) => m.owner === 'me');
    const hasPartnerMovie = group.some((m) => m.owner === 'partner');

    return hasMyMovie && hasPartnerMovie;
  });

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
              <Paper key={`${baseMovie.title}-${baseMovie.year}`} p="xs" withBorder radius="sm">
                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={600}>
                      {baseMovie.title} ({baseMovie.year})
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
                        color={m.owner === 'me' ? 'blue' : 'violet'}
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