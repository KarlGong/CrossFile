import {Layout, Menu, Input, Icon, Modal, Form} from "antd";
import React, {Component} from "react";
import {render, unmountComponentAtNode} from "react-dom";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import moment from "moment";
import "./buildPngModal.less";


export default function openBuildPngModal(file) {
    return new Promise((resolve, reject) => {
        const target = document.createElement("div");
        document.body.appendChild(target);

        render(<BuildPngModal file={file} onSuccess={resolve} onFail={reject} afterClose={() => {
            unmountComponentAtNode(target);
            target.remove();
        }}/>, target);
    });
}

@observer
class BuildPngModal extends Component {
    static defaultProps = {
        file: null,
        onSuccess: (file) => {},
        onFail: () => {},
        afterClose: () => {}
    };

    @observable visible = true;
    @observable imageSrc = "";
    fileNameWithoutExt = "image-" + moment().format("YYYYMMDDTHHmmss");
    fileName = this.fileNameWithoutExt + ".png";

    componentDidMount = () => {
        let reader = new FileReader();
        reader.onload = () => this.imageSrc = reader.result;
        reader.readAsDataURL(this.props.file);
    };

    render = () => {
        return <Modal
            className="build-png-modal"
            title="Upload Image"
            width={800}
            maskClosable={false}
            visible={this.visible}
            okText="Upload"
            onOk={e => {
                let reader = new FileReader();
                reader.onload = () => {
                    this.visible = false;
                    this.props.onSuccess(new File([reader.result], this.fileName));
                };
                reader.readAsArrayBuffer(this.props.file);
            }}
            onCancel={e => {
                this.visible = false;
                this.props.onFail();
            }}
            afterClose={() => this.props.afterClose()}
        >
            <div className="image-container">
                <img src={this.imageSrc} alt="image"/>
            </div>
            <Form layout="inline" style={{marginTop: "20px"}}>
                <Form.Item label="File Name">
                    <Input
                        style={{width: "350px"}}
                        addonAfter=".png"
                        placeholder={this.fileNameWithoutExt}
                        onChange={e => this.fileName = (e.target.value || this.fileNameWithoutExt) + ".png"}/>
                </Form.Item>
            </Form>
        </Modal>
    };
}