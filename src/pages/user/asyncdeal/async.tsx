import React, { useEffect, useState } from "react";
import { Drawer, Space, Button, Table, Tag, message, Modal, Input, Select, Progress, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { request } from "../../../utils/network";
import {
    CarryOutTwoTone, CloudDownloadOutlined, CloudTwoTone
} from "@ant-design/icons";

import { Badge, Tooltip } from "antd";
import { ProColumns, ProList, ProTable } from "@ant-design/pro-components";
import moment from "moment";
import Processbar from "./processbar";
import OSS from "ali-oss";
import CryptoJS from "crypto-js";
import Base64 from "base-64";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

const {Text} = Typography;

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
}


interface AsyncTask{
    id:number,
    person:string,
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
    const [clicktime, setclicktime] = useState<number>(0);
    const [isTBD, setTBD] = useState(false);//true即有待办任务，false相反
    const [dopen, setDOpen] = useState(false);//是否打开任务中心
    const [tasklist,settasklist] = useState<AsyncTask[]>([]);
    const [pagenation,setpagenation] = useState({
        current: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总记录数
    });
    const showDrawer = () => {
        setclicktime(clicktime + 1);
        setDOpen(true);
    };
    const onClose = () => {
        setDOpen(false);
    };
    useEffect((() => {
        //获取任务
        request("/api/async/getalivetasks", "GET",{page:1})
            .then((res) => {
                let tasks: AsyncTask[] = res.info;
                if (tasks) {
                    tasks = tasks.filter((obj) => { return obj.state != 4; });
                    if (tasks) {
                        settasklist(tasks);
                        setTBD(true);
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
    //这个函数用于每次切换页码之后向后端请求数据，page和pageSize这两个参数的名字不能变
    const handleFetch = (page:number,pageSize:number) => {
        //获取任务
        request("/api/async/getalivetasks", "GET", {page:page})
            .then((res) => {
                let tasks:AsyncTask[] = res.info;
                if(tasks){
                    tasks = tasks.filter((obj)=>{return obj.state != 4;});
                    if(tasks){
                        settasklist(tasks);
                        setTBD(true);
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
    const handleover=()=>{
        setclicktime(clicktime+1);
    };
    const handledownload = (fileroot: string) => {
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
                (row.state==2||row.state==3)?<Button color="yellow">正在导出</Button>:(row.state==1?<Button color="green" onClick={()=>{handledownload(row.fileurl);}} >下载</Button>:<Button color="red">失败</Button>)
            ],
        },
    ];
    return (
        <>
            <Tooltip placement="bottomLeft" title={<span>任务中心</span>}>
                <Button type="text" size="large" style={{ marginTop:5,marginBottom:5 }} onClick={showDrawer}>
                    <CloudTwoTone  twoToneColor={"#a8a8a8"} style={{ fontSize: "25px" }} />
                </Button>
            </Tooltip>
            <Drawer
                title="异步任务列表"
                width={"50%"}
                onClose={onClose}
                open={dopen}
            >
                <ProTable<AsyncTask,Params>
                    pagination={{current:pagenation.current,
                        pageSize:pagenation.pageSize,
                        onChange:handleFetch,
                        total:pagenation.total,
                        showSizeChanger:false
                    }}
                    columns={columns}
                    rowKey="key"
                    headerTitle={
                        <Text ellipsis={true}>{"您正在进行或已经结束的异步导入导出任务"}</Text>
                    }
                    dataSource={tasklist}
                    dateFormatter="string"
                    request={(params, sorter, filter) => {
                    // 表单搜索项会从 params 传入，传递给后端接口。
                        console.log("hello world");
                        console.log(params);
                        let success:boolean = true;
                        //获取任务
                        request("/api/async/getalivetasks", "GET", {page:params.current,from:params.startTime,to:params.endTime})
                            .then((res) => {
                                let tasks:AsyncTask[] = res.info;
                                if(tasks){
                                    tasks = tasks.filter((obj)=>{return obj.state != 4;});
                                    if(tasks){
                                        settasklist(tasks);
                                        setTBD(true);
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
                />
            </Drawer>
        </>
    );
};
export default Asyncbd;
