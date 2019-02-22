import {notification} from "antd";
import axios from "axios";

axios.interceptors.response.use(
    response => response,
    error => {
        notification.error({
            message: error.message,
            description: error.response && error.response.data && error.response.data.message,
            duration: 0,
        });
        return Promise.reject(error);
    }
);
