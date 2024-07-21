import { toast } from "sonner";
import { store } from "../../utils/context/store";
import { adminApi } from "./api";
import { AdminLogout } from "../../utils/context/reducers/adminAuthSlice";

const adminApiCalls = async(method, url, data) => {
  return new Promise(async(resolve, reject) => {
    try {
      let response, error;

      if (method === "post") {
        console.log("in api call", data);
        response = await adminApi.post(url, data).catch((err) => {
          error = err;
        });
      } else if (method === "get") {
        response = await adminApi.get(url, data).catch((err) => {
          error = err;
        });
      }
      else if (method === "put") {
        response = await adminApi.put(url, data).catch((err) => {
          error = err;
        });
      }
       else if (method === "patch") {
        response = await adminApi.patch(url, data).catch((err) => {
          error = err;
        });
      } else if (method === "delete") {
        response = await adminApi.delete(url, data).catch((err) => {
          error = err;
        });
      }
      

      if (response) {
        resolve(response);
      } else if (error) {
        if (error.response.status == 401) {
          toast.error("You are not Authorized");
          store.dispatch(AdminLogout());
        }
        console.log(error);

        reject(error?.response?.data);
      }

    } catch (error) {
      reject(err.response.data);
    }
  })
}

export default adminApiCalls