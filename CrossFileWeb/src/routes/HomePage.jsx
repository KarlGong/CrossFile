import {Form, Input, Button} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import Validator from "~/utils/Validator";
import guid from "~/utils/guid";
import global from "~/global";
import logo from "~/assets/imgs/logo.png";
import "./HomePage.less";

@observer
export default class HomePage extends Component {

    @observable spaceName = "";

    validator = new Validator(this, {
        spaceName: (rule, value, callback, source, options) => {
            let errors = [];
            if (!value.length) {
                errors.push(new Error("Cannot be empty"));
            }
            if (!/^[a-zA-Z0-9]+?$/.test(value)) {
                errors.push(new Error("Only alphanumeric characters"))
            }
            callback(errors);
        }
    });

    render = () => {
        return <div className="home-page">
            <div className="logo">
                <img src={logo} alt="logo"/>
            </div>
            <div className="form">
                <Form>
                    <Form.Item validateStatus={this.validator.getResult("spaceName").status}
                               help={this.validator.getResult("spaceName").message}>
                        <Input
                            placeholder="Enter a space name"
                            size="large"
                            autoFocus
                            onChange={e => {
                                this.spaceName = e.target.value;
                                this.validator.resetResult("spaceName");
                                this.validator.validate("spaceName");
                            }}
                            onPressEnter={e => this.validator.getResult("spaceName").status === "success"
                                && this.props.router.push("/space/" + this.spaceName)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            style={{width: "100%"}}
                            type="primary"
                            size="large"
                            disabled={this.validator.getResult("spaceName").status !== "success"}
                            onClick={e => this.props.router.push("/space/" + this.spaceName)}
                        >CROSS</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>;
    };


}
