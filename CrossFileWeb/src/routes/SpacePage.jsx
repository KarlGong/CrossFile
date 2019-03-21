import {Layout, List, Card, Button, Popconfirm, message, Icon, Upload, Progress} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import formatBytes from "~/utils/formatBytes";
import ItemThumb from "~/components/ItemThumb";
import moment from "moment";
import logo from "~/assets/imgs/logo-v.png";
import guid from "~/utils/guid";
import openPasteTextModal from "~/modals/pasteTextModal";
import event from "~/utils/event";
import "./SpacePage.less";


@observer
export default class SpacePage extends Component {

    spaceName = this.props.params.spaceName;
    @observable isRefreshing = false;
    @observable isLoadingMore = false;
    @observable isLoadedToEnd = false;
    @observable items = [];
    fixItems = [{type: "dragger", id: guid()}];
    uploadingItems = [];
    loadedItems = [];
    eventDisposers = [];

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.eventDisposers.push(event.on("item-deleted", item => {
            this.loadedItems = this.loadedItems.filter(i => i.id !== item.id);
            this.items = this.fixItems.concat(this.uploadingItems).concat(this.loadedItems);
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
                               openPasteTextModal(e.clipboardData.getData("text/plain"), file => this.uploadFile(file))
                           }
                       }}>
            <Layout.Header className="header">
                <div onClick={e => this.props.router.push("/")} className="logo"><img src={logo} alt="logo"/></div>
                <div className="title">{"/ " + this.spaceName}</div>
            </Layout.Header>
            <Layout.Content className="content">
                <List
                    loading={this.isRefreshing}
                    loadMore={!this.isLoadedToEnd && !this.isRefreshing ? <div className="load-more">
                        <Button onClick={this.loadMore} loading={this.isLoadingMore}>load more</Button>
                    </div> : null}
                    dataSource={this.items}
                    renderItem={item => {
                        if (item.type === "dragger") {
                            return <div
                                key={item.id}
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
                        } else if (item.type === "uploading") {
                            return <div key={item.id} className="item">
                                <div className="icon" key={item.id}><ItemThumb item={item}/></div>
                                <div className="name" title={item.fileName}>{item.fileName}</div>
                                <div className="sub-text">
                                    {`${formatBytes(item.uploadLoaded)} / ${formatBytes(item.uploadTotal)}`}
                                </div>
                                <Progress className="progress" percent={item.uploadPercentage}/>
                                <div className="actions">
                                    <div/>
                                    <Popconfirm title="Cancel uploading?" okText="Yes" cancelText="No" okType="danger"
                                                onConfirm={e => {
                                                    item.cancelSource.cancel("Uploading cancelled!");
                                                    this.uploadingItems = this.uploadingItems.filter(i => i.id !== item.id);
                                                    this.items = this.fixItems.concat(this.uploadingItems).concat(this.loadedItems);
                                                }}>
                                        <Button type="danger" size="small" icon="close" shape="circle"/>
                                    </Popconfirm>
                                </div>
                            </div>
                        } else {
                            return <div key={item.id} className="item">
                                <div className="icon" key={item.id} onClick={e =>
                                    this.props.router.push("/space/" + this.spaceName + "/item/" + item.id)}>
                                    <ItemThumb item={item}/>
                                </div>
                                <div className="name" title={item.name}>{item.name}</div>
                                <div className="sub-text">{formatBytes(item.size)}</div>
                                <div className="sub-text">
                                    {moment().diff(moment(item.insertTime)) > 7 * 24 * 60 * 60 * 1000 ?
                                        moment(item.insertTime).format("YYYY-MM-DD HH:mm")
                                        : moment(item.insertTime).fromNow()}
                                </div>
                                <div className="actions">
                                    <a href={"/api/file/" + item.fileName + "?name=" + item.name}>
                                        <Button type="primary" size="small" icon="download" shape="circle"/>
                                    </a>
                                    <Popconfirm title="Delete?" okText="Yes" cancelText="No" okType="danger"
                                                onConfirm={e => {
                                                    axios.delete("/api/item/" + item.id).then(
                                                        response => {
                                                            this.loadedItems = this.loadedItems.filter(i => i.id !== item.id);
                                                            this.items = this.fixItems.concat(this.uploadingItems).concat(this.loadedItems);
                                                            message.success("Item is deleted successfully!", 2);
                                                        });
                                                }}>
                                        <Button type="danger" size="small" icon="delete" shape="circle"/>
                                    </Popconfirm>
                                </div>
                            </div>
                        }
                    }}
                />
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
            type: "uploading",
            fileName: file.name,
            size: file.size,
            cancelSource: axios.CancelToken.source(),
            uploadLoaded: 0,
            uploadTotal: 0,
            uploadPercentage: 0
        };
        this.uploadingItems.unshift(uploadingItem);
        this.items = this.fixItems.concat(this.uploadingItems).concat(this.loadedItems);

        let formData = new FormData();
        formData.append(file.name, file);
        axios.post("/api/space/" + this.spaceName, formData,
            {
                headers: {"Content-Type": "multipart/form-data"},
                cancelToken: uploadingItem.cancelSource.token,
                onUploadProgress: (event) => {
                    if (event.lengthComputable) {
                        uploadingItem.uploadLoaded = event.loaded;
                        uploadingItem.uploadTotal = event.total;
                        uploadingItem.uploadPercentage = +(event.loaded * 100 / event.total).toFixed(1);
                        this.items = this.fixItems.concat(this.uploadingItems).concat(this.loadedItems);
                    }
                }
            }
        ).then(response => {
            message.success("Uploaded successfully!", 2);
            this.uploadingItems = this.uploadingItems.filter(i => i.id !== uploadingItem.id);
            this.loadedItems.unshift(response.data);
            this.items = this.fixItems.concat(this.uploadingItems).concat(this.loadedItems);
        });
    };

    refresh = () => {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            axios.get("/api/space/" + this.spaceName, {params: {size: 20}})
                .then(response => {
                    this.loadedItems = response.data;
                    this.items = this.fixItems.concat(this.uploadingItems).concat(this.loadedItems);
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
                    fromId: this.loadedItems[this.loadedItems.length - 1].id
                }
            })
                .then(response => {
                    this.loadedItems = this.loadedItems.concat(response.data);
                    this.items = this.fixItems.concat(this.uploadingItems).concat(this.loadedItems);
                    this.isLoadedToEnd = response.data.length < 20;
                }).finally(() => this.isLoadingMore = false);
        }
    }
}