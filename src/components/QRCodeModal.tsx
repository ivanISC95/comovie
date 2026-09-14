// src/components/QRCodeModal.tsx

import { useEffect } from 'react';
import { Modal, Tabs, Box, Text,  Stack } from '@mantine/core';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { IconCamera } from '@tabler/icons-react';

interface QRCodeModalProps {
  opened: boolean;
  onClose: () => void;
  myPeerId: string;
  onScanSuccess: (scannedId: string) => void;
}

export function QRCodeModal({ opened, onClose, myPeerId, onScanSuccess }: QRCodeModalProps) {
  useEffect(() => {
    if (!opened) return;

    // Inicializar el escáner HTML5 cuando la pestaña activa cambie o esté abierto
    const timer = setTimeout(() => {
      const qrRegion = document.getElementById('qr-reader');
      if (qrRegion) {
        const scanner = new Html5QrcodeScanner(
          'qr-reader',
          { fps: 10, qrbox: { width: 220, height: 220 } },
          /* verbose= */ false
        );

        scanner.render(
          (decodedText) => {
            scanner.clear();
            onScanSuccess(decodedText);
            onClose();
          },
          () => {
            // Ignorar errores continuos de renderizado
          }
        );

        return () => {
          scanner.clear().catch(() => {});
        };
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [opened, onScanSuccess, onClose]);

  return (
    <Modal opened={opened} onClose={onClose} title="Sincronización QR" centered radius="md">
      <Tabs defaultValue="my-qr">
        <Tabs.List grow mb="md">
          <Tabs.Tab value="my-qr" leftSection={<IconCamera size={16} />}>
            Mi Código QR
          </Tabs.Tab>
          <Tabs.Tab value="scan" leftSection={<IconCamera size={16} />}>
            Escanear QR
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="my-qr">
          <Stack align="center" gap="md" py="sm">
            <Text size="sm" c="dimmed" style={{ textAlign: 'center' }}>
              Muestra este código QR a tu pareja o amigo para conectarse al instante.
            </Text>

            {myPeerId ? (
              <Box p="md" style={{ background: '#ffffff', borderRadius: 12, border: '1px solid #e0e0e0' }}>
                <QRCodeSVG value={myPeerId} size={200} />
              </Box>
            ) : (
              <Text size="sm" color="gray">
                Generando ID...
              </Text>
            )}

            <Text size="xs" color="dimmed" style={{ wordBreak: 'break-all' }}>
              ID: {myPeerId}
            </Text>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="scan">
          <Box py="sm">
            <Text size="sm" c="dimmed" mb="md" style={{ textAlign: 'center' }}>
              Apunta la cámara al código QR de tu pareja o amigo.
            </Text>
            <div id="qr-reader" style={{ width: '100%' }} />
          </Box>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}