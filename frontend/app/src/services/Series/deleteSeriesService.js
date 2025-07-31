// src/services/Series/deleteSeriesService.js
import axios from "axios";
import { environmentService } from "../environmentService";

const deleteSeriesService = async (id) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.delete(`${urlBackend}/api/v1/series/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {

        throw error;
    }
};

export { deleteSeriesService };