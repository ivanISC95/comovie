// src/components/MovieCard.tsx

import { Card, Image, Text, Badge, Group, Rating, ActionIcon, Menu, Stack } from '@mantine/core';
import { IconDotsVertical, IconPencil, IconTrash, IconCheck, IconX, IconUser } from '@tabler/icons-react';
import { useMovieStore } from '../store/useMovieStore';
import { usePeerStore } from '../store/usePeerStore';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onEdit: (movie: Movie) => void;
}

export function MovieCard({ movie, onEdit }: MovieCardProps) {
  const { toggleWatched, deleteMovie } = useMovieStore();
  const { connectedPeers } = usePeerStore();

  const isMyMovie = movie.owner === 'me';

  // Buscar el nombre del par/amigo en la lista de peers conectados
  const partnerPeer = !isMyMovie && movie.partnerId
    ? connectedPeers.find((p) => p.id === movie.partnerId)
    : null;

  // Si existe el par conectado usa su nombre, si no, usa el guardado o "Amigo" de respaldo
  const ownerLabel = isMyMovie
    ? 'Mía'
    : partnerPeer?.name || 'Amigo';

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Card.Section pos="relative">
        <Image
          src={movie.imageUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop'}
          height={200}
          alt={movie.title}
          fallbackSrc="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop"
        />
        
        {/* Etiqueta con el nombre/apodo o "Mía" */}
        <Badge
          pos="absolute"
          top={10}
          left={10}
          color={isMyMovie ? 'blue' : 'violet'}
          variant="filled"
          leftSection={!isMyMovie ? <IconUser size={12} /> : undefined}
        >
          {ownerLabel}
        </Badge>

        <Badge
          pos="absolute"
          top={10}
          right={10}
          color={movie.watched ? 'green' : 'gray'}
          variant="light"
        >
          {movie.watched ? 'Vista' : 'Pendiente'}
        </Badge>
      </Card.Section>

      <Stack justify="space-between" mt="md" style={{ flex: 1 }}>
        <div>
          <Group justify="space-between" align="flex-start" mb="xs">
            <Text fw={600} size="lg" style={{ lineHeight: 1.2 }}>
              {movie.title}
            </Text>

            {/* Menú de acciones (sólo editable si la película es mía) */}
            <Menu shadow="md" width={160} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray" size="sm">
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={movie.watched ? <IconX size={14} /> : <IconCheck size={14} />}
                  onClick={() => toggleWatched(movie.id)}
                >
                  {movie.watched ? 'Marcar pendiente' : 'Marcar como vista'}
                </Menu.Item>
                
                {isMyMovie && (
                  <>
                    <Menu.Item
                      leftSection={<IconPencil size={14} />}
                      onClick={() => onEdit(movie)}
                    >
                      Editar
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={<IconTrash size={14} />}
                      onClick={() => deleteMovie(movie.id)}
                    >
                      Eliminar
                    </Menu.Item>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>

          <Group gap="xs" mb="sm">
            <Badge size="sm" variant="outline" color="gray">
              {movie.genre}
            </Badge>
            {movie.year && (
              <Text size="xs" c="dimmed">
                ({movie.year})
              </Text>
            )}
          </Group>

          {movie.comment && (
            <Text size="sm" c="dimmed" lineClamp={2} mb="xs">
              "{movie.comment}"
            </Text>
          )}
        </div>

        <Group justify="space-between" align="center" pt="xs" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
          <Rating value={movie.rating || 0} readOnly fractions={2} size="sm" />
        </Group>
      </Stack>
    </Card>
  );
}