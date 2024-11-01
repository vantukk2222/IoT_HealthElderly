import axios from "axios";

const axiosClient = axios.create({
  baseURL: 'http://192.168.2.53:81/',
  headers: {
    'Content-Type': 'application/json',
    Accept:'*',
  },
});

axiosClient.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// export const setHeaderConfigAxios = (token) => {
//   if (token) {
//     axiosClient.defaults.headers.common["Authorization"] = token ? "Bearer " + token : "";
//   } else {
//     delete axiosClient.defaults.headers.common["Authorization"];
//   }
// };

export default axiosClient;
