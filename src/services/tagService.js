import axiosInstance from "../utils/axiosInstance"

const getErrorMessage = (error, fallbackMessage) => {
    return error?.response?.data?.message || fallbackMessage;
}

export const getTags = async () => {
    try {
        const res = await axiosInstance.get("/GameTags");
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "Failed to fetch tags"));
    }
}

export const createTag = async (name) => {
    try {
        const res = await axiosInstance.post("/GameTags", { name });
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "Failed to create tag"));
    }
}