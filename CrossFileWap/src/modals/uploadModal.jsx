import {InputItem, Icon, Modal, Button, WingBlank, List, Toast, Progress} from "antd-mobile";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import {render, unmountComponentAtNode} from "react-dom";
import moment from "moment";
import axios from "axios";
import Validator from "~/utils/Validator";
import formatBytes from "~/utils/formatBytes";
import "./uploadModal.less";

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
    @observable isUploading = false;
    @observable uploadPercentage = 0;

    render = () => {
        return <Modal
            className="uploadModal"
            popup
            closable
            maskClosable={false}
            visible={this.visible}
            animationType="slide-up"
            onClose={() => this.visible = false}
            afterClose={() => this.props.afterClose()}
        >
            <List
                renderHeader={() => <div>{this.isUploading ? this.uploadPercentage + "%" : this.props.file.name}</div>}>
                <Progress percent={this.uploadPercentage} position="normal" unfilled={false}/>
                <List.Item>
                    <InputItem
                        placeholder={this.props.file.name}
                        defaultValue={this.props.file.name}
                        onChange={value => this.name = value || this.props.file.name}
                    >Name</InputItem>
                    <InputItem defaultValue={formatBytes(this.props.file.size)} editable={false}>Size</InputItem>
                    <Button type="primary" disabled={this.isUploading} onClick={this.uploadFile}>{
                        this.isUploading ? "Uploading..." : "Upload"
                    }</Button>
                </List.Item>
            </List>
        </Modal>
    };

    uploadFile = () => {
        let formData = new FormData();
        formData.append(this.name, this.props.file);
        this.isUploading = true;
        axios.post("/api/space/" + this.props.spaceName, formData,
            {
                headers: {"Content-Type": "multipart/form-data"},
                onUploadProgress: (e) => {
                    if (e.lengthComputable) {
                        this.uploadPercentage = (e.loaded * 100 / e.total).toFixed(1);
                    }
                }
            }
        ).then(response => {
            this.visible = false;
            Toast.success("Uploaded successfully!");
        }).finally(() => this.isUploading = false)
    };
}