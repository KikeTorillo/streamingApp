// src/services/Series/searchSeriesService.js
import axios from "axios";
import { environmentService } from "../environmentService";

const searchSeriesService = async (title) => {
    const { urlBackend } = environmentService();
    const response = await axios.get(`${urlBackend}/api/v1/series/search`, {
        params: { title },
        withCredentials: true,
    });
    return response.data;
};

export { searchSeriesService };