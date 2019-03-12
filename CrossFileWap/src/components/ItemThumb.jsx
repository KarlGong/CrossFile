import React, {Component} from "react";
import {observer} from "mobx-react";
import path from "path";
import "./ItemThumb.less";
import avi from "~/assets/imgs/file-exts/avi.png";
import csv from "~/assets/imgs/file-exts/csv.png";
import doc from "~/assets/imgs/file-exts/doc.png";
import docx from "~/assets/imgs/file-exts/docx.png";
import exe from "~/assets/imgs/file-exts/exe.png";
import gif from "~/assets/imgs/file-exts/gif.png";
import iso from "~/assets/imgs/file-exts/iso.png";
import jpeg from "~/assets/imgs/file-exts/jpeg.png";
import jpg from "~/assets/imgs/file-exts/jpg.png";
import mov from "~/assets/imgs/file-exts/mov.png";
import mp3 from "~/assets/imgs/file-exts/mp3.png";
import mp4 from "~/assets/imgs/file-exts/mp4.png";
import pdf from "~/assets/imgs/file-exts/pdf.png";
import png from "~/assets/imgs/file-exts/png.png";
import ppt from "~/assets/imgs/file-exts/ppt.png";
import pptx from "~/assets/imgs/file-exts/pptx.png";
import txt from "~/assets/imgs/file-exts/txt.png";
import wmv from "~/assets/imgs/file-exts/wmv.png";
import xls from "~/assets/imgs/file-exts/xls.png";
import xlsx from "~/assets/imgs/file-exts/xlsx.png";
import zip from "~/assets/imgs/file-exts/zip.png";
import file from "~/assets/imgs/file-exts/file.png";

// font: Source Code Pro Semibold, 13

let extMap = {
    ".avi": avi,
    ".csv": csv,
    ".doc": doc,
    ".docx": docx,
    ".exe": exe,
    ".gif": gif,
    ".iso": iso,
    ".jpeg": jpeg,
    ".jpg": jpg,
    ".mov": mov,
    ".mp3": mp3,
    ".mp4": mp4,
    ".pdf": pdf,
    ".png": png,
    ".ppt": ppt,
    ".pptx": pptx,
    ".txt": txt,
    ".wmv": wmv,
    ".xls": xls,
    ".xlsx": xlsx,
    ".zip": zip
};


@observer
export default class ItemThumb extends Component {
    static defaultProps = {
        item: {}
    };

    constructor(props) {
        super(props);
        this.fileExt = path.extname(this.props.item.fileName).toLowerCase();
    }

    render = () => {
        if (this.props.item.thumbFileName) {
            return <div className="item-thumb">
                <img src={"/api/file/" + this.props.item.thumbFileName} alt={this.props.item.thumbFileName}/>
            </div>
        }

        let icon = extMap[this.fileExt];
        if (icon) {
            return <div className="item-thumb">
                <img src={icon} alt={this.fileExt}/>
            </div>
        }

        return <div className="item-thumb">
            <img src={file} alt={this.fileExt}/>
            <div className="ext">{this.fileExt.replace(".", "")}</div>
        </div>
    }
}