import {NavBar, Icon, Modal, PullToRefresh, ListView, List, Popover, InputItem, Button, Flex, Toast, ActivityIndicator} from "antd-mobile";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import formatBytes from "~/utils/formatBytes";
import moment from "moment";
import FilePreview from "~/components/preview/FilePreview";
import qrCodeIcon from "~/assets/icons/qrcode.svg";
import QRCode from "qrcode.react";
import cs from "classnames";
import "./ItemPage.less";

@observer
export default class ItemPage extends Component {

    spaceName = this.props.params.spaceName;
    itemId = this.props.params.itemId;
    @observable isLoaded = false;
    @observable item = {};
    @observable showQRCode = false;

    componentDidMount = () => {
        axios.get("/api/item/" + this.itemId).then((response) => {
            this.item = response.data;
            this.isLoaded = true;
        });
    };

    render = () => {
        return <div className="item-page">
            {this.isLoaded ?
                <div className="container">
                    <div className="preview-container">
                        <FilePreview fileName={this.item.fileName} fileSize={this.item.size}/>
                        <div className={cs("qrcode", {hidden: !this.showQRCode})} onClick={e => this.showQRCode = false}>
                            <QRCode value={window.location.href} size={256}/>
                        </div>
                        <div className="qrcode-icon" onClick={e => this.showQRCode = true}>
                            <img src={qrCodeIcon}/>
                        </div>
                    </div>
                    <List>
                        <List.Item>
                            <InputItem defaultValue={this.item.name} editable={false}>Name</InputItem>
                            <InputItem defaultValue={formatBytes(this.item.size)} editable={false}>Size</InputItem>
                            <InputItem defaultValue={moment(this.item.insertTime).format("YYYY-MM-DD HH:mm")} editable={false}>Upload At</InputItem>
                            <Flex style={{padding: "15px 0 10px"}}>
                                <Flex.Item>
                                    <Button type="ghost" icon="left" size="small" onClick={() => this.props.router.push("/space/" + this.spaceName)}>Back</Button>
                                </Flex.Item>
                                <Flex.Item>
                                    <a href={"/api/file/" + this.item.fileName + "?name=" + this.item.name}>
                                        <Button type="primary" size="small">Download</Button>
                                    </a>
                                </Flex.Item>
                                <Flex.Item>
                                    <Button type="warning" size="small" onClick={this.handleDelete}>Delete</Button>
                                </Flex.Item>
                            </Flex>
                        </List.Item>
                    </List>
                </div>
                : <div className="loading"><ActivityIndicator size="large"/></div>
            }
        </div>
    };

    handleDelete = () => {
        Modal.alert("Delete", "Are you sure?", [
            {text: "No", onPress: () => {}},
            {
                text: "Yes", onPress: () => {
                    axios.delete("/api/item/" + this.item.id).then(
                        response => {
                            Toast.success("Deleted successfully!", 2, () => this.props.router.push("/space/" + this.spaceName));
                        });
                }
            },
        ]);
    }
}