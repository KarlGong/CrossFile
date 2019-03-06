import {Toast} from "antd-mobile";
import axios from "axios";
import {browserHistory} from "react-router";
import MobileDetect from "mobile-detect";


const history = browserHistory;

axios.interceptors.response.use(
    response => response,
    error => {
        Toast.fail(error.message, undefined, undefined, false);
        return Promise.reject(error);
    }
);

const userAgent = new MobileDetect(window.navigator.userAgent);

export default {history, userAgent}
