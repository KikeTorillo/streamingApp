// src/services/Users/getUserByIdService.js (NUEVO)
import axios from "axios";
import { environmentService } from "../environmentService";

/**
 * Obtener usuario por ID
 * Endpoint: GET /api/v1/users/{id} (según Bruno)
 */
const getUserByIdService = async (id) => {
    const { urlBackend } = environmentService();
    const response = await axios.get(`${urlBackend}/api/v1/users/${id}`, {
        withCredentials: true,
    });
    return response.data;
};

export { getUserByIdService };
