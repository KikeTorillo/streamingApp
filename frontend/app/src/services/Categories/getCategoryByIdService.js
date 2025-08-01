// src/services/Categories/getCategoryByIdService.js (NUEVO)
import axios from "axios";
import { environmentService } from "../environmentService";

const getCategoryByIdService = async (id) => {
    const { urlBackend } = environmentService();
    const response = await axios.get(`${urlBackend}/api/v1/category/${id}`, {
        withCredentials: true,
    });
    return response.data;
};

export { getCategoryByIdService };