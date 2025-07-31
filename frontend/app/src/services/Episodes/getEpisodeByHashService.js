// src/services/Episodes/getEpisodeByHashService.js
import axios from "axios";
import { environmentService } from "../environmentService";

const getEpisodeByHashService = async (fileHash) => {
    const { urlBackend } = environmentService();
    try {
        const response = await axios.get(`${urlBackend}/api/v1/episodes/by-hash/${fileHash}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {

        throw error;
    }
};

export { getEpisodeByHashService };