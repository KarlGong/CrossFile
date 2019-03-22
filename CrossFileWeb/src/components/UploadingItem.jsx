import {Layout, Menu, Input, Icon, Progress, Popconfirm, Button, message} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import axios from "axios";
import ItemThumb from "~/components/ItemThumb";
import event from "~/utils/event";
import formatBytes from "~/utils/formatBytes";
import "./UploadingItem.less";

@observer
export default class UploadingItem extends Component {
    static defaultProps = {
        item: {}
    };

    item = this.props.item;
    cancelSource = axios.CancelToken.source();
    @observable uploadLoaded = 0;
    @observable uploadTotal = 0;
    @observable uploadPercentage = 0;

    componentDidMount =() => {
        let formData = new FormData();
        formData.append(this.item.name, this.item.file);
        axios.post("/api/space/" + this.item.spaceName, formData,
            {
                headers: {"Content-Type": "multipart/form-data"},
                cancelToken: this.cancelSource.token,
                onUploadProgress: (event) => {
                    if (event.lengthComputable) {
                        this.uploadLoaded = event.loaded;
                        this.uploadTotal = event.total;
                        this.uploadPercentage = +(event.loaded * 100 / event.total).toFixed(1);
                    }
                }
            }
        ).then(response => {
            event.emit("item-uploaded", this.item, response.data);
            message.success("Uploaded successfully!", 2);
        });
    };

    render = () => {
        return <div className="uploading-item">
            <div className="icon"><ItemThumb item={this.item}/></div>
            <div className="name" title={this.item.name}>{this.item.name}</div>
            <div className="sub-text">
                {`${formatBytes(this.uploadLoaded)} / ${formatBytes(this.uploadTotal)}`}
            </div>
            <Progress className="progress" percent={this.uploadPercentage}/>
            <div className="actions">
                <div/>
                <Popconfirm title="Cancel uploading?" okText="Yes" cancelText="No" okType="danger"
                            onConfirm={e => {
                                event.emit("item-uploading-cancelled", this.item);
                                this.cancelSource.cancel("Uploading cancelled!");
                            }}>
                    <Button type="danger" size="small" icon="close" shape="circle"/>
                </Popconfirm>
            </div>
        </div>
    }
}