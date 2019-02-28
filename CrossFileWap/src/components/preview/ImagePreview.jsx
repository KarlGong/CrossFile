import React, {Component} from "react";
import {observer} from "mobx-react";
import "./ImagePreview.less";

@observer
export default class ImagePreview extends Component {
    static defaultProps = {
        fileName: ""
    };

    render = () => {
        return <div className="image-preview">
            <img className="image" src={"/api/file/" + this.props.fileName} alt="image preview"/>
        </div>
    }
}