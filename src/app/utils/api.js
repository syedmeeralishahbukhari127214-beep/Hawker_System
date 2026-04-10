import axios from "axios";

// Axios instance create kar rahe hain
const API = axios.create({
  baseURL: "http://localhost:3000", // 👈 backend ka base URL daalna
  withCredentials: true,            // agar cookies / auth chahiye
});

export default API;
