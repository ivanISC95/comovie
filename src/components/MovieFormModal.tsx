// src/components/MovieFormModal.tsx

import { useEffect } from 'react';
import {
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  Button,
  Group,
  Checkbox,
  Stack,
  MultiSelect,
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
  'Superhéroes',
  'Otro',
];

interface MovieFormModalProps {
  opened: boolean;
  onClose: () => void;
  movieToEdit?: Movie | null;
}

export function MovieFormModal({ opened, onClose, movieToEdit }: MovieFormModalProps) {
  const { movies, addMovie, updateMovie } = useMovieStore();

  const normalizeString = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const capitalizeFirstLetter = (text: string): string => {
    if (!text) return '';
    const trimmed = text.trimStart();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  };

  const form = useForm({
    initialValues: {
      title: '',
      genre: [] as Genre[],
      rating: 3,
      watched: true,
      imageUrl: '',
      year: new Date().getFullYear(),
      comment: '',
    },
    validate: {
      title: (value, values) => {
        if (!value.trim()) {
          return 'El título es obligatorio';
        }

        const cleanTitle = normalizeString(value);
        const selectedYear = values.year;

        const isDuplicate = movies.some((m) => {
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
      genre: (value) => (!value || value.length === 0 ? 'Selecciona al menos un género' : null),
    },
  });

  // Cargar datos al editar o resetear al abrir
  useEffect(() => {
    if (movieToEdit) {
      // 3. Garantizar que genre sea un arreglo incluso si viene como string desde la BD antigua
      const formattedGenres: Genre[] = Array.isArray(movieToEdit.genre)
        ? (movieToEdit.genre as Genre[])
        : [movieToEdit.genre as Genre];

      form.setValues({
        title: movieToEdit.title,
        genre: formattedGenres,
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

  const inputStyle = { input: { fontSize: '16px' } };

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
            styles={inputStyle}
            value={form.values.title}
            onChange={(e) => {
              const formatted = capitalizeFirstLetter(e.currentTarget.value);
              form.setFieldValue('title', formatted);
            }}
            error={form.errors.title}
          />

          <MultiSelect
            label="Géneros"
            placeholder="Selecciona uno o más géneros"
            data={GENRES}
            required
            searchable
            clearable
            maxDropdownHeight={200} // Limita la altura de la lista desplegable a 200px
            comboboxProps={{
              shadow: 'md',
              withinPortal: true, // Mantiene el menú sobre el modal sin recortarlo
            }}
            styles={inputStyle}
            {...form.getInputProps('genre')}
          />

          <Group grow>
            <NumberInput
              label="Año"
              placeholder="2024"
              min={1888}
              max={2100}
              styles={inputStyle}
              {...form.getInputProps('year')}
            />

            <NumberInput
              label="Calificación (1-5)"
              min={0}
              max={5}
              step={0.5}
              styles={inputStyle}
              {...form.getInputProps('rating')}
            />
          </Group>

          <TextInput
            label="URL del Poster / Imagen"
            placeholder="https://..."
            styles={inputStyle}
            {...form.getInputProps('imageUrl')}
            style={{ display: 'none' }}
          />

          <Textarea
            label="Comentario / Reseña"
            placeholder="¿Qué te pareció?"
            rows={2}
            styles={inputStyle}
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