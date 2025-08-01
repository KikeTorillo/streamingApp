// src/services/Categories/getCategoriesService.js (MANTENER NOMBRE)
import axios from "axios";
import { environmentService } from "../environmentService";

const getCategoriesService = async () => {
    const { urlBackend } = environmentService();
    const response = await axios.get(`${urlBackend}/api/v1/category`, {
        withCredentials: true,
    });
    return response.data;
};

export { getCategoriesService };