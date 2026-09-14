// src/views/NetworkView.tsx

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  TextInput,
  Button,
  Group,
  Stack,
  Badge,
  ActionIcon,
  CopyButton,
  Tooltip,
  Divider,
  Avatar,
  Card,
} from '@mantine/core';
import { IconCopy, IconCheck, IconWifi, IconUnlink, IconUser, IconRefresh } from '@tabler/icons-react';
import { usePeerStore } from '../store/usePeerStore';

export function NetworkView() {
  const {
    myPeerId,
    userName,
    setUserName,
    connectedPeers,
    connectToPeer,
    disconnectPeer,
    broadcastMovies,
    isConnecting,
    statusMessage,
  } = usePeerStore();

  const [remoteId, setRemoteId] = useState('');

  const handleConnect = () => {
    if (!remoteId.trim()) return;
    connectToPeer(remoteId);
    setRemoteId('');
  };

  return (
    <Container size="md" py="md">
      <Title order={2}>Red P2P & Sincronización</Title>
      <Text c="dimmed" size="sm" mb="lg">
        Conéctate con tu pareja o amigos para compartir catálogos y ver coincidencias en tiempo real.
      </Text>

      <Stack gap="md">
        {/* Configuración de Perfil y Mi ID */}
        <Paper p="md" radius="md" withBorder>
          <Title order={4} mb="xs">
            Mi Perfil y Conexión
          </Title>

          <Group grow align="flex-end">
            <TextInput
              label="Tu Nombre / Apodo"
              placeholder="Ej. Ivan"
              leftSection={<IconUser size={16} />}
              value={userName}
              onChange={(e) => setUserName(e.currentTarget.value)}
            />

            <div>
              <Text size="xs" fw={500} mb={3}>
                Mi Peer ID
              </Text>

              <Group gap="xs">
                <TextInput
                  value={myPeerId || 'Generando ID...'}
                  readOnly
                  style={{ flex: 1 }}
                />

                <CopyButton value={myPeerId} timeout={2000}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? '¡Copiado!' : 'Copiar ID'}>
                      <ActionIcon color={copied ? 'teal' : 'gray'} variant="light" onClick={copy} size="lg">
                        {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>
            </div>
          </Group>
        </Paper>

        {/* Conectar a un Par */}
        <Paper p="md" radius="md" withBorder>
          <Title order={4} mb="xs">
            Conectar con Amigo / Pareja
          </Title>
          <Text size="xs" c="dimmed" mb="md">
            Ingresa el Peer ID de tu par para establecer el enlace directo sin servidores centrales.
          </Text>

          <Group align="flex-end">
            <TextInput
              label="Peer ID Remoto"
              placeholder="Pega el ID de tu par aquí..."
              value={remoteId}
              onChange={(e) => setRemoteId(e.currentTarget.value)}
              style={{ flex: 1 }}
            />

            <Button
              onClick={handleConnect}
              loading={isConnecting}
              leftSection={<IconWifi size={18} />}
              color="indigo"
            >
              Conectar
            </Button>
          </Group>

          {statusMessage && (
            <Text size="xs" c="indigo" mt="xs" fw={500}>
              Estado: {statusMessage}
            </Text>
          )}
        </Paper>

        {/* Lista de Pares Conectados */}
        <Paper p="md" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <div>
              <Title order={4}>Pares Conectados</Title>
              <Text size="xs" c="dimmed">
                Amigos con los que estás compartiendo biblioteca en esta sesión
              </Text>
            </div>

            {connectedPeers.length > 0 && (
              <Button
                variant="light"
                size="xs"
                leftSection={<IconRefresh size={14} />}
                onClick={() => broadcastMovies()}
              >
                Sincronizar Todo
              </Button>
            )}
          </Group>

          <Divider mb="sm" />

          {connectedPeers.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="xl">
              Aún no te has conectado con ningún par. Pásale tu Peer ID a tu pareja o amigo para comenzar.
            </Text>
          ) : (
            <Stack gap="xs">
              {connectedPeers.map((peer) => (
                <Card key={peer.id} p="xs" withBorder radius="sm">
                  <Group justify="space-between">
                    <Group gap="sm">
                      <Avatar color="blue" radius="xl">
                        {peer.name.slice(0, 2).toUpperCase()}
                      </Avatar>

                      <div>
                        <Group gap="xs">
                          <Text size="sm" fw={600}>
                            {peer.name}
                          </Text>
                          <Badge
                            size="xs"
                            color={peer.status === 'connected' ? 'green' : 'gray'}
                            variant="light"
                          >
                            {peer.status === 'connected' ? 'En línea' : 'Desconectado'}
                          </Badge>
                        </Group>

                        <Text size="xs" c="dimmed">
                          ID: {peer.id.slice(0, 16)}...
                        </Text>
                      </div>
                    </Group>

                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => disconnectPeer(peer.id)}
                      title="Desconectar"
                    >
                      <IconUnlink size={18} />
                    </ActionIcon>
                  </Group>
                </Card>
              ))}
            </Stack>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}