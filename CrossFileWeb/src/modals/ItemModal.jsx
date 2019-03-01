import {Layout, Menu, Input, Icon, Modal, Spin, Button} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import formatBytes from "~/utils/formatBytes";
import FilePreview from "~/components/preview/FilePreview";
import axios from "axios";
import moment from "moment";
import "./ItemModal.less";

@observer
export default class ItemModal extends Component {

    @observable item = {};
    @observable isLoading = false;

    componentDidMount = () => {
        this.isLoading = true;
        axios.get("/api/item/" + this.props.params.itemId).then((response) => {
            this.item = response.data;
            this.isLoading = false;
        });
    };

    render = () => {
        return <Modal
            visible={true}
            closable={false}
            className="item-modal"
            width={800}
            footer={null}
            onCancel={e => this.props.router.push("/space/" + this.props.params.spaceName)}
        >
            {this.isLoading ? <div className="loading"><Spin/></div>
                : <div>
                    <div className="preview-container">
                        <FilePreview fileName={this.item.fileName} fileSize={this.item.size}/>
                    </div>
                    <hr/>
                    <div className="name">
                        {this.item.name}
                    </div>
                    <div className="size">
                        {formatBytes(this.item.size)}
                    </div>
                    <div className="insert-time">
                        {moment(this.item.insertTime).format("YYYY-MM-DD HH:mm")}
                    </div>
                    <div className="actions">
                        <Button type="primary">Download</Button>
                        <Button type="danger">Delete</Button>
                    </div>
                </div>}
        </Modal>
    }
}