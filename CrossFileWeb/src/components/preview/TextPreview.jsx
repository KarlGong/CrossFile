import {InputItem, Icon, Modal, Button, WingBlank, List, Toast, Progress} from "antd-mobile";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import clipboard from "clipboard-js";
import "./TextPreview.less";

@observer
export default class TextPreview extends Component {
    static defaultProps = {
        fileName: ""
    };

    @observable fileContent = "";
    @observable isCopied = false;

    componentDidMount = () => {
        axios.get("/api/file/" + this.props.fileName).then(response => {
            this.fileContent = response.data;
        });
    };

    render = () => {
        return <div className="text-preview">
            <pre>{this.fileContent}</pre>
            <Button className="copy-button" size="small" onClick={() => {
                clipboard.copy(this.fileContent);
                this.isCopied = true;
                setTimeout(() => this.isCopied = false, 2000);
            }}>{this.isCopied ? "Copied" : "Copy"}</Button>
        </div>
    }
}