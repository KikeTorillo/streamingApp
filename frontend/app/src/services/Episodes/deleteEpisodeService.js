// src/services/Episodes/deleteEpisodeService.js
import axios from "axios";
import { environmentService } from "../environmentService";

const deleteEpisodeService = async (id) => {
    const { urlBackend } = environmentService();
    const response = await axios.delete(`${urlBackend}/api/v1/episodes/${id}`, {
        withCredentials: true,
    });
    return response.data;
};

export { deleteEpisodeService };