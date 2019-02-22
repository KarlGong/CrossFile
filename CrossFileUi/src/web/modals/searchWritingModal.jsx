import {Layout, Menu, Input, Icon, Modal, Form, Select, Button, Table} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import {render, unmountComponentAtNode} from "react-dom";
import moment from "moment";
import axios from "axios";
import Validator from "../../shared/utils/Validator";
import {envRequest} from "../global";

export default function openSearchWritingModal(defaultDataStore, onSuccess) {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(<SelectWritingModal defaultDataStore={defaultDataStore} onSuccess={onSuccess} afterClose={() => {
        unmountComponentAtNode(target);
        target.remove();
    }}/>, target);
}

@observer
class SelectWritingModal extends Component {
    static defaultProps = {
        defaultDataStore: "us",
        onSuccess: (writingId, dataStore) => {
        },
        afterClose: () => {
        }
    };

    studentId = "0";
    dataStore = this.props.defaultDataStore;
    @observable writings = [];
    @observable visible = true;
    @observable loading = false;

    validator = new Validator(this, {
        studentId: (rule, value, callback, source, options) => {
            let errors = [];
            if (!value) {
                errors.push(new Error("Student id is required"));
            }
            callback(errors);
        }
    });

    render = () => {
        return <Modal
            className="search-writing-modal"
            title="Search Writing"
            visible={this.visible}
            maskClosable={false}
            footer={null}
            width={800}
            onCancel={() => this.visible = false}
            afterClose={() => this.props.afterClose()}
        >
            <div>
                <Form>
                    <Form.Item labelCol={{span: 3}} wrapperCol={{span: 21}} label="Student Id"
                               validateStatus={this.validator.getResult("studentId").status}
                               help={this.validator.getResult("studentId").message}
                    >
                        <Input.Group style={{width: "auto", top: "-2px"}} compact>
                            <Select defaultValue={this.dataStore} onChange={value => this.dataStore = value}>
                                <Select.Option value="us">US</Select.Option>
                                <Select.Option value="cn">CN</Select.Option>
                            </Select>
                            <Input
                                style={{width: "200px"}}
                                defaultValue={this.studentId}
                                onChange={e => {
                                    this.studentId = e.target.value;
                                    this.validator.resetResult("studentId");
                                }}
                                onBlur={() => this.validator.validate("studentId")}
                            >
                            </Input>
                        </Input.Group>
                        <Button style={{marginLeft: "30px"}} type="primary" loading={this.loading}
                                onClick={this.searchWriting}>Search</Button>
                    </Form.Item>
                </Form>
                <Table dataSource={toJS(this.writings)} rowKey={record => record.writingId} size="middle" pagination>
                    <Table.Column title="Writing Id" dataIndex="writingId"/>
                    <Table.Column title="Level Code" dataIndex="levelCode"/>
                    <Table.Column title="Submit Time (Local Timezone)" dataIndex="submitTime" render={(text, record) =>
                        <span>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</span>
                    }/>
                    <Table.Column title="Status" dataIndex="statusCode"/>
                    <Table.Column title="Action" key="action" render={(text, record) =>
                        ["Allocated", "New"].indexOf(record.statusCode) !== -1 ?
                        <Button size="small" type="primary" onClick={e =>
                            this.selectWriting(record.writingId)}>Select</Button>: null
                    }/>
                </Table>
            </div>
        </Modal>;
    };

    searchWriting = () => {
        this.validator.validateAll().then(() => {
            this.loading = true;
            return envRequest.get("/axis/api/v2/writing", {
                params: {
                    "param": {
                        "studentId": this.studentId
                    }
                },
                dataStore: this.dataStore
            });
        }).then(res => {
            this.writings = res.data;
        }).finally(() => this.loading = false);
    };

    selectWriting = (writingId) => {
        this.visible = false;
        this.props.onSuccess(writingId, this.dataStore);
    };
}