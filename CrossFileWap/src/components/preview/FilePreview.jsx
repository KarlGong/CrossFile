import React, {Component} from "react";
import {observer} from "mobx-react";
import ImagePreview from "./ImagePreview";
import TextPreview from "./TextPreview";
import AppPreview from "./AppPreview";
import VideoPreview from "./VideoPreview";
import "./FilePreview.less";
import path from "path";


@observer
export default class FilePreview extends Component {
    static defaultProps = {
        fileName: "",
        fileSize: 0
    };

    constructor(props) {
        super(props);
        this.fileExt = path.extname(this.props.fileName).toLowerCase();
    }

    render = () => {
        let preview = <div className="error-msg">Cannot preview this file type {this.fileExt}</div>;

        if ([".jpg", ".jpeg", ".gif", ".png"].indexOf(this.fileExt) !== -1) {
            if (this.props.fileSize <= 10 * 1024 * 1024) {
                preview = <ImagePreview fileName={this.props.fileName}/>
            } else {
                preview = <div className="error-msg">Cannot preview {this.fileExt} which size is greater than 10MB.</div>;
            }
        } else if ([".txt"].indexOf(this.fileExt) !== -1) {
            if (this.props.fileSize <= 10 * 1024) {
                preview = <TextPreview fileName={this.props.fileName}/>
            } else {
                preview = <div className="error-msg">Cannot preview {this.fileExt} which size is greater than 10KB.</div>;
            }
        } else if ([".mp4", ".mov", ".avi", ".wmv"].indexOf(this.fileExt) !== -1) {
            if (this.props.fileSize <= 100 * 1024 * 1024) {
                preview = <VideoPreview fileName={this.props.fileName}/>
            } else {
                preview = <div className="error-msg">Cannot preview {this.fileExt} which size is greater than 100MB.</div>;
            }
        } else if ([".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".csv"].indexOf(this.fileExt) !== -1) {
            if (this.props.fileSize <= 10 * 1024 * 1024) {
                preview = <AppPreview fileName={this.props.fileName}/>
            } else {
                preview = <div className="error-msg">Cannot preview {this.fileExt} which size is greater than 10MB.</div>;
            }
        }

        return <div className="file-preview">
            {preview}
        </div>
    }
}