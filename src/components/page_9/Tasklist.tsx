import React, { useEffect, useState } from "react";
import { Drawer, Space, Button, Table, Tag, message, Modal, Input, Select, Progress, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { request } from "../../utils/network";
import {
    CarryOutTwoTone,
} from "@ant-design/icons";

import { Badge, Tooltip } from "antd";
import { ProColumns, ProList, ProTable } from "@ant-design/pro-components";
import moment from "moment";
import Processbar from "../../pages/user/asyncdeal/processbar";
import OSS from "ali-oss";
import CryptoJS from "crypto-js";
import Base64 from "base-64";
import Redobutton from  "./redobutton";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

const { Text } = Typography;

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
    time:number,
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
    const [pagenation,setpagenation] = useState({
        current: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总记录数
    });
    useEffect((() => {
        //获取任务
        request("/api/async/esgetalltask", "GET",{page:1})
            .then((res) => {
                let tasks:AsyncTask[] = res.info;
                if(tasks){
                    if(tasks){
                        settasklist(tasks);
                    }
                }
                setpagenation({
                    current: 1,
                    pageSize: 10,
                    total: res.count,
                });
            }).catch((err) => {
                message.warning(err.message);
            });
    }), [clicktime]);
    const handleover=()=>{
        setclicktime(clicktime+1);
    };
    //这个函数用于每次切换页码之后向后端请求数据，page和pageSize这两个参数的名字不能变
    const handleFetch = (page:number,pageSize:number) => {
        //获取任务
        request("/api/async/esgetalltask", "GET",{page:page})
            .then((res) => {
                let tasks:AsyncTask[] = res.info;
                if(tasks){
                    if(tasks){
                        settasklist(tasks);
                    }
                }
                setpagenation({
                    current: page,
                    pageSize: 10,
                    total: res.count,
                });
            }).catch((err) => {
                message.warning(err.message);
            });
    };

    //发送任务导出命令
    const handleoutput = (success:boolean )=>{
        if(success){
            setoutputsuccess(true);
            request("/api/async/getsuccess","POST")
                .then((res)=>{
                    settasklist([...tasklist,res.info]);
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
                    settasklist([...tasklist,res.info]);
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
    const columns: ProColumns<AsyncTask>[] = [
        {
            title: "类型",
            width: 80,
            dataIndex: "type",
            hideInSearch: true,
            filters: true,
            onFilter: true,
            ellipsis: true,
            valueEnum: {
                0: { text: "导出资产", status: "Processing" },
                1: { text: "导出异步任务", status: "Success" },
            },
        },
        {
            title: "创建时间",
            width: 80,
            key: "showTime",
            dataIndex: "time",
            valueType: "date",
            ellipsis: true,
            sorter: (a, b) => a.time - b.time,
            hideInSearch: true,
            render: (_,row) =>{
                return(
                    <div style={{display:"flex",flexDirection:"column"}}>
                        {moment(row.time,"X").format("YYYY-MM-DD HH:mm:ss")}
                    </div>
                );
            },
        },
        {
            title: "时间",
            dataIndex: "range",
            valueType: "dateRange",
            hideInTable: true,
            search: {
                transform: (value) => {
                    return {
                        startTime: value[0],
                        endTime: value[1],
                    };
                },
            },
        },
        {
            title: "状态",
            dataIndex: "state",
            width: 80,
            hideInSearch: true,
            filters: true,
            onFilter: true,
            ellipsis: true,
            valueEnum: {
                1: { text: <Tag color="green" key={1}>{"成功"}</Tag>},
                0: { text: <Tag color="red" key={0}>{"失败"}</Tag>},
                2: { text: <Tag color="blue" key={2}>{"进行中"}</Tag>},
                3: { text: <Tag color="orange" key={3}>{"未开始"}</Tag>},
                4: { text: <Tag color="grey" key={4}>{"已取消"}</Tag>},
            },
            render: (_,row) =>[
                (row.state==2)?
                    ((row.state==2||row.state==3)?<Processbar taskid={row.id}onover={handleover} ></Processbar>:( row.state==1?<Progress percent={100} type="circle" />:<Progress percent={0} type="circle" status="exception" />))
                    :((row.state==3)?(<Tag color="orange" key={3}>{"未开始"}</Tag>):
                        ((row.state==4)?( <Tag color="grey" key={4}>{"已取消"}</Tag>):
                            ((row.state==1)?( <Tag color="green" key={1}>{"成功"}</Tag>):
                                ( <Tag color="red" key={0}>{"失败"}</Tag>))))
            ]
        },
        {
            title: "操作",
            valueType: "option",
            width: 80,
            key: "option",
            render: (text, row, _) => [
                (row.state==2||row.state==3)?<Button color="yellow">正在导出</Button>:(row.state==1?<Button color="green" onClick={()=>{handledownload(row.fileurl);}} >下载文件</Button>:<Redobutton taskid={row.id}/>)
            ],
        },
    ];
    return (
        <>
            <ProTable<AsyncTask,Params>
                pagination={{current:pagenation.current,pageSize:pagenation.pageSize,onChange:handleFetch,total:pagenation.total}}
                columns={columns}
                rowKey="key"
                headerTitle={
                    <Text ellipsis={true}>{"业务实体内异步导入导出任务"}</Text>
                }
                dataSource={tasklist}
                dateFormatter="string"
                request={(params, sorter, filter) => {
                    // 表单搜索项会从 params 传入，传递给后端接口。
                    console.log("hello world");
                    console.log(params);
                    let success:boolean = true;
                    //获取任务
                    request("/api/async/esgetalltask", "GET",{page:params.current,from:params.startTime,to:params.endTime})
                        .then((res) => {
                            let tasks:AsyncTask[] = res.info;
                            if(tasks){
                                if(tasks){
                                    settasklist(tasks);
                                }
                            }
                            setpagenation({
                                current: (params.current)?params.current:1,
                                pageSize: 10,
                                total: res.count,
                            });
                            success = true;
                        }).catch((err) => {
                            success = false;
                            message.warning(err.message);
                        });
                    return Promise.resolve({
                        data: [],
                        success: success,
                    });
                }}
                toolBarRender={() => {
                    return [
                        <div key={"tool"}>
                            <Space>
                                <Button key="2" type="primary" onClick={()=>{handleoutput(false);}} loading={outputfail}>
                                导出所有失败任务
                                </Button>
                                <Button key="1" onClick={()=>{handleoutput(true);}} loading={outputsuccess} >
                                导出所有成功任务
                                </Button>
                            </Space>
                        </div>
                    ];
                }}
            />
        </>
    );
};
export default Asyncbd;
