// hooks/useSeries.jsx
import { useState, useEffect } from "react";
import { getSeriesService } from "../services/Series/getSeriesService";

/**
 * Hook para manejar la carga de series
 * Centraliza la lógica común para componentes que requieren lista de series
 */
const useSeries = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSeries = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('📺 Cargando series disponibles...');
        const response = await getSeriesService();
        const seriesData = response?.data || response || [];

        console.log(`✅ Series cargadas: ${seriesData.length} elementos`);
        setSeries(seriesData);

        if (seriesData.length === 0) {
          setError('No hay series disponibles. Ve a Administrar > Series para crear una.');
        }
      } catch (err) {
        console.error('❌ Error al cargar series:', err);
        setError('Error al cargar las series disponibles. Verifica tu conexión.');
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, []);

  return { series, loading, error };
};

export { useSeries };