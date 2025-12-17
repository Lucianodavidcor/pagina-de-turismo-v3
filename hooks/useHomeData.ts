import { useState, useEffect } from 'react';
import { getAllLocations, getGalleryByLocationId } from '../services/locations';
// CAMBIO IMPORTANTE: Importamos ForumPost desde el servicio, no desde 'types'.
// Esto alinea los tipos del hook con lo que devuelve la API real.
import { getPublicPosts, ForumPost } from '../services/forum';
import type { LocationData } from '../types';

// --- CACHÉ GLOBAL (Singleton) ---
const globalCache = {
  data: null as {
    locations: LocationData[];
    posts: ForumPost[];
    adventureImages: string[];
  } | null,
  timestamp: 0,
};

// Tiempo de validez del caché (5 minutos)
const CACHE_DURATION = 5 * 60 * 1000; 

export const useHomeData = () => {
  const [data, setData] = useState(globalCache.data);
  // Inicializamos loading en true solo si no hay caché
  const [loading, setLoading] = useState(!globalCache.data);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const now = Date.now();

      // 1. Si tenemos datos en caché y son recientes, los usamos
      if (globalCache.data && (now - globalCache.timestamp < CACHE_DURATION)) {
        setData(globalCache.data);
        setLoading(false);
        return;
      }

      // 2. Si no, consultamos a la API
      try {
        setLoading(true);
        const [locs, posts] = await Promise.all([
          getAllLocations(),
          getPublicPosts()
        ]);

        // Lógica de imágenes aleatorias
        let adventureImages: string[] = [];
        if (locs.length > 0) {
            const galleryPromises = locs.map(loc => getGalleryByLocationId(loc.id));
            const galleries = await Promise.all(galleryPromises);
            // Orden aleatorio para la galería
            const shuffled = galleries.flat().sort(() => 0.5 - Math.random());
            adventureImages = shuffled.slice(0, 8);
        }

        const newData = {
            locations: locs,
            posts: posts.slice(0, 3), // Guardamos solo las 3 últimas para el Home
            adventureImages
        };

        // 3. Guardamos en el Caché Global
        globalCache.data = newData;
        globalCache.timestamp = now;

        setData(newData);
      } catch (err) {
        console.error("Error cargando home:", err);
        setError("No se pudo cargar la información.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { 
    locations: data?.locations || [], 
    forumPosts: data?.posts || [], 
    adventureImages: data?.adventureImages || [],
    loading, 
    error 
  };
};