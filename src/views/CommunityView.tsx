// src/views/NetworkView.tsx (o CommunityView.tsx)

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
  Grid,
} from '@mantine/core';
import { IconCopy, IconCheck, IconWifi, IconUnlink, IconUser, IconRefresh, IconDownload, IconUpload } from '@tabler/icons-react';
import { usePeerStore } from '../store/usePeerStore';
import { useMovieStore } from '../store/useMovieStore';

export function CommunityView() {
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

  const { exportMoviesJSON, importMoviesJSON } = useMovieStore();
  const [remoteId, setRemoteId] = useState('');

  const handleConnect = () => {
    if (!remoteId.trim()) return;
    connectToPeer(remoteId);
    setRemoteId('');
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) {
          importMoviesJSON(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Container size="md" py="md">
      <Title order={2}>Comunidad y Sincronización</Title>
      <Text c="dimmed" size="sm" mb="lg">
        Conéctate punto a punto (P2P) para sincronizar películas en tiempo real sin servidores intermediarios.
      </Text>

      <Stack gap="md">
        {/* Tu Código de Conexión y Nombre */}
        <Paper p="md" radius="md" withBorder>
          <Title order={4} mb="xs">
            Tu Código de Conexión (Peer ID)
          </Title>
          <Text size="xs" c="dimmed" mb="md">
            Define tu nombre para que tu pareja/amigos te identifiquen y comparte tu Peer ID.
          </Text>

          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Tu Nombre / Apodo"
                placeholder="Ej. Ivan"
                leftSection={<IconUser size={16} />}
                value={userName}
                onChange={(e) => setUserName(e.currentTarget.value)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
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
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Conectar con Pareja o Amigo */}
        <Paper p="md" radius="md" withBorder>
          <Title order={4} mb="xs">
            Conectar con Pareja o Amigo
          </Title>

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

        {/* Conexiones Activas */}
        <Paper p="md" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Title order={4}>Conexiones Activas ({connectedPeers.length})</Title>
            {connectedPeers.length > 0 && (
              <Button
                variant="light"
                size="xs"
                leftSection={<IconRefresh size={14} />}
                onClick={() => broadcastMovies()}
              >
                Sincronizar Películas
              </Button>
            )}
          </Group>

          <Text size="xs" c="dimmed" mb="md">
            Las películas se sincronizarán automáticamente al realizar cambios.
          </Text>

          <Divider mb="sm" />

          {connectedPeers.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="md">
              Aún no tienes conexiones activas. Escanea o envía tu Peer ID para empezar.
            </Text>
          ) : (
            <Stack gap="xs">
              {connectedPeers.map((peer) => (
                <Card key={peer.id} p="xs" withBorder radius="sm">
                  <Group justify="space-between">
                    <Group gap="sm">
                      <Avatar color="indigo" radius="xl">
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

        {/* Respaldo Offline JSON */}
        <Paper p="md" radius="md" withBorder>
          <Title order={4} mb="xs">
            Respaldo y Compartición Offline (JSON)
          </Title>
          <Text size="xs" c="dimmed" mb="md">
            Si no hay conexión a internet, puedes exportar tu lista o importar la de un amigo mediante un archivo.
          </Text>

          <Group gap="sm">
            <Button
              variant="default"
              leftSection={<IconDownload size={16} />}
              onClick={() => exportMoviesJSON()}
            >
              Exportar Lista (JSON)
            </Button>

            <Button
              variant="default"
              component="label"
              leftSection={<IconUpload size={16} />}
            >
              Importar Archivo
              <input
                type="file"
                accept=".json"
                hidden
                onChange={handleFileImport}
              />
            </Button>
          </Group>
        </Paper>
      </Stack>
    </Container>
  );
}