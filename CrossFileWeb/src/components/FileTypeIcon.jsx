import React, {Component} from "react";
import {observer} from "mobx-react";
import path from "path";
import "./FileTypeIcon.less";
import avi from "~/assets/imgs/filetypes/avi.png";
import csv from "~/assets/imgs/filetypes/csv.png";
import doc from "~/assets/imgs/filetypes/doc.png";
import docx from "~/assets/imgs/filetypes/docx.png";
import exe from "~/assets/imgs/filetypes/exe.png";
import gif from "~/assets/imgs/filetypes/gif.png";
import iso from "~/assets/imgs/filetypes/iso.png";
import jpeg from "~/assets/imgs/filetypes/jpeg.png";
import jpg from "~/assets/imgs/filetypes/jpg.png";
import mov from "~/assets/imgs/filetypes/mov.png";
import mp3 from "~/assets/imgs/filetypes/mp3.png";
import mp4 from "~/assets/imgs/filetypes/mp4.png";
import pdf from "~/assets/imgs/filetypes/pdf.png";
import png from "~/assets/imgs/filetypes/png.png";
import ppt from "~/assets/imgs/filetypes/ppt.png";
import pptx from "~/assets/imgs/filetypes/pptx.png";
import txt from "~/assets/imgs/filetypes/txt.png";
import wmv from "~/assets/imgs/filetypes/wmv.png";
import xls from "~/assets/imgs/filetypes/xls.png";
import xlsx from "~/assets/imgs/filetypes/xlsx.png";
import zip from "~/assets/imgs/filetypes/zip.png";
import file from "~/assets/imgs/filetypes/file.png";

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
export default class FileTypeIcon extends Component {
    static defaultProps = {
        fileName: ""
    };

    constructor(props) {
        super(props);
        this.fileExt = path.extname(this.props.fileName).toLowerCase();
    }

    render = () => {
        let icon = extMap[this.fileExt];
        return <div className="file-type-icon">
            <img src={icon || file} alt={this.fileExt}/>
            {!icon ? <div className="ext">{this.fileExt.replace(".", "")}</div> : null}
        </div>
    }
}