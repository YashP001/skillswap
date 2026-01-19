import { toast } from "react-toastify";
import axios from "axios";

const api = axios.create({
  baseURL: "https://skillswap-ab0o.onrender.com",
  withCredentials: true,
});

const ApiCall = async (url, method, navigate, setUser, data) => {
  try {
    let response;

    if (method === "GET") {
      response = await api.get(url);
    }

    if (method === "POST") {
      response = await api.post(url, data);
    }

    return response?.data;
  } catch (error) {
    console.error("API ERROR:", error);

    if (setUser) setUser(null);

    if (error?.response?.status === 401) {
      toast.error("Please login");
      navigate("/login");
    } else {
      toast.error("Something went wrong");
    }

    return null;
  }
};

export default ApiCall;
