# Página de Turismo Neuquén

Este proyecto es una página web de turismo interactiva y atractiva, diseñada para mostrar la belleza y las atracciones de Buta Ranquil y Chos Malal en Neuquén, Argentina. El sitio web ofrece a los usuarios información detallada sobre atracciones, actividades, alojamiento y experiencias de otros viajeros, todo presentado en una interfaz moderna y fácil de usar.

## 📜 Descripción del Proyecto

El objetivo de este proyecto es proporcionar una plataforma centralizada para que los turistas y visitantes puedan descubrir todo lo que Buta Ranquil y Chos Malal tienen para ofrecer.

### ✨ Características Principales

  * **Páginas Detalladas por Ubicación:** Cada destino (Buta Ranquil y Chos Malal) tiene su propia página con información sobre atracciones, actividades, hoteles y restaurantes.
  * **Mapa Interactivo:** Un mapa dinámico que muestra la ubicación de todas las atracciones, permitiendo a los usuarios explorar visualmente la zona y obtener más detalles sobre cada punto de interés.
  * **Galería de Imágenes:** Secciones de galería visualmente atractivas para mostrar la belleza de cada lugar.
  * **Foro de Viajeros:** Un espacio para que los usuarios compartan sus experiencias, reseñas y fotos, fomentando una comunidad de viajeros.
  * **Diseño Responsivo:** Una interfaz que se adapta a cualquier dispositivo, ya sea de escritorio, tableta o móvil.
  * **Fácil de Actualizar:** El contenido del sitio se gestiona a través de un archivo central (`constants.tsx`), lo que facilita la adición de nuevas ubicaciones, atracciones o cualquier otra información sin necesidad de modificar el código de los componentes.

-----

## 🚀 Cómo Iniciar el Proyecto Localmente

Para ejecutar este proyecto en tu máquina local, sigue estos sencillos pasos.

### ✅ Prerrequisitos

Asegúrate de tener instalado **Node.js** en tu sistema. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).

### ⚙️ Pasos de Instalación

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/lucianodavidcor/pagina-de-turismo-v3.git
    cd pagina-de-turismo-v3
    ```

2.  **Instala las dependencias:**
    Usa `npm` para instalar todas las dependencias del proyecto definidas en el archivo `package.json`.

    ```bash
    npm install
    ```

3.  **Ejecuta la aplicación:**
    Una vez que las dependencias estén instaladas, puedes iniciar el servidor de desarrollo.

    ```bash
    npm run dev
    ```

    La aplicación estará disponible en `http://localhost:3000`.

-----

## 📂 Estructura del Proyecto

El proyecto está organizado de la siguiente manera para mantener el código limpio y escalable:

```
/
├── public/
├── src/
│   ├── components/      # Componentes reutilizables (Header, Footer, Map, etc.)
│   ├── pages/           # Páginas principales de la aplicación (HomePage, LocationPage, etc.)
│   ├── App.tsx          # Componente principal que gestiona las rutas
│   ├── constants.tsx    # Archivo central para todos los datos del sitio
│   └── types.ts         # Definiciones de tipos de TypeScript
├── .gitignore
├── index.html
├── package.json
└── README.md
```

-----

## ✏️ Cómo Añadir y Gestionar Contenido

Una de las principales ventajas de este proyecto es que casi todo el contenido se puede gestionar desde un único archivo: `src/constants.tsx`. Esto te permite añadir nuevas ubicaciones, atracciones, actividades y más, sin tener que tocar el código de los componentes de React.

### Cómo Añadir una Nueva Ubicación

Para añadir una nueva ciudad o destino turístico, sigue estos pasos:

1.  **Duplica una Estructura de Datos Existente:**
    En `src/constants.tsx`, copia todo el bloque de `BUTA_RANQUIL_DATA` o `CHOS_MALAL_DATA`.

2.  **Renombra la Constante:**
    Cambia el nombre de la nueva constante. Por ejemplo, si añades "Villa Pehuenia", el nombre podría ser `VILLA_PEHUENIA_DATA`.

3.  **Actualiza los Datos:**
    Modifica todos los campos necesarios, como `name`, `slug`, `hero`, `attractions`, `activities`, `gallery`, y `mapCenter`.

4.  **Añade la Nueva Ruta:**
    Ve a `src/App.tsx` y añade una nueva ruta para tu ubicación:

    ```tsx
    import { VILLA_PEHUENIA_DATA } from './constants';

    <Route path="/villa-pehuenia" element={<LocationPage data={VILLA_PEHUENIA_DATA} />} />
    ```

5.  **Añade un Enlace en el Menú Principal (Opcional):**
    Si quieres que la nueva ubicación aparezca en la barra de navegación principal, añádela a `HOME_NAV_LINKS` en `src/constants.tsx`.

    ```tsx
    export const HOME_NAV_LINKS: NavLink[] = [
      // ... otros enlaces
      { label: 'Villa Pehuenia', href: '/villa-pehuenia' },
    ];
    ```

-----

## 🛠️ Tecnologías Utilizadas

  * **[React](https://react.dev/):** Biblioteca principal para construir la interfaz de usuario.
  * **[Vite](https://vitejs.dev/):** Herramienta de desarrollo moderna y rápida para proyectos web.
  * **[React Router DOM](https://reactrouter.com/):** Para gestionar la navegación y las rutas de la aplicación.
  * **[TypeScript](https://www.typescriptlang.org/):** Para añadir tipos estáticos a JavaScript y mejorar la calidad del código.
  * **[Tailwind CSS](https://tailwindcss.com/):** Framework de CSS para un diseño rápido y responsivo.
  * **[Leaflet](https://leafletjs.com/):** Biblioteca de mapas interactivos de código abierto.