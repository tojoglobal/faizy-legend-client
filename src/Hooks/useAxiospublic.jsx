import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_OPEN_APIURL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});
export const useAxiospublic = () => {
  return axiosPublic;
};
