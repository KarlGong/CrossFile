import {InputItem, Icon, Modal, Button, WingBlank, List} from "antd-mobile";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import {render, unmountComponentAtNode} from "react-dom";
import moment from "moment";
import axios from "axios";
import Validator from "~/utils/Validator";
import formatBytes from "~/utils/formatBytes";

export default function openUploadModal(spaceName, file, onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<UploadModal spaceName={spaceName} file={file} onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove();
    }}/>, target);
}

@observer
class UploadModal extends Component {
    static defaultProps = {
        spaceName: "",
        file: "",
        onSuccess: (e) => {
        },
        afterClose: () => {
        }
    };

    @observable visible = true;
    name = this.props.file.name;

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
            <List renderHeader={() => <div>{this.props.file.name}</div>}>
                <List.Item>
                    <InputItem
                        placeholder={this.props.file.name}
                        defaultValue={this.props.file.name}
                        onChange={value => this.name = value || this.props.file.name}
                    >Name</InputItem>
                    <InputItem defaultValue={formatBytes(this.props.file.size)} editable={false}>Size</InputItem>
                    <Button type="primary" onClick={this.uploadFile}>Upload</Button>
                </List.Item>
            </List>
        </Modal>
    };

    uploadFile = () => {
        let formData = new FormData();
        formData.append(this.name, this.props.file);
        axios.post("/api/space/" + this.props.spaceName, formData,
            {headers: {"Content-Type": "multipart/form-data"},}
        ).then(response => {
            alert(response.data)
        })
    };
}