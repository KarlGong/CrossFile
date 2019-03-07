import {Button, WhiteSpace, WingBlank, InputItem, Toast} from "antd-mobile";
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
                errors.push(new Error("Space Name is required"));
            }
            if (!/^[a-zA-Z0-9]+?$/.test(value)) {
                errors.push(new Error("Space Name can only contain alphanumeric characters."))
            }
            callback(errors);
        }
    });

    render = () => {
        return <div className="home-page">
            <img className="logo" src={logo} alt="logo"/>
            <div className="form">
                <WingBlank>
                    <InputItem
                        placeholder="Enter a space name"
                        onChange={value => {
                            this.spaceName = value;
                            this.validator.resetResult("spaceName");
                            this.validator.validate("spaceName");
                        }}
                        error={this.validator.getResult("spaceName").status === "error"}
                        onErrorClick={e => Toast.info(this.validator.getResult("spaceName").message, 2, undefined, false)}
                    />
                </WingBlank>
                <WhiteSpace size="lg"/>
                <WingBlank>
                    <Button
                        type="primary"
                        disabled={this.validator.getResult("spaceName").status !== "success"}
                        onClick={e => this.props.router.push("/space/" + this.spaceName)}
                    >CROSS</Button>
                </WingBlank>
            </div>
        </div>;
    };


}