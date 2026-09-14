// src/components/MainLayout.tsx

import { useState } from 'react';
import type { ReactNode } from 'react';
import { 
  AppShell, 
  Group, 
  Title, 
  UnstyledButton, 
  Text, 
  ActionIcon, 
  Avatar, 
  Badge, 
  Box,
  Modal,
  TextInput,
  Button,
  Stack,
  Tooltip
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { 
  IconLayoutDashboard, 
  IconBookmark, 
  IconPlus, 
  IconUsers,
  IconPencil
} from '@tabler/icons-react';

import { useMovieStore } from '../store/useMovieStore';
import { usePeerStore } from '../store/usePeerStore';
import type { ActiveTab } from '../store/useMovieStore';

export function MainLayout({ children }: { children: ReactNode }) {
  const isDesktop = useMediaQuery('(min-width: 48em)');
  const { activeTab, setActiveTab, setIsAddModalOpen } = useMovieStore();
  const { userName, setUserName } = usePeerStore();

  // Estado para el modal de editar nombre de usuario
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [tempName, setTempName] = useState(userName);

  // Generar iniciales a partir del nombre (ej: "José Iván" -> "JI")
  const initials = userName
    ? userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'CP';

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setIsNameModalOpen(false);
    }
  };

  const navItems: { id: ActiveTab; label: string; icon: typeof IconLayoutDashboard }[] = [
    { id: 'home', label: 'Home', icon: IconLayoutDashboard },
    { id: 'my-list', label: 'My List', icon: IconBookmark },
    { id: 'community', label: 'Community', icon: IconUsers },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={isDesktop ? { width: 220, breakpoint: 'sm' } : undefined}
      footer={!isDesktop ? { height: 65 } : undefined}
      padding="md"
    >
      {/* Header Superior */}
      <AppShell.Header p="md">
        <Group justify="space-between" h="100%">
          <Group gap="xs">
            <Title order={3} style={{ fontFamily: 'Inter, sans-serif' }}>
              CinePals
            </Title>
            <Badge variant="light" color="blue" size="sm">
              Beta
            </Badge>
          </Group>

          {/* Botón de Perfil de Usuario */}
          <Tooltip label="Cambiar nombre de usuario">
            <UnstyledButton
              onClick={() => {
                setTempName(userName);
                setIsNameModalOpen(true);
              }}
              style={{ borderRadius: '20px', padding: '4px 8px' }}
            >
              <Group gap="xs">
                <Text size="sm" fw={500} visibleFrom="xs">
                  {userName}
                </Text>
                <Avatar radius="xl" color="blue" size="sm">
                  {initials}
                </Avatar>
              </Group>
            </UnstyledButton>
          </Tooltip>
        </Group>
      </AppShell.Header>

      {/* Menú Lateral en Escritorio */}
      {isDesktop && (
        <AppShell.Navbar p="md">
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <UnstyledButton
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  p="xs"
                  style={{
                    borderRadius: 8,
                    backgroundColor: isActive ? 'var(--mantine-color-blue-light)' : 'transparent',
                    color: isActive ? 'var(--mantine-color-blue-filled)' : 'var(--mantine-color-text)',
                  }}
                >
                  <Group gap="sm">
                    <Icon size={20} />
                    <Text fw={isActive ? 600 : 400} size="sm">
                      {item.label}
                    </Text>
                  </Group>
                </UnstyledButton>
              );
            })}

            <UnstyledButton
              onClick={() => setIsAddModalOpen(true)}
              p="xs"
              mt="auto"
              style={{
                borderRadius: 8,
                backgroundColor: 'var(--mantine-color-blue-filled)',
                color: 'white',
              }}
            >
              <Group gap="sm" justify="center">
                <IconPlus size={20} />
                <Text fw={600} size="sm">
                  Agregar Película
                </Text>
              </Group>
            </UnstyledButton>
          </Box>
        </AppShell.Navbar>
      )}

      {/* Contenido Principal */}
      <AppShell.Main pb={!isDesktop ? 80 : undefined}>
        {children}
      </AppShell.Main>

      {/* Barra de Navegación Inferior en Móvil */}
      {!isDesktop && (
        <AppShell.Footer p="xs">
          <Group justify="space-around" h="100%" align="center">
            <UnstyledButton
              onClick={() => setActiveTab('home')}
              c={activeTab === 'home' ? 'blue' : 'gray'}
              style={{ textAlign: 'center' }}
            >
              <IconLayoutDashboard style={{ margin: '0 auto' }} size={22} />
              <Text size="xs" fw={activeTab === 'home' ? 600 : 400}>
                Home
              </Text>
            </UnstyledButton>

            <UnstyledButton
              onClick={() => setActiveTab('my-list')}
              c={activeTab === 'my-list' ? 'blue' : 'gray'}
              style={{ textAlign: 'center' }}
            >
              <IconBookmark style={{ margin: '0 auto' }} size={22} />
              <Text size="xs" fw={activeTab === 'my-list' ? 600 : 400}>
                My List
              </Text>
            </UnstyledButton>

            <ActionIcon
              size="xl"
              radius="xl"
              color="blue"
              variant="filled"
              onClick={() => setIsAddModalOpen(true)}
            >
              <IconPlus size={24} />
            </ActionIcon>

            <UnstyledButton
              onClick={() => setActiveTab('community')}
              c={activeTab === 'community' ? 'blue' : 'gray'}
              style={{ textAlign: 'center' }}
            >
              <IconUsers style={{ margin: '0 auto' }} size={22} />
              <Text size="xs" fw={activeTab === 'community' ? 600 : 400}>
                Community
              </Text>
            </UnstyledButton>
          </Group>
        </AppShell.Footer>
      )}

      {/* Modal para Editar Nombre de Usuario */}
      <Modal
        opened={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        title="Perfil de Usuario"
        centered
        size="sm"
        radius="md"
      >
        <Stack gap="sm">
          <TextInput
            label="Tu nombre o apodo"
            placeholder="Ej: José Iván"
            value={tempName}
            onChange={(e) => setTempName(e.currentTarget.value)}
            leftSection={<IconPencil size={16} />}
          />
          <Group justify="flex-end" mt="xs">
            <Button variant="default" onClick={() => setIsNameModalOpen(false)}>
              Cancelar
            </Button>
            <Button color="blue" onClick={handleSaveName}>
              Guardar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </AppShell>
  );
}