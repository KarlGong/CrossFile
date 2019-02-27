import React, {Component} from "react";
import {observer} from "mobx-react";
import "./FilePreview.less";


@observer
export default class FilePreview extends Component {
    static defaultProps = {
        fileName: ""
    };

    render = () => {
        return <div className="file-preview">
            <iframe src={"/api/file/" + this.props.fileName} scrolling="no" frameBorder="0" />
        </div>
    }
}