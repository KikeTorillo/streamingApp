// src/services/Categories/updateCategoryService.js (NUEVO)
import axios from "axios";
import { environmentService } from "../environmentService";

const updateCategoryService = async (id, name) => {
    const { urlBackend } = environmentService();
    const response = await axios.patch(`${urlBackend}/api/v1/category/${id}`, 
        { name },
        {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }
    );
    return response.data;
};

export { updateCategoryService };