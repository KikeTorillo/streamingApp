// src/services/Movies/getMovieByIdService.js
import axios from "axios";
import { environmentService } from "../environmentService";

const getMovieByIdService = async (movieId) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.get(`${urlBackend}/api/v1/movies/${movieId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener película por ID:', error);
        throw error;
    }
};

const getMovieByHashService = async (fileHash) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.get(`${urlBackend}/api/v1/movies/by-hash/${fileHash}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener película por hash:', error);
        throw error;
    }
};

export { getMovieByIdService, getMovieByHashService };