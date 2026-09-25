// src/components/MovieTable.tsx

import { Table, Badge, Rating, Group, ActionIcon, Menu, Text, Avatar } from '@mantine/core';
import { IconDotsVertical, IconPencil, IconTrash, IconCheck, IconX, IconUser } from '@tabler/icons-react';
import { useMovieStore } from '../store/useMovieStore';
import { usePeerStore } from '../store/usePeerStore';
import type { Movie } from '../types/movie';

interface MovieTableProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
}

export function MovieTable({ movies, onEdit }: MovieTableProps) {
  const { toggleWatched, deleteMovie } = useMovieStore();
  const { connectedPeers } = usePeerStore();

  return (
    <Table.ScrollContainer minWidth={650}>
      <Table highlightOnHover verticalSpacing="sm" stickyHeader stickyHeaderOffset={0}>
        <Table.Thead style={{ zIndex: 1, backgroundColor: 'var(--mantine-color-body)' }}>
          <Table.Tr>
            <Table.Th>Película</Table.Th>
            <Table.Th>Género</Table.Th>
            <Table.Th>Año</Table.Th>
            <Table.Th>Calificación</Table.Th>
            <Table.Th>Propietario</Table.Th>
            {/* <Table.Th>Estado</Table.Th> */}
            <Table.Th style={{ width: 80, textAlign: 'center' }}>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {movies.map((movie) => {
            const isMyMovie = movie.owner === 'me';
            const partnerPeer = !isMyMovie && movie.partnerId
              ? connectedPeers.find((p) => p.id === movie.partnerId)
              : null;

            const ownerLabel = isMyMovie ? 'Mía' : partnerPeer?.name || 'Amigo';

            return (
              <Table.Tr key={movie.id}>
                {/* Título e Imagen */}
                <Table.Td>
                  <Group gap="sm" wrap="nowrap">
                    {movie.imageUrl && (
                      <Avatar src={movie.imageUrl} radius="sm" size="md" alt={movie.title} />
                    )}
                    <div>
                      <Text fw={500} size="sm">
                        {movie.title}
                      </Text>
                      {movie.comment && (
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {movie.comment}
                        </Text>
                      )}
                    </div>
                  </Group>
                </Table.Td>

                {/* Género */}
                {/* <Table.Td>
                  <Badge size="sm" variant="light" color="gray">
                    {movie.genre}
                  </Badge>
                </Table.Td> */}
                <Table.Td>
                  {(Array.isArray(movie.genre) ? movie.genre : [movie.genre]).map((name, index) => (
                    <Badge key={`${name}-${index}`} size="sm" variant="light" color="gray">
                      {name}
                    </Badge>
                  ))}
                </Table.Td>

                {/* Año */}
                <Table.Td>
                  <Text size="sm">{movie.year || '-'}</Text>
                </Table.Td>

                {/* Calificación */}
                <Table.Td>
                  <Rating value={movie.rating || 0} readOnly fractions={2} size="xs" />
                </Table.Td>

                {/* Propietario */}
                <Table.Td>
                  <Badge
                    size="sm"
                    color={isMyMovie ? 'blue' : 'violet'}
                    variant="filled"
                    leftSection={!isMyMovie ? <IconUser size={10} /> : undefined}
                  >
                    {ownerLabel}
                  </Badge>
                </Table.Td>

                {/* Estado (Vista / Pendiente) */}
                <Table.Td style={{ display: 'none' }}>
                  <Badge
                    size="sm"
                    color={movie.watched ? 'green' : 'gray'}
                    variant="light"
                  >
                    {movie.watched ? 'Vista' : 'Pendiente'}
                  </Badge>
                </Table.Td>

                {/* Acciones */}
                <Table.Td style={{ textAlign: 'center' }}>
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
                        style={{ display: 'none' }}
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
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}