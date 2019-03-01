import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import "./VideoPreview.less";

@observer
export default class VideoPreview extends Component {
    static defaultProps = {
        fileName: ""
    };

    render = () => {
        return <div className="video-preview">
            <video preload="auto" controls="true" playsinline="true" src={"/api/file/" + this.props.fileName} />
        </div>;
    };
}