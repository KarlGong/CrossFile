import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import "./TextPreview.less";

@observer
export default class TextPreview extends Component {
    static defaultProps = {
        fileName: ""
    };

    @observable fileContent = "";

    componentDidMount = () => {
        axios.get("/api/file/" + this.props.fileName).then(response => {
            this.fileContent = response.data;
        });
    };

    render = () => {
        return <div className="text-preview"><pre>{this.fileContent}</pre></div>
    }
}