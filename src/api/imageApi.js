import axios from "axios";

export const imageApi = {
  addImage: (data) =>
    axios.post(`${import.meta.env.VITE_API}/api/images`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getImage: (id) => axios.get(`/images/${id}`),
  removeImage: (id, data) => axios.delete(`/user/update/${id}`, data),
};
