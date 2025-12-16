import { useState, useEffect } from 'react';
import { getLocationBySlug } from '../services/locations';
import { LocationPageData } from '../types';

export const useLocation = (slug: string) => {
  const [data, setData] = useState<LocationPageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getLocationBySlug(slug);
        setData(result);
      } catch (err) {
        setError('No se pudo cargar la información.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  return { data, loading, error };
};