// src/components/WelcomeModal.tsx

import { useState } from 'react';
import { Modal, TextInput, Button, Stack, Text, Title, Group, ThemeIcon } from '@mantine/core';
import { IconUser, IconMovie } from '@tabler/icons-react';
import { usePeerStore } from '../store/usePeerStore';

export function WelcomeModal() {
  const { isFirstTime, completeInitialSetup } = usePeerStore();
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = nameInput.trim();
    if (!trimmed) {
      setError('Por favor ingresa un nombre o apodo para continuar');
      return;
    }

    if (trimmed.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    completeInitialSetup(trimmed);
  };

  return (
    <Modal
      opened={isFirstTime}
      onClose={() => {}} // Bloqueado para impedir que se cierre sin ingresar nombre
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      centered
      size="md"
      radius="lg"
      padding="xl"
    >
      <form onSubmit={handleSubmit}>
        <Stack align="center" gap="sm">
          <ThemeIcon size={56} radius="xl" color="blue" variant="light">
            <IconMovie size={32} />
          </ThemeIcon>

          <Title order={2} ta="center">
            ¡Bienvenido a CoMovie! 🎬
          </Title>

          <Text size="sm" c="dimmed" ta="center">
            Para interactuar y sincronizar tus películas con amigos vía P2P, ingresa tu nombre de usuario o apodo.
          </Text>

          <TextInput
            w="100%"
            mt="md"
            label="Nombre de usuario"
            placeholder="Ej: Pepe Iván"
            leftSection={<IconUser size={18} />}
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.currentTarget.value);
              if (error) setError('');
            }}
            error={error}
            autoFocus
          />

          <Group justify="flex-end" w="100%" mt="lg">
            <Button fullWidth type="submit" color="blue" size="md" radius="md">
              Comenzar a usar CinePals
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}