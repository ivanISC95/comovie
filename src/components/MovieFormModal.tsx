// src/components/MovieFormModal.tsx

import { useEffect } from 'react';
import {
  Modal,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  Button,
  Group,
  Checkbox,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMovieStore } from '../store/useMovieStore';
import type { Movie, Genre } from '../types/movie';

const GENRES: Genre[] = [
  'Acción',
  'Comedia',
  'Drama',
  'Terror',
  'Ciencia Ficción',
  'Romance',
  'Animación',
  'Documental',
  'Thriller',
  'Otro',
];

interface MovieFormModalProps {
  opened: boolean;
  onClose: () => void;
  movieToEdit?: Movie | null;
}

export function MovieFormModal({ opened, onClose, movieToEdit }: MovieFormModalProps) {
  const { addMovie, updateMovie } = useMovieStore();

  const form = useForm({
    initialValues: {
      title: '',
      genre: 'Acción' as Genre,
      rating: 3,
      watched: false,
      imageUrl: '',
      year: new Date().getFullYear(),
      comment: '',
    },
    validate: {
      title: (value) => (value.trim().length === 0 ? 'El título es obligatorio' : null),
      genre: (value) => (!value ? 'Selecciona un género' : null),
    },
  });

  // Cargar datos al editar
  useEffect(() => {
    if (movieToEdit) {
      form.setValues({
        title: movieToEdit.title,
        genre: movieToEdit.genre,
        rating: movieToEdit.rating || 3,
        watched: movieToEdit.watched,
        imageUrl: movieToEdit.imageUrl || '',
        year: movieToEdit.year || new Date().getFullYear(),
        comment: movieToEdit.comment || '',
      });
    } else {
      form.reset();
    }
  }, [movieToEdit, opened]);

  // Reemplaza el bloque handleSubmit dentro de MovieFormModal.tsx

  const handleSubmit = (values: typeof form.values) => {
    if (movieToEdit) {
      updateMovie(movieToEdit.id, {
        title: values.title,
        genre: values.genre,
        rating: values.rating,
        watched: values.watched,
        imageUrl: values.imageUrl,
        year: values.year,
        comment: values.comment,
      });
    } else {
      // Se elimina la propiedad 'owner' ya que el store la asigna automáticamente
      addMovie({
        title: values.title,
        genre: values.genre,
        rating: values.rating,
        watched: values.watched,
        imageUrl: values.imageUrl,
        year: values.year,
        comment: values.comment,
      });
    }

    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={movieToEdit ? 'Editar Película' : 'Agregar Película'}
      centered
      radius="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Título"
            placeholder="Ej: Inception"
            required
            {...form.getInputProps('title')}
          />

          <Select
            label="Género"
            data={GENRES}
            required
            {...form.getInputProps('genre')}
          />

          <Group grow>
            <NumberInput
              label="Año"
              placeholder="2024"
              min={1888}
              max={2100}
              {...form.getInputProps('year')}
            />

            <NumberInput
              label="Calificación (1-5)"
              min={0}
              max={5}
              step={0.5}
              {...form.getInputProps('rating')}
            />
          </Group>

          <TextInput
            label="URL del Poster / Imagen"
            placeholder="https://..."
            {...form.getInputProps('imageUrl')}
          />

          <Textarea
            label="Comentario / Reseña"
            placeholder="¿Qué te pareció?"
            rows={2}
            {...form.getInputProps('comment')}
          />

          <Checkbox
            mt="xs"
            label="¿Ya la viste?"
            checked={form.values.watched}
            {...form.getInputProps('watched', { type: 'checkbox' })}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" color="blue">
              {movieToEdit ? 'Guardar Cambios' : 'Agregar'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}