import {Layout, Menu, Input, Icon, Modal, Form} from "antd";
import React, {Component} from "react";
import {render, unmountComponentAtNode} from "react-dom";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import moment from "moment";
import "./buildTxtModal.less";


export default function openBuildTxtModal(text) {
    return new Promise((resolve, reject) => {
        const target = document.createElement("div");
        document.body.appendChild(target);

        render(<BuildTxtModal text={text} onSuccess={resolve} onFail={reject} afterClose={() => {
            unmountComponentAtNode(target);
            target.remove();
        }}/>, target);
    });
}

@observer
class BuildTxtModal extends Component {
    static defaultProps = {
        text: null,
        onSuccess: (file) => {},
        onFail: () => {},
        afterClose: () => {}
    };

    @observable visible = true;
    text = this.props.text;
    fileNameWithoutExt = "text-" + moment().format("YYYYMMDDTHHmmss");
    fileName = this.fileNameWithoutExt + ".txt";

    render = () => {
        return <Modal
            className="build-txt-modal"
            title="Upload Text"
            width={800}
            maskClosable={false}
            visible={this.visible}
            okText="Upload"
            onOk={e => {
                this.visible = false;
                this.props.onSuccess(new File([this.text], this.fileName));
            }}
            onCancel={e => {
                this.visible = false;
                this.props.onFail();
            }}
            afterClose={() => this.props.afterClose()}
        >
            <Input.TextArea style={{resize: "none"}} rows={15} defaultValue={this.text}
                            onChange={e => this.text = e.target.value}/>
            <Form layout="inline" style={{marginTop: "20px"}}>
                <Form.Item label="File Name">
                    <Input
                        style={{width: "350px"}}
                        addonAfter=".txt"
                        placeholder={this.fileNameWithoutExt}
                        onChange={e => this.fileName = (e.target.value || this.fileNameWithoutExt) + ".txt"}/>
                </Form.Item>
            </Form>
        </Modal>
    };
}