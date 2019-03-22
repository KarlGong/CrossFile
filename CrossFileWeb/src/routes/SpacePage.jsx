import {Layout, List, Card, Button, Popconfirm, message, Icon, Upload, Spin} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import logo from "~/assets/imgs/logo-v.png";
import guid from "~/utils/guid";
import openBuildTxtModal from "~/modals/buildTxtModal";
import openBuildPngModal from "~/modals/buildPngModal";
import UploadingItem from "~/components/UploadingItem";
import Item from "~/components/Item";
import event from "~/utils/event";
import "./SpacePage.less";


@observer
export default class SpacePage extends Component {

    spaceName = this.props.params.spaceName;
    @observable isRefreshing = false;
    @observable isLoadingMore = false;
    @observable isLoadedToEnd = false;
    @observable items = [];
    @observable uploadingItems = [];
    eventDisposers = [];

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.eventDisposers.push(event.on("item-deleted", item => {
            this.items = this.items.filter(i => i.id !== item.id);
        }));
        this.eventDisposers.push(event.on("item-uploaded", (uploadingItem, item) => {
            this.uploadingItems = this.uploadingItems.filter(i => i.id !== uploadingItem.id);
            this.items.unshift(item);
        }));
        this.eventDisposers.push(event.on("item-uploading-cancelled", uploadingItem => {
            this.uploadingItems = this.uploadingItems.filter(i => i.id !== uploadingItem.id);
        }));
        this.refresh();
    }

    componentWillUnMount = () => {
        this.eventDisposers.map((disposer) => disposer());
    };

    render = () => {
        return <Layout className="space-page"
                       onPaste={e => {
                           if (e.clipboardData.types.includes("text/plain")) {
                               openBuildTxtModal(e.clipboardData.getData("text/plain"), file => this.uploadFile(file));
                           } else if (e.clipboardData.types.includes("Files")) {
                               openBuildPngModal(e.clipboardData.files[0], file => this.uploadFile(file));
                           }
                       }}>
            <Layout.Header className="header">
                <div onClick={e => this.props.router.push("/")} className="logo"><img src={logo} alt="logo"/></div>
                <div className="title">{"/ " + this.spaceName}</div>
                <div className="tip">Try: <div className="key">Ctrl</div> + <div className="key">v</div></div>
            </Layout.Header>
            <Layout.Content className="content">
                <Spin spinning={this.isRefreshing}>
                    <div className="list">
                        <div
                            className="dragger-item"
                            onDragOver={e => {
                                if (!e.dataTransfer.types.includes("Files")) {
                                    e.dataTransfer.dropEffect = "none";
                                }
                                e.stopPropagation();
                            }}>
                            <Upload.Dragger
                                multiple
                                showUploadList={false}
                                customRequest={e => this.uploadFile(e.file)}
                            >
                                <p className="ant-upload-drag-icon">
                                    <Icon type="plus"/>
                                </p>
                                <p>Click or drag files to this area to upload</p>
                            </Upload.Dragger>
                        </div>
                        {this.uploadingItems.map(i => <UploadingItem key={i.id} item={i}/>)}
                        {this.items.map(i => <Item key={i.id} item={i}/>)}
                    </div>
                    {!this.isLoadedToEnd && !this.isRefreshing ? <div className="load-more">
                        <Button onClick={this.loadMore} loading={this.isLoadingMore}>load more</Button>
                    </div> : null}
                </Spin>
            </Layout.Content>
            <div className="refresh">
                <Button icon="reload" size="large" shape="circle" type="primary" onClick={this.refresh}/>
            </div>
            {this.props.children}
        </Layout>
    };

    uploadFile = (file) => {
        if (file.size > 2 * 1024 * 1024 * 1024) {
            message.error("Cannot upload file larger than 2GB.", 2);
            return;
        }

        let uploadingItem = {
            id: guid(),
            spaceName: this.spaceName,
            name: file.name,
            size: file.size,
            file: file
        };
        this.uploadingItems.unshift(uploadingItem);
    };

    refresh = () => {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            axios.get("/api/space/" + this.spaceName, {params: {size: 20}})
                .then(response => {
                    this.items = response.data;
                    this.isLoadedToEnd = response.data.length < 20;
                }).finally(() => this.isRefreshing = false);
        }
    };

    loadMore = () => {
        if (!this.isLoadedToEnd && !this.isLoadingMore) {
            this.isLoadingMore = true;
            axios.get("/api/space/" + this.spaceName, {
                params: {
                    size: 20,
                    fromId: this.items[this.items.length - 1].id
                }
            })
                .then(response => {
                    this.items = this.items.concat(response.data);
                    this.isLoadedToEnd = response.data.length < 20;
                }).finally(() => this.isLoadingMore = false);
        }
    }
}