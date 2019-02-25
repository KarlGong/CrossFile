import {Button, WhiteSpace, WingBlank} from "antd-mobile";
import React, {Component} from "react";
import guid from "~/utils/guid";
import "./App.less";

export default class App extends Component {
    componentWillMount = () => {
    };

    render = () => {
        return <div id="app">{this.props.children}</div>
    };


}