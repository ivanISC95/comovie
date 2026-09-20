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
  const { movies, addMovie, updateMovie } = useMovieStore();
  // Helper para normalizar el título (elimina acentos, minúsculas y espacios extra)
  const normalizeString = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const capitalizeFirstLetter = (text: string): string => {
    if (!text) return '';
    const trimmed = text.trimStart(); // Mantiene espacios intermedios pero quita los iniciales
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }

  const form = useForm({
    initialValues: {
      title: '',
      genre: 'Acción' as Genre,
      rating: 3,
      watched: true,
      imageUrl: '',
      year: new Date().getFullYear(),
      comment: '',
    },
    validate: {
      // title: (value) => (value.trim().length === 0 ? 'El título es obligatorio' : null),
      title: (value, values) => {
        if (!value.trim()) {
          return 'El título es obligatorio';
        }

        // Normalizamos el título actual ingresado por el usuario
        const cleanTitle = normalizeString(value);
        const selectedYear = values.year;

        // Comprobar si ya existe una película con el mismo TÍTULO y AÑO
        const isDuplicate = movies.some((m) => {
          // Si estamos editando, omitimos la misma película de la comprobación
          if (movieToEdit && m.id === movieToEdit.id) return false;

          const sameTitle = normalizeString(m.title) === cleanTitle;
          const sameYear = Number(m.year) === Number(selectedYear);
          const isMyMovie = m.owner === 'me';

          return isMyMovie && sameTitle && sameYear;
        });

        if (isDuplicate) {
          return `Ya tienes registrada "${capitalizeFirstLetter(value.trim())}" (${selectedYear}) en tu lista`;
        }

        return null;
      },
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
    const formattedTitle = capitalizeFirstLetter(values.title.trim());
    if (movieToEdit) {
      updateMovie(movieToEdit.id, {
        title: formattedTitle,
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
        title: formattedTitle,
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
      closeOnClickOutside={false}
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
            style={{ display: 'none' }}
          />

          <Textarea
            label="Comentario / Reseña"
            placeholder="¿Qué te pareció?"
            rows={2}
            {...form.getInputProps('comment')}
            style={{ display: 'none' }}
          />

          <Checkbox
            mt="xs"
            label="¿Ya la viste?"
            checked={form.values.watched}
            {...form.getInputProps('watched', { type: 'checkbox' })}
            style={{ display: 'none' }}
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