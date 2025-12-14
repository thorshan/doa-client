import axios from "axios";

export const imageApi = {
  addImage: (data) =>
    axios.post("http://localhost:5050/api/images", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getImage: (id) => axios.get(`/images/${id}`),
  removeImage: (id, data) => axios.delete(`/user/update/${id}`, data),
};
