// src/components/layout/AppLayout.tsx

import { AppShell, Group, Title, Button, Badge, Text, ActionIcon } from '@mantine/core';
import { IconMovie, IconNetwork, IconHome, IconCards, IconWifi } from '@tabler/icons-react';
import { usePeerStore } from '../../store/usePeerStore';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'movies' | 'network';
  onTabChange: (tab: 'home' | 'movies' | 'network') => void;
}

export function AppLayout({ children, activeTab, onTabChange }: AppLayoutProps) {
  const { connectedPeers, statusMessage, myPeerId } = usePeerStore();
  const activeCount = connectedPeers.filter((p) => p.status === 'connected').length;

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header p="xs">
        <Group justify="space-between" h="100%">
          <Group>
            <ActionIcon variant="light" color="indigo" size="lg">
              <IconMovie size={24} />
            </ActionIcon>
            <Title order={3}>CoMovie</Title>
          </Group>

          {/* Navegación Principal */}
          <Group gap="xs">
            <Button
              variant={activeTab === 'home' ? 'filled' : 'subtle'}
              leftSection={<IconHome size={18} />}
              onClick={() => onTabChange('home')}
            >
              Inicio
            </Button>

            <Button
              variant={activeTab === 'movies' ? 'filled' : 'subtle'}
              leftSection={<IconCards size={18} />}
              onClick={() => onTabChange('movies')}
            >
              Catálogo
            </Button>

            <Button
              variant={activeTab === 'network' ? 'filled' : 'subtle'}
              leftSection={<IconNetwork size={18} />}
              onClick={() => onTabChange('network')}
            >
              Red P2P
            </Button>
          </Group>

          {/* Estado de Conexión */}
          <Group gap="xs">
            {myPeerId && (
              <Badge color={activeCount > 0 ? 'green' : 'gray'} leftSection={<IconWifi size={12} />}>
                {activeCount > 0 ? `${activeCount} online` : 'P2P listo'}
              </Badge>
            )}
            {statusMessage && (
              <Text size="xs" c="dimmed" hiddenFrom="xs">
                {statusMessage}
              </Text>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}