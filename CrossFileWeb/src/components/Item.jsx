import {Layout, Menu, Input, Icon, Button, Popconfirm, message} from "antd";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import EditableText from "~/components/EditableText";
import ItemThumb from "~/components/ItemThumb";
import formatBytes from "~/utils/formatBytes";
import moment from "moment";
import event from "~/utils/event";
import "./Item.less";

@observer
export default class Item extends Component {
    static defaultProps = {
        item: {}
    };

    static contextTypes = {
        router: PropTypes.object
    };

    render = () => {
        return <div className="item">
            <div className="icon" key={this.props.item.id} onClick={e =>
                this.context.router.push("/space/" + this.props.item.spaceName + "/item/" + this.props.item.id)}>
                <ItemThumb item={this.props.item}/>
            </div>
            <EditableText
                className="name"
                defaultText={this.props.item.name}
                onSave={text => axios.patch("/api/item/" + this.props.item.id, {name: text})
                    .then(() => message.success("Rename successfully!", 2))
                }
            />
            <div className="sub-text">{formatBytes(this.props.item.size)}</div>
            <div className="sub-text">
                {moment().diff(moment(this.props.item.insertTime)) > 7 * 24 * 60 * 60 * 1000 ?
                    moment(this.props.item.insertTime).format("YYYY-MM-DD HH:mm")
                    : moment(this.props.item.insertTime).fromNow()}
            </div>
            <div className="actions">
                <a href={"/api/file/" + this.props.item.fileName + "?name=" + this.props.item.name}>
                    <Button type="primary" size="small" icon="download" shape="circle"/>
                </a>
                <Popconfirm title="Delete?" okText="Yes" cancelText="No" okType="danger"
                            onConfirm={e => {
                                axios.delete("/api/item/" + this.props.item.id).then(
                                    response => {
                                        event.emit("item-deleted", this.props.item);
                                        message.success("Item is deleted successfully!", 2);
                                    });
                            }}>
                    <Button type="danger" size="small" icon="delete" shape="circle"/>
                </Popconfirm>
            </div>
        </div>
    }
}
