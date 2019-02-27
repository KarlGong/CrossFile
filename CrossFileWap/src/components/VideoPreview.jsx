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
            <video webkit-playsinline="true" playsinline="true" x-webkit-airplay="allow" controlslist="nodownload" controls="controls" src={"/api/file/" + this.props.fileName}></video>
        </div>;
    };
}