import {NavBar, Icon, Modal, PullToRefresh, ListView, List, ActivityIndicator, InputItem, Button, Flex, Toast} from "antd-mobile";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import formatBytes from "~/utils/formatBytes";
import moment from "moment";
import "./ItemPage.less";
import ItemPreview from "~/components/ItemPreview";

@observer
export default class ItemPage extends Component {

    spaceName = this.props.params.spaceName;
    itemId = this.props.params.itemId;
    @observable isLoaded = false;
    @observable item = {};

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
                        <ItemPreview fileName={this.item.fileName} fileSize={this.item.size} />
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
                                    <a href={"/api/file/" + this.item.fileName}>
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