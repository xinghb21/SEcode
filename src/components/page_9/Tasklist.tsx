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
import Redobutton from  "./redobutton";

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
    const [tasklist,settasklist] = useState<AsyncTask[]>([]);
    const [outputsuccess,setoutputsuccess] = useState<boolean>(false);
    const [outputfail,setoutputfail] = useState<boolean>(false);
    useEffect((() => {
        //获取任务
        request("/api/async/esgetalltask", "GET")
            .then((res) => {
                let tasks:AsyncTask[] = res.info;
                if(tasks){
                    if(tasks){
                        settasklist(tasks);
                    }
                }
            }).catch((err) => {
                message.warning(err.message);
            });
    }), [clicktime]);
    const handleover=()=>{
        setclicktime(clicktime+1);
    };

    //发送任务导出命令
    const handleoutput = (success:boolean )=>{
        if(success){
            setoutputsuccess(true);
            request("/api/async/getsuccess","POST")
                .then((res)=>{
                    message.success("开始导出，请前往任务中心查看进度");
                    setoutputsuccess(false);
                })
                .catch((err)=>{
                    message.warning("导出失败");
                    setoutputsuccess(false);
                });

        }else{
            setoutputfail(true);
            request("/api/async/getfailed","POST")
                .then((res)=>{
                    message.success("开始导出，请前往任务中心查看进度");
                    setoutputfail(false);
                })
                .catch((err)=>{
                    message.warning("导出失败");
                    setoutputfail(false);
                });

        }
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
                    pageSize: 10,
                }}
                toolBarRender={() => {
                    return [
                        <div key={"tool"}>
                            <Button key="2" type="primary" onClick={()=>{handleoutput(false);}} loading={outputfail}>
                                导出所有失败任务
                            </Button>
                            <Button key="1" onClick={()=>{handleoutput(true);}} loading={outputsuccess} >
                                导出所有成功任务
                            </Button>
                        </div>
                    ];
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
                                (row.state==2||row.state==3)?<Processbar taskid={row.id}onover={handleover} ></Processbar>:( row.state==1?<Progress percent={100} type="circle" />:<Progress percent={0} type="circle" status="exception" />)
                            );
                        },
                    },
                    extra :{
                        render:(_, row )=>{
                            return (
                                (row.state==2||row.state==3)?<Button color="yellow">正在导出</Button>:(row.state==1?<Button color="green" onClick={()=>{handledownload(row.fileurl);}} >下载文件</Button>:<Redobutton taskid={row.id}/>)
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
