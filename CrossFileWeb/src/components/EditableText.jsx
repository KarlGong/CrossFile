import {Layout, Menu, Input, Icon} from "antd";
import React, {Component} from "react";
import {observer} from "mobx-react";
import {observable, toJS, untracked, runInAction, action} from "mobx";
import classNames from "classnames";
import "./EditableText.less";

@observer
export default class EditableText extends Component {
    static defaultProps = {
        text: "",
        className: "",
        style: {},
        onSave: (text) => {},
        onCancel: () => {}
    };

    oldText = this.props.text;
    @observable text = this.props.text;
    @observable isEditing = false;

    componentWillReceiveProps(nextProps) {
        this.oldText = nextProps.text;
        this.text = nextProps.text;
    }

    render = () => {
        return <div className={classNames(this.props.className, "editable-text")} style={this.props.style}>
            <div className="text" title={this.text} onDoubleClick={() => this.isEditing = true}>{this.text || "-"}</div>
            {
                this.isEditing &&
                    <Input
                        className="editor"
                        autoFocus
                        size="small"
                        value={this.text}
                        onChange={e => this.text = e.target.value}
                        onBlur={() => {
                            this.isEditing = false;
                            if (this.text) {
                                this.oldText = this.text;
                                this.props.onSave(this.text);
                            } else {
                                this.text = this.oldText;
                                this.props.onCancel();
                            }
                        }}
                        onPressEnter={() => {
                            this.isEditing = false;
                            this.oldText = this.text;
                            this.props.onSave(this.text);
                        }}
                        onKeyUp={e => {
                            if (e.keyCode === 27) {
                                this.isEditing = false;
                                this.text = this.oldText;
                                this.props.onCancel();
                            }
                        }}
                    />
            }
        </div>
    }
}
