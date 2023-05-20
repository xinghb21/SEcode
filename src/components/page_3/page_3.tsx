import React from "react";
import { Avatar, List, Space, Button, Tag, message, Typography, Spin } from "antd";
import { ProForm, ProFormDatePicker, ProFormSelect, ProFormText, ProList, QueryFilter, ProTable, ProColumns } from "@ant-design/pro-components";
import { Progress } from "antd";
import { useState } from "react";
import { BUILD_ID_FILE } from "next/dist/shared/lib/constants";
import {useEffect} from "react";
import { request } from "../../utils/network";
import { Md5 } from "ts-md5";
import Column from "antd/es/table/Column";
import Pagination from "antd";
import moment from "moment";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
const { Text } = Typography;
interface log{
    key:React.Key,
    id:number,
    content:string,
    time:number,
    type:number,
    range:string[]
}
const Page_3 = () => {

    const [isSpinning, setSpnning] = useState(false);
    const [loglist,setloglist]=useState<log[]>([]);
    const [pagenation,setpagenation] = useState({
        current: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总记录数
    });
    useEffect((()=>{
        request("/api/user/es/getlogs","GET",{page:1})
            .then((res) => {
            // 更新表格数据源和分页器状态
                setloglist(res.info.map((val)=>{
                    return {
                        key:val.id,
                        id:val.id,
                        content:val.content,
                        type:val.type,
                        time:val.time,
                    };
                }));
                setpagenation({
                    current: 1,
                    pageSize: 10,
                    total: res.count,
                });
                
                setTimeout(() => {
                    setSpnning(false);
                }, 500);
                
                setTimeout(() => {
                    setSpnning(false);
                }, 500);
            })
            .catch((error) => {
                setSpnning(false);
                setSpnning(false);
                message.warning(error.message);
            });
    }),[]);

    //这个函数用于每次切换页码之后向后端请求数据，page和pageSize这两个参数的名字不能变
    const handleFetch = (page:number,pageSize:number) => {
        // 构造请求参数
        // 发送请求获取数据
        request("/api/user/es/getlogs","GET",{page:page})
            .then((res) => {
            // 更新表格数据源和分页器状态
                setloglist(res.info.map((val)=>{
                    return {
                        key:val.id,
                        id:val.id,
                        content:val.content,
                        type:val.type,
                        time:val.time,
                    };
                }));
                setpagenation({
                    current: page,
                    pageSize: 10,
                    total: res.count,
                });
            })
            .catch((error) => {
                message.warning(error.message);
            });
    };
    const columns: ProColumns<log>[] = [
        {
            title: "序号",
            width: 30,
            dataIndex: "id",
            hideInSearch: true,
            ellipsis: true,
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: "内容",
            dataIndex: "content",
            width: 80,
            ellipsis: true,
            hideInSearch: true,
        },
        {
            title: "类型",
            width: 80,
            dataIndex: "type",
            hideInSearch: false,

            ellipsis: true,
            // align: 'center',
            valueEnum: {
                1: { text: <Tag color="blue" key={1}>{"员工登录"}</Tag>},
                2: { text: <Tag color="green" key={2}>{"部门结构变化"}</Tag>},
                3: { text: <Tag color="orange" key={3}>{"员工信息变化"}</Tag>},
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
    ];
    return (
        isSpinning?<Spin tip="Loading..."></Spin>:<div>
            <ProTable<log,Params>
                //切换页面的实现在于pagination的配置，如下
                pagination={{current:pagenation.current,pageSize:pagenation.pageSize,onChange:handleFetch,total:pagenation.total,showSizeChanger:false}}
                columns={columns}
                options={false}

                request={(params, sorter, filter) => {
                    // 表单搜索项会从 params 传入，传递给后端接口。
                    console.log("hello world");
                    console.log(params);
                    let success:boolean = true;
                    request("api/user/es/getlogs","GET",{page:params.current,from:params.startTime,to:params.endTime,type:params.type})
                        .then((res)=>{
                            setloglist(res.info.map((val)=>{
                                return {
                                    key:val.id,
                                    id:val.id,
                                    content:val.content,
                                    type:val.type,
                                    time:val.time,
                                };
                            }));
                            setpagenation({
                                current: (params.current)?params.current:1,
                                pageSize: 10,
                                total: res.count,
                            });
                            success = true;
                            message.success("查询成功");
                        })
                        .catch((err)=>{
                            success = false;
                            message.warning(err.message);
                        });
                    return Promise.resolve({
                        data: [],
                        success: success,
                    });
                }}
                rowKey="key"
                headerTitle=
                    {<Text ellipsis={true}>{"📝业务实体操作日志"}</Text>}
                dataSource={loglist}
                dateFormatter="string"
            />
        </div>
    );
};

export default Page_3;