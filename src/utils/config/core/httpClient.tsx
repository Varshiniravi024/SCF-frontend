import axios from "axios";
import { message } from "antd";

const httpClient = {
  getInstance() {
    const instance = axios.create({
      headers: {
        "Content-Type": "application/json",
        Authorization: "token " + localStorage.getItem("token"),
      },
    });

    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (
          error.response &&
          (error.response.status === 403)
        ) {
          message.error(error.response.data.detail,3)
          
        }else  if (
          error.response &&
          (error.response.status === 401)
        ) {
          message.error(error.response.data.detail,3)
          if(error.response.data.detail === "Invalid token."){
            localStorage.clear();
            window.location.href = "/";
            window.location.reload();
          }
          // localStorage.removeItem("token");
          // message.error(error.detail);
          // message.error(error.response.data.error);
          // window.location.href = "/";
        }
        return Promise.reject(error);
      }
    );
    return instance;
  },
};

export default httpClient;
