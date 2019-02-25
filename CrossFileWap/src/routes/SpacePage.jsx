import {NavBar, Icon, Modal} from "antd-mobile";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import openUploadModal from "~/modals/uploadModal";
import "./SpacePage.less";

@observer
export default class SpacePage extends Component {
    constructor(props) {
        super(props);
        this.inputOpenFileRef = React.createRef();
    }

    render = () => {
        return <div className="space-page">
            <input ref={this.inputOpenFileRef} type="file" style={{display:"none"}} onChange={this.handleClickUpload}/>
            <NavBar
                mode="light"
                icon={<Icon type="left"/>}
                onLeftClick={() => this.props.router.push("/home")}
                rightContent={
                    <span onClick={e => this.inputOpenFileRef.current.click()}>+</span>
                }
            >{this.props.params.spaceName}</NavBar>

        </div>
    };

    handleClickUpload = (e) => {
        let file = e.target.files[0];
        if (file) {
            openUploadModal(file);
        }
    }
}