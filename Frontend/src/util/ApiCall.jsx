import { toast } from "react-toastify";
import axios from "axios";

// ✅ create axios instance
const api = axios.create({
  baseURL: "https://skillswap-ab0o.onrender.com", // backend URL
  withCredentials: true, // ⭐ VERY IMPORTANT
});

const ApiCall = async (url, method, navigate, setUser, data) => {
  console.log("******** Inside ApiCall function ********");

  try {
    let response;

    if (method === "GET") {
      response = await api.get(url);
    } else if (method === "POST") {
      response = await api.post(url, data);
    }

    return response.data;
  } catch (error) {
    console.error("Error in API call:", error);

    setUser(null);

    if (error?.response?.status === 401) {
      toast.error("You are not authorized. Please login again.");
      navigate("/login");
    } else if (error?.response?.status === 404) {
      toast.error("Resource not found.");
      navigate("/");
    } else if (error?.response?.status === 500) {
      toast.error("Server error. Please try again later.");
      navigate("/");
    } else {
      toast.error("Something went wrong.");
      navigate("/");
    }
  }
};

export default ApiCall;
