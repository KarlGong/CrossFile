import {Button, WhiteSpace, WingBlank} from "antd-mobile";
import React, {Component} from "react";
import guid from "~/utils/guid";

export default class App extends Component {
    componentWillMount = () => {
    };

    render = () => {
        return <div>{this.props.children}</div>
    };


}