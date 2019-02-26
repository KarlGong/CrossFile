import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import ImagePreview from "./ImagePreview";
import TextPreview from "./TextPreview";
import "./FilePreview.less";

@observer
export default class FilePreview extends Component {
    static defaultProps = {
        fileName: "",
        fileSize: 0,
        style: {}
    };

    constructor(props) {
        super(props);
        let fileNameParts = this.props.fileName.split(".");
        this.fileExt = fileNameParts.length === 1 ? "" : fileNameParts.pop();
    }

    render = () => {
        let preview = null;

        if (["jpg", "jpeg", "gif", "png"].indexOf(this.fileExt) !== -1) {
            if (this.props.fileSize <= 10 * 1024 * 1024) {
                preview = <ImagePreview fileName={this.props.fileName}/>
            } else {
                preview = <div className="error-msg">Cannot preview image which size is greater than 10MB.</div>;
            }
        } else if (["txt", ""].indexOf(this.fileExt) !== -1) {
            if (this.props.fileSize <= 10 * 1024) {
                preview = <TextPreview fileName={this.props.fileName}/>
            } else {
                preview = <div className="error-msg">Cannot preview txt which size is greater than 10KB.</div>;
            }
        } else {
            preview = <div className="error-msg">Cannot preview this file type.</div>;
        }

        return <div className="file-preview" style={this.props.style}>
            {preview}
        </div>
    }
}