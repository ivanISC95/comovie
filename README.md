# 🎬 CinePals

**CinePals** es una Progressive Web App (PWA) moderna diseñada para llevar el seguimiento y gestión de tus películas favoritas de forma rápida, intuitiva y multi-dispositivo. Funciona 100% offline y se puede instalar como aplicación nativa en Android, iOS, Windows y macOS.

---

## 🚀 Características Principales

* **Offline First:** Gracias al uso de **Service Workers** e **IndexedDB (Dexie.js)**, la app sigue funcionando perfectamente sin conexión a Internet.
* **Multiplataforma & PWA:** Instalable directamente desde el navegador en dispositivos móviles y de escritorio.
* **Gestión de Películas:** Agrega, categoriza y organiza tus películas vistas y por ver.
* **Sincronización P2P:** Conexión local / P2P integrada con **PeerJS** para compartir o sincronizar listas entre usuarios.
* **Interfaz Moderna:** Diseñada con **Mantine UI** y un sistema de estado reactivo impulsado por **Zustand**.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **UI Framework:** [Mantine UI](https://mantine.dev/)
* **Gestión de Estado Global:** [Zustand](https://zustand-demo.pmnd.rs/)
* **Base de Datos Local (Offline):** [Dexie.js](https://dexie.org/) (IndexedDB wrapper)
* **PWA & Offline Caching:** [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (Workbox)
* **Conexión P2P:** [PeerJS](https://peerjs.com/)

---

## 💻 Requisitos Previos

Asegúrate de tener instalado:

* [Node.js](https://nodejs.org/) (versión 18.x o superior)
* `npm` o `pnpm` / `yarn`

---

## ⚙️ Instalación y Configuración

1. **Clonar el repositorio:**

   ```bash
   git clone [https://github.com/tu-usuario/cinepals.git](https://github.com/tu-usuario/cinepals.git)
   cd cinepals