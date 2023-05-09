import React, { useEffect, useState } from "react";
import { Drawer, Space, Button, Table, Tag, message, Modal, Input, Select, Progress } from "antd";
import type { ColumnsType } from "antd/es/table";
import { request } from "../../utils/network";
import {
    CarryOutTwoTone,
} from "@ant-design/icons";

import { Badge, Tooltip } from "antd";
import { ProList } from "@ant-design/pro-components";
import moment from "moment";
import Processbar from "../../pages/user/asyncdeal/processbar";
import OSS from "ali-oss";
import CryptoJS from "crypto-js";
import Base64 from "base-64";

interface buttonprop {
    taskid:number,
}

const Redobutton = (props:buttonprop)=>{
    const [ifloading,setloading] = useState<boolean>(false);
    const handleredo=()=>{
        setloading(true);
        request("/api/async/restarttask","POST",{taskid:props.taskid})
            .then((res)=>{
                message.success("执行成功，请前往任务中心下载文件");
                setloading(false);
            })
            .catch((err)=>{
                message.warning(err.message);
                setloading(false);
            });
        message.success("开始执行导出任务，请前往任务中心查看进度");
    };
    return (
        <div>
            <Button color="red" onClick={handleredo} loading={ifloading} >
                重新执行
            </Button>
        </div>
    );
};

export default Redobutton;