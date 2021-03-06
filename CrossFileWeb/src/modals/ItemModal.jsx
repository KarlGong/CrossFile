import {Layout, Menu, Input, Icon, Modal, Spin, Button, Popconfirm, message, Popover} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import formatBytes from "~/utils/formatBytes";
import FilePreview from "~/components/preview/FilePreview";
import ItemThumb from "~/components/ItemThumb";
import axios from "axios";
import moment from "moment";
import QRCode from "qrcode.react";
import event from "~/utils/event";
import "./ItemModal.less";

@observer
export default class ItemModal extends Component {

    @observable item = {};
    @observable isVisible = true;
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
            visible={this.isVisible}
            title={this.props.params.spaceName + " / " + (this.item.name || "")}
            className="item-modal"
            maskClosable={false}
            width={800}
            footer={null}
            afterClose={e => this.props.router.push("/space/" + this.props.params.spaceName)}
            onCancel={e => this.isVisible = false}
        >
            {this.isLoading ? <div className="loading"><Spin/></div>
                : <div>
                    <div className="preview-container">
                        <FilePreview fileName={this.item.fileName} fileExt={this.item.extension} fileSize={this.item.size}/>
                    </div>
                    <hr/>
                    <div className="info">
                        <div className="icon">
                            <ItemThumb item={this.item}/>
                        </div>
                        <div className="detail">
                            <div className="name">
                                {this.item.name}
                            </div>
                            <div className="size">
                                {formatBytes(this.item.size)}
                            </div>
                            <div className="insert-time">
                                {moment(this.item.insertTime).format("YYYY-MM-DD HH:mm")}
                            </div>
                        </div>
                    </div>
                    <div className="actions">
                        <Popover content={<QRCode value={window.location.href}/>}>
                            <Icon type="qrcode" />
                        </Popover>
                        <a href={"/api/file/" + this.item.fileName + "?name=" + this.item.name}>
                            <Button type="primary">Download</Button>
                        </a>
                        <Popconfirm title="Delete?" okText="Yes" cancelText="No" okType="danger"
                                    onConfirm={e => {
                                        axios.delete("/api/item/" + this.item.id).then(
                                            response => {
                                                this.isVisible = false;
                                                event.emit("item-deleted", this.item);
                                                message.success("Item is deleted successfully!", 2);
                                            });
                                    }}>
                            <Button type="danger">Delete</Button>
                        </Popconfirm>
                    </div>
                </div>}
        </Modal>
    }
}