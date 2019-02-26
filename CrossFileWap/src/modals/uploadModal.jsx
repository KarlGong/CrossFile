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
        onSuccess: () => {},
        afterClose: () => {}
    };

    @observable visible = true;
    name = this.props.file.name;
    @observable isUploading = false;
    @observable uploadPercentage = 0;
    @observable uploadLoaded = 0;
    @observable uploadTotal = 0;
    uploadingCancelSource = null;

    render = () => {
        return <Modal
            className="uploadModal"
            popup
            closable
            maskClosable={false}
            visible={this.visible}
            animationType="slide-up"
            onClose={this.handleClose}
            afterClose={() => this.props.afterClose()}
        >
            <List renderHeader={() =>
                <div>{this.isUploading ? `${formatBytes(this.uploadLoaded)} / ${formatBytes(this.uploadTotal)} - ${this.uploadPercentage}%` : this.props.file.name}</div>
            }>
                <Progress percent={this.uploadPercentage} position="normal" unfilled={false}/>
                <List.Item>
                    <InputItem
                        placeholder={this.props.file.name}
                        editable={!this.isUploading}
                        defaultValue={this.props.file.name}
                        onChange={value => this.name = value || this.props.file.name}
                    >Name</InputItem>
                    <InputItem defaultValue={formatBytes(this.props.file.size)} editable={false}>Size</InputItem>
                    {
                        this.isUploading ? <Button type="warning" onClick={this.cancelUploading}>Cancel</Button>
                            : <Button type="primary" onClick={this.uploadFile}>Upload</Button>
                    }

                </List.Item>
            </List>
        </Modal>
    };

    uploadFile = () => {
        let formData = new FormData();
        formData.append(this.name, this.props.file);
        this.isUploading = true;
        this.uploadingCancelSource = axios.CancelToken.source();
        axios.post("/api/space/" + this.props.spaceName, formData,
            {
                headers: {"Content-Type": "multipart/form-data"},
                cancelToken: this.uploadingCancelSource.token,
                onUploadProgress: (e) => {
                    if (e.lengthComputable && this.isUploading) {
                        this.uploadLoaded = e.loaded;
                        this.uploadTotal = e.total;
                        this.uploadPercentage = (e.loaded * 100 / e.total).toFixed(1);
                    }
                }
            }
        ).then(response => {
            this.visible = false;
            Toast.success("Uploaded successfully!", undefined, undefined, false);
            this.props.onSuccess();
        }).finally(() => this.isUploading = false)
    };

    cancelUploading = () => {
        Modal.alert("Cancel Uploading", "Are you sure?", [
            {text: "No", onPress: () => {}},
            {
                text: "Yes", onPress: () => {
                    this.uploadingCancelSource.cancel("Uploading cancelled!");
                    this.isUploading = false;
                    this.uploadPercentage = 0;
                    this.uploadLoaded = 0;
                    this.uploadTotal = 0;
                }
            },
        ])
    };

    handleClose = () => {
        if (this.isUploading) {
            Modal.alert("Close", "The uploading will be cancelled.", [
                {text: "No", onPress: () => {}},
                {
                    text: "Yes", onPress: () => {
                        this.uploadingCancelSource.cancel("Uploading aborted!");
                        this.visible = false;
                    }
                },
            ]);
        } else {
            this.visible = false;
        }
    }
}