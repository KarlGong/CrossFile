import {Layout, Menu, Input, Icon, Modal, Form} from "antd";
import React, {Component} from "react";
import {render, unmountComponentAtNode} from "react-dom";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import moment from "moment";
import "./pasteTextModal.less";


export default function openPasteTextModal(text, onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<PasteTextModal text={text} onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove();
    }}/>, target);
}

@observer
class PasteTextModal extends Component {
    static defaultProps = {
        text: null,
        onSuccess: (file) => {},
        afterClose: () => {}
    };

    @observable visible = true;
    text = this.props.text;
    fileNameWithoutExt = "text-" + moment().format("YYYYMMDDTHHmmss");
    fileName = this.fileNameWithoutExt +".txt";

    render = () => {
        return <Modal
            className="upload-modal"
            title="Upload Text"
            width={800}
            closable={false}
            maskClosable={false}
            visible={this.visible}
            okText="Upload"
            onOk={e => {
                this.props.onSuccess(new File([this.text], this.fileName));
                this.visible = false;
            }}
            onCancel={e => this.visible = false}
            afterClose={() => this.props.afterClose()}
        >
            <Input.TextArea style={{resize: "none"}} rows={15} defaultValue={this.text} onChange={e => this.text = e.target.value}/>
            <Form layout="inline" style={{marginTop: "15px"}}>
                <Form.Item label="File Name">
                    <Input addonAfter=".txt"
                           placeholder={this.fileNameWithoutExt}
                           onChange={e => this.fileName = (e.target.value || this.fileNameWithoutExt) + ".txt"}/>
                </Form.Item>
            </Form>
        </Modal>
    };
}