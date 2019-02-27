import React, {Component} from "react";
import {observer} from "mobx-react";
import "./AppPreview.less";


@observer
export default class AppPreview extends Component {
    static defaultProps = {
        fileName: ""
    };

    render = () => {
        return <div className="app-preview">
            <iframe src={"/api/file/" + this.props.fileName} scrolling="no" frameBorder="0" />
        </div>
    }
}