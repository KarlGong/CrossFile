import {Toast} from "antd-mobile";
import axios from "axios";
import {browserHistory} from "react-router";

const history = browserHistory;

axios.interceptors.response.use(
    response => response,
    error => {
        Toast.fail(error.message, undefined, undefined, false);
        return Promise.reject(error);
    }
);


export default {history}
