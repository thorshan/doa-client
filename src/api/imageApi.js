import axios from "axios";
import { API } from "../constants/API";

export const imageApi = {
  addImage: (data) =>
    axios.post(`${API}/api/images`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getImage: (id) => axios.get(`/images/${id}`),
  removeImage: (id, data) => axios.delete(`/user/update/${id}`, data),
};
