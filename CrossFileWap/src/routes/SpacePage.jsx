import {NavBar, Icon, Modal, PullToRefresh, ListView, List, ActivityIndicator} from "antd-mobile";
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
                renderFooter={() => (<div style={{padding: 30, textAlign: "center"}}>
                    {this.isLoading ? <ActivityIndicator animating/> : null}
                </div>)}
                renderRow={(rowData, sectionID, rowID) => {
                    return <List.Item
                        key={rowID}
                        thumb={<div className="thumb">{rowData.fileName.split(".").pop()}</div>}
                        multipleLine
                        onClick={() => {}}
                    >
                        {rowData.name}
                        <List.Item.Brief>
                            {formatBytes(rowData.size)}
                            <span style={{float: "right"}}>
                                {moment().diff(moment(rowData.insertTime)) > 7 * 24 * 60 * 60 * 1000 ?
                                    moment(rowData.insertTime).format("YYYY-MM-DD HH:mm")
                                    : moment(rowData.insertTime).fromNow()}
                            </span>
                        </List.Item.Brief>
                    </List.Item>
                }}
                renderSeparator={(sectionID, rowID) => <div key={rowID}></div>}
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
            openUploadModal(this.spaceName, file, () => {this.refresh()});
        }
        e.target.value = null; // clear the select file.
    };

    refresh = () => {
        this.isRefreshing = true;
        axios.get("/api/space/" + this.spaceName)
            .then(response => this.listViewDataSource = this.listViewDataSource.cloneWithRows(response.data))
            .finally(() => this.isRefreshing = false);
    };

    loadMore = () => {

    }
}