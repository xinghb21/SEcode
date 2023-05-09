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


interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
}


interface AsyncTask{
    id:number,
    preson:string,
    type:number,
    time:string,
    state:number,
    fileurl:string,
}

const accessKeyId = "LTAI5tCj3A8UM1Lhoo5Frcmh";
const accessSecret = "UWGiKrBHzUaXUKnSEQOSci18rwn2YG";
const policyText = {
    "expiration": "2028-01-01T12:00:00.000Z", // 设置该Policy的失效时间，
    "conditions": [
        ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
    ]
};
const policyBase64 = Base64.encode(JSON.stringify(policyText));
const bytes = CryptoJS.HmacSHA1(policyBase64, accessSecret, { asBytes: true });

const client = new OSS({
    region: "oss-cn-beijing",
    accessKeyId: accessKeyId,
    accessKeySecret: accessSecret,
    bucket: "asynctask",
});

const Asyncbd = () => {
    const [clicktime,setclicktime] = useState<number>(0);
    const [isTBD, setTBD] = useState(false);//true即有待办任务，false相反
    const [dopen, setDOpen] = useState(false);//是否打开任务中心
    const [tasklist,settasklist] = useState<AsyncTask[]>([]);
    const showDrawer = () => {
        setclicktime(clicktime+1);
        setDOpen(true);
    };
    const onClose = () => {
        setDOpen(false);
    };
    useEffect((() => {
        //获取任务
        request("/api/async/getalivetasks", "GET")
            .then((res) => {
                let tasks:AsyncTask[] = res.info;
                if(tasks){
                    tasks = tasks.filter((obj)=>{return obj.state != 4;});
                    if(tasks){
                        settasklist(tasks);
                        setTBD(true);
                    }
                }
            }).catch((err) => {
                message.warning(err.message);
            });
    }), [clicktime]);
    const handleover=()=>{
        setclicktime(clicktime+1);
    };
    const handledownload=(fileroot:string)=>{
        let url = client.signatureUrl(fileroot);
        var eleLink = document.createElement("a");
        eleLink.download = url;
        eleLink.style.display = "none";
        //字符内容转变成blob地址
        eleLink.href = url;
        //触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        //然后移除
        document.body.removeChild(eleLink);
    };
    return (
        <>
            <ProList<AsyncTask>
                pagination={{
                    pageSize: 8,
                }}
                metas={{
                    title: {dataIndex:"id",},
                    description: {
                        render: (_,row) => {
                            return (
                                <div>
                                    <Tag color={row.type==0?"green":"blue"}>{row.type==0?"异步导入":"异步导出"}</Tag>
                                    <p>    Happen at:{moment(row.time,"X").format("YYYY-MM-DD-HH:mm:ss")}</p>
                                </div>    
                            );
                        },
                    },
                    actions: {
                        render: (_, row) => {
                            return (
                                (row.state==2||row.state==3)?<Processbar taskid={row.id}onover={handleover} ></Processbar>:( row.state==1?<Progress percent={100} type="circle" />:<Progress percent={10} type="circle" status="exception" />)
                            );
                        },
                    },
                    extra :{
                        render:(_,row)=>{
                            return (
                                (row.state==2||row.state==3)?<Button color="yellow">正在导出</Button>:(row.state==1?<Button color="green" onClick={()=>{handledownload(row.fileurl);}} >下载</Button>:<Button color="red">失败</Button>)
                            );
                        }
                    },    
                }}
                rowKey="key"
                headerTitle="业务实体内异步导入导出任务"
                dataSource={tasklist}
            />
        </>
    );
};
export default Asyncbd;
