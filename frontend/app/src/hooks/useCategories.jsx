// hooks/useCategories.jsx
import { useState, useEffect } from "react";
import { getCategoriesService } from "../services/Categories/getCategoriesService";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError(null);

      try {

        const response = await getCategoriesService();

        const data = Array.isArray(response) ? response : 
                     response?.data ? response.data : 
                     response?.categories ? response.categories : [];

        setCategories(data);

        if (data.length === 0) {
          setError('No hay categorías disponibles. Ve a Administrar > Categorías para crear una.');
        }
      } catch (err) {

        setError('Error al cargar categorías. Verifica tu conexión.');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, loading, error };
};

export { useCategories };
