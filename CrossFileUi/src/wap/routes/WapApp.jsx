import { Button, WhiteSpace, WingBlank } from "antd-mobile";
import React, {Component} from "react";
import guid from "~/shared/utils/guid";

export default class WapApp extends Component {
    componentWillMount = () => {
    };

    render = () => {
        return <WingBlank>
            <Button>Cross</Button>
        </WingBlank>;
    };


}