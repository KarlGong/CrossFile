// import {Toast} from "antd-mobile";
import axios from "axios";
import {browserHistory} from "react-router";

const history = browserHistory;

// axios.interceptors.response.use(
//     response => response,
//     error => {
//         notification.error({
//             message: error.message,
//             description: error.response && error.response.data && error.response.data.message,
//             duration: 0,
//         });
//         return Promise.reject(error);
//     }
// );


export default {history}
