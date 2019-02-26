import {NavBar, Icon, Modal, PullToRefresh, ListView, List, ActivityIndicator, SwipeAction} from "antd-mobile";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import openUploadModal from "~/modals/uploadModal";
import formatBytes from "~/utils/formatBytes";
import moment from "moment";
import "./SpacePage.less";

@observer
export default class SpacePage extends Component {

    spaceName = this.props.params.spaceName;
    @observable isRefreshing = false;
    @observable isLoading = false;
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
                rightContent={
                    <span onClick={e => this.inputOpenFileRef.current.click()}>+</span>
                }
            >{this.spaceName}</NavBar>

            <ListView
                className="list"
                dataSource={this.listViewDataSource}
                renderFooter={() => {
                    if (!this.isRefreshing && !this.items.length) {
                        return <div style={{padding: "30px", textAlign: "center"}}>No items</div>;
                    }
                    if (this.isLoading) {
                        return <div style={{padding: "30px", textAlign: "center"}}><ActivityIndicator animating/></div>
                    }
                }}
                renderRow={(rowData, sectionID, rowID) => {
                    return <SwipeAction
                        autoClose
                        right={[
                            {
                                text: "Delete",
                                onPress: () => {
                                    axios.delete("/api/item/" + rowData.id).then(
                                        response => {
                                            this.items = this.items.filter(item => item.id !== rowData.id);
                                            this.listViewDataSource = this.listViewDataSource.cloneWithRows(this.items);
                                        });
                                },
                                className: "delete-button"
                            },
                        ]}
                    >
                        <List.Item
                            key={rowID}
                            thumb={<div className="thumb">{rowData.fileName.split(".").pop()}</div>}
                            multipleLine
                            onClick={() => {}}
                        >
                            {rowData.name}
                            <List.Item.Brief>
                                {formatBytes(rowData.size)}
                                <span className="insert-time">
                                {moment().diff(moment(rowData.insertTime)) > 7 * 24 * 60 * 60 * 1000 ?
                                    moment(rowData.insertTime).format("YYYY-MM-DD HH:mm")
                                    : moment(rowData.insertTime).fromNow()}
                                </span>
                            </List.Item.Brief>
                        </List.Item>
                    </SwipeAction>
                }}
                useBodyScroll
                pullToRefresh={
                    <PullToRefresh
                        indicator={{activate: "release to refresh", deactivate: "pull to refresh", finish: "refreshed"}}
                        refreshing={this.isRefreshing}
                        onRefresh={this.refresh}
                    />}
                onEndReached={this.onEndReached}
                pageSize={10}
            />
        </div>
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
        this.isRefreshing = true;
        axios.get("/api/space/" + this.spaceName)
            .then(response => {
                this.items = response.data;
                this.listViewDataSource = this.listViewDataSource.cloneWithRows(this.items);
            }).finally(() => this.isRefreshing = false);
    };

    loadMore = () => {

    }
}