import {NavBar, Icon, Modal, PullToRefresh, ListView, List, ActivityIndicator, SwipeAction, Toast} from "antd-mobile";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import openUploadModal from "~/modals/uploadModal";
import formatBytes from "~/utils/formatBytes";
import ItemThumb from "~/components/ItemThumb";
import moment from "moment";
import "./SpacePage.less";

@observer
export default class SpacePage extends Component {

    spaceName = this.props.params.spaceName;
    @observable isRefreshing = false;
    @observable isInitLoaded = false;
    @observable isLoadingMore = false;
    @observable isLoadedToEnd = false;
    @observable listViewDataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1.id !== row2.id,
    });
    items = [];

    constructor(props) {
        super(props);
        this.inputOpenFileRef = React.createRef();
    }

    componentDidMount() {
        this.refresh();
    }

    render = () => {
        return <div className="space-page">
            <input ref={this.inputOpenFileRef} type="file" style={{display: "none"}} onChange={this.handleClickUpload}/>
            <NavBar
                mode="light"
                icon={<Icon type="left"/>}
                onLeftClick={() => this.props.router.push("/home")}
                rightContent={<span onClick={e => this.inputOpenFileRef.current.click()} style={{fontSize: "20px"}}>+</span>}
            >{this.spaceName}</NavBar>

            <ListView
                className="list"
                dataSource={this.listViewDataSource}
                renderRow={(item, sectionID, rowID) => {
                    return <SwipeAction
                        right={[
                            {
                                text: "Delete",
                                onPress: () => {
                                    Modal.alert("Delete", "Are you sure?", [
                                        {text: "No", onPress: () => {}},
                                        {
                                            text: "Yes", onPress: () => {
                                                axios.delete("/api/item/" + item.id).then(
                                                    response => {
                                                        this.items = this.items.filter(i => i.id !== item.id);
                                                        this.listViewDataSource = this.listViewDataSource.cloneWithRows(this.items);
                                                        Toast.success("Deleted successfully!", 2, undefined, false);
                                                    });
                                            }
                                        },
                                    ]);
                                },
                                className: "delete-button"
                            },
                        ]}
                    >
                        <List.Item
                            key={item.id}
                            thumb={<div className="thumb"><ItemThumb item={item}/></div>}
                            multipleLine
                            onClick={() => {this.props.router.push("/space/" + this.spaceName + "/item/" + item.id)}}
                        >
                            {item.name}
                            <List.Item.Brief>
                                {formatBytes(item.size)}
                                <span className="insert-time">
                                {moment().diff(moment(item.insertTime)) > 7 * 24 * 60 * 60 * 1000 ?
                                    moment(item.insertTime).format("YYYY-MM-DD HH:mm")
                                    : moment(item.insertTime).fromNow()}
                                </span>
                            </List.Item.Brief>
                        </List.Item>
                    </SwipeAction>
                }}
                pullToRefresh={
                    this.isInitLoaded ?
                        <PullToRefresh
                            indicator={{activate: "release to refresh", deactivate: "pull to refresh", finish: "refreshed"}}
                            refreshing={this.isRefreshing}
                            onRefresh={this.refresh}
                        /> : null}
                onEndReached={this.loadMore}
                onEndReachedThreshold={200}
                pageSize={15}
            >
                <div className="footer">
                    {this.renderListFooter()}
                </div>
            </ListView>
        </div>
    };

    renderListFooter = () => {
        if (this.isInitLoaded) {
            if (this.items.length) {
                if (this.isLoadedToEnd) {
                    return "No more items";
                }
                if (this.isLoadingMore) {
                    return <ActivityIndicator/>;
                }
            } else {
                return "No items";
            }
        } else {
            return <ActivityIndicator/>;
        }
    };

    handleClickUpload = (e) => {
        let file = e.target.files[0];
        if (file) {
            openUploadModal(this.spaceName, file, (item) => {
                this.items = [item].concat(this.items);
                this.listViewDataSource = this.listViewDataSource.cloneWithRows(this.items);
            });
        }
        e.target.value = null; // clear the select file.
    };

    refresh = () => {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            axios.get("/api/space/" + this.spaceName, {params: {size: 15}})
                .then(response => {
                    this.items = response.data;
                    this.listViewDataSource = this.listViewDataSource.cloneWithRows(this.items);
                    this.isLoadedToEnd = response.data.length < 15;
                    if (!this.isInitLoaded) {
                        this.isInitLoaded = true;
                    }
                }).finally(() => this.isRefreshing = false);
        }
    };

    loadMore = () => {
        if (!this.isLoadingMore && !this.isLoadedToEnd && !this.isRefreshing && this.items.length) {
            this.isLoadingMore = true;
            axios.get("/api/space/" + this.spaceName, {params: {size: 15, fromId: this.items[this.items.length - 1].id}})
                .then(response => {
                    this.items = this.items.concat(response.data);
                    this.listViewDataSource = this.listViewDataSource.cloneWithRows(this.items);
                    this.isLoadedToEnd = response.data.length < 15;
                }).finally(() => this.isLoadingMore = false);
        }
    }
}