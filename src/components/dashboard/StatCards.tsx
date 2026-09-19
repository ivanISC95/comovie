// src/components/dashboard/StatCards.tsx

import { SimpleGrid, Paper, Text, Group, ThemeIcon } from '@mantine/core';
import { IconMovie, IconHeart,IconUsers } from '@tabler/icons-react';
import type { Movie } from '../../types/movie';

interface StatCardsProps {
  movies: Movie[];
  connectedPeersCount: number;
}

export function StatCards({ movies, connectedPeersCount }: StatCardsProps) {
  const myMovies = movies.filter((m) => m.owner === 'me');
  // const watchedCount = myMovies.filter((m:any) => m.watched).length;
  const favoriteCount = myMovies.filter((m:any) => (m.rating == 5)).length;
  console.log(movies)
  console.log(favoriteCount)

  const stats = [
    { title: 'Mis Películas', value: myMovies.length, icon: IconMovie, color: 'blue' },
    // { title: 'Vistas', value: watchedCount, icon: IconEye, color: 'teal' },
    { title: 'Favoritas', value: favoriteCount, icon: IconHeart, color: 'red' },
    { title: 'Coincidencias', value: connectedPeersCount, icon: IconUsers, color: 'violet' },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
      {stats.map((stat) => (
        <Paper key={stat.title} p="md" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                {stat.title}
              </Text>

              <Text fw={700} size="xl" mt="xs">
                {stat.value}
              </Text>
            </div>

            <ThemeIcon color={stat.color} variant="light" size={42} radius="md">
              <stat.icon size={24} />
            </ThemeIcon>
          </Group>
        </Paper>
      ))}
    </SimpleGrid>
  );
}