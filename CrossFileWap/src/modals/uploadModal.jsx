import {InputItem, Icon, Modal, Button, WingBlank, List} from "antd-mobile";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import {render, unmountComponentAtNode} from "react-dom";
import moment from "moment";
import axios from "axios";
import Validator from "~/utils/Validator";
import formatBytes from "~/utils/formatBytes";

export default function openUploadModal(file, onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<UploadModal file={file} onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove();
    }}/>, target);
}

@observer
class UploadModal extends Component {
    static defaultProps = {
        file: "",
        onSuccess: (e) => {
        },
        afterClose: () => {
        }
    };

    @observable visible = true;

    render = () => {
        return <Modal
            popup
            closable
            maskClosable={false}
            visible={this.visible}
            animationType="slide-up"
            onClose={() => this.visible = false}
            afterClose={() => this.props.afterClose()}
        >
            <List renderHeader={() => <div>Upload</div>}>
                <List.Item>
                    <InputItem placeholder={this.props.file.name}>Name</InputItem>
                    <InputItem defaultValue={formatBytes(this.props.file.size)} editable={false}>Size</InputItem>
                    <Button type="primary" onClick={this.uploadFile}>Upload</Button>
                </List.Item>
            </List>
        </Modal>
    };

    uploadFile = () => {

    };
}