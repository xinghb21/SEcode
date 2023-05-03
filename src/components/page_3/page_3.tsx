import React from "react";
import { Avatar, List, Space, Button, Tag, message } from "antd";
import { ProForm, ProFormDatePicker, ProFormSelect, ProFormText, ProList, QueryFilter, hrHRIntl } from "@ant-design/pro-components";
import { Progress } from "antd";
import type { ReactText } from "react";
import { useState } from "react";
import { BUILD_ID_FILE } from "next/dist/shared/lib/constants";
import {useEffect} from "react";
import { request } from "../../utils/network";
import { Md5 } from "ts-md5";
import Column from "antd/es/table/Column";
import Pagination from "antd";
import moment from "moment";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
interface log{
    key:React.Key,
    id:number,
    content:string,
    time:string,
    type:number
}
const Page_3 = () => {
    const [loglist,setloglist]=useState<log[]>([]);
    const [pagenation,setpagenation] = useState({
        current: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总记录数
    })

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
                }
            }))
            setpagenation({
              current: 1,
              pageSize: 10,
              total: res.count,
            });
          })
          .catch((error) => {
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
                }
            }))
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
    return (
        <div>
            <ProList<log,Params>
                //切换页面的实现在于pagination的配置，如下
                pagination={{current:pagenation.current,pageSize:pagenation.pageSize,onChange:handleFetch,total:pagenation.total}}
                metas={{
                    title: {dataIndex:"id",},
                    description: {
                        render: (_,row) => {
                            return (
                                <div>
                                    {row.content}
                                </div>
                            );
                        },
                    },
                    subTitle: {
                        render: (_, row) => {
                            return (
                                <Space size={0}>
                                    {(row.type===1)?<Tag color="blue" key={row.id}>{"员工登录"}</Tag>
                                        :((row.type===2)?<Tag color="green" key={row.id}>{"部门结构变化"}</Tag>:<Tag color="yellow" key={row.id}>{"员工信息变化"}</Tag>)  
                                    }
                                </Space>
                            );
                        },
                        search: false,
                    },
                    extra: {
                        render: (_,row) =>{
                            return(
                                <div style={{display:"flex",flexDirection:"column"}}>
                                    <p>Happen at:{moment(row.time,"X").format("YYYY-MM-DD-HH:mm:ss")}</p>
                                </div>
                            );
                        },
                    },
                }}
                rowKey="key"
                headerTitle="业务实体操作日志"
                dataSource={loglist}
            />
        </div>
    );
};

export default Page_3;