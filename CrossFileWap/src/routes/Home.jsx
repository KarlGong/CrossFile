import { Button, WhiteSpace, WingBlank } from "antd-mobile";
import React, {Component} from "react";
import guid from "~/utils/guid";

export default class Home extends Component {
    componentWillMount = () => {
    };

    render = () => {
        return <WingBlank>
            <Button>Cross</Button>
        </WingBlank>;
    };


}