import React, { useState } from "react";
import { useEffect } from "react";
import type { MenuProps } from "antd";
import { Button, Input, Menu, Space, Tag, message, Table, Skeleton, Divider } from "antd";
import { request } from "../../../utils/network";
import { ProList } from "@ant-design/pro-components";
import { ColumnsType } from "antd/es/table";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import moment from "moment";
import OSS from "ali-oss";
import CryptoJS from "crypto-js";
import Base64 from "base-64";
import VirtualList from "rc-virtual-list";
import InfiniteScroll from "react-infinite-scroll-component";
interface asset{
    key:React.Key;
    id:number;
    name:string;
    type:number;
    count:number;
    state:object;
    haspic:boolean;
    imageurl:string;
}
const host = "/image";
const accessKeyId = "LTAI5t7ktfdDQPrsaDua9HaG";
const accessSecret = "z6KJp2mQNXioRZYF0jkIvNKL5w8fIz";
const policyText = {
    "expiration": "2028-01-01T12:00:00.000Z", // 设置该Policy的失效时间，
    "conditions": [
        ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
    ]
};
const policyBase64 = Base64.encode(JSON.stringify(policyText));
const bytes = CryptoJS.HmacSHA1(policyBase64, accessSecret, { asBytes: true });
const signature = bytes.toString(CryptoJS.enc.Base64); 
const client = new OSS({
    region: "oss-cn-beijing",
    accessKeyId: accessKeyId,
    accessKeySecret: accessSecret,
    bucket: "aplus-secoder",
});

const state: string [] =["使用中","使用中","维保中","报废","使用中","正在处理"];
const color: string [] =["","green","blue","red","","yellow"];

const Lookup = () => {
    const [assetlist,setassetlist]=useState<asset[]>([]);
    const [pagenation,setpagenation] = useState({
        current: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总记录数
    });
    const  fetchlist=()=>{
        request("/api/user/ns/possess","GET")
            .then((res) => {
            // 更新表格数据源和分页器状态
                let  templist= res.assets.map((val)=>{ 
                    let imageurli = "";
                    if(val.haspic){
                        imageurli = client.signatureUrl(res.entity+"/"+res.department+"/"+val.name);
                    }
                    return {
                        key:val.id,
                        id:val.id,
                        name:val.name,
                        type:val.type,
                        state:val.state,
                        haspic:val.haspic,
                        imageurl:imageurli,
                    };
                });
                setassetlist(templist);
            })
            .catch((error) => {
                message.warning(error.message);
            });
    };
    useEffect((()=>{
        fetchlist();
    }),[]);

    return (
        <div 
            style={{
                height: 600,
                overflow: "auto",
                padding: "0 16px",
                border: "1px solid rgba(140, 140, 140, 0.35)",
            }}
        >
            <ProList<asset,Params>
                //切换页面的实现在于pagination的配置，如下
                metas={{
                    title: {dataIndex:"name",},
                    description: {
                        render: (_,row) =>{
                            let statelist : any[] = [];
                            Object.entries(row.state).forEach(([k, v]) => {
                                let stnum :number = +k;
                                let count : number = v as number;
                                if(v!==0){
                                    switch (stnum){
                                    case 1:
                                        statelist.push(<div><Tag color="green" >{state[stnum]}</Tag><p>数量为{count}</p></div>);
                                        break;
                                    case 2:
                                        statelist.push(<div><Tag color="green" >{state[stnum]}</Tag><p>数量为{count}</p></div>);
                                        break;
                                    case 3:
                                        statelist.push(<div><Tag color="red" >{state[stnum]}</Tag><p>数量为{count}</p></div>);
                                        break;
                                    case 5:
                                        statelist.push(<div><Tag color="yellow" >{state[stnum]}</Tag><p>数量为{count}</p></div>);
                                        break;
                                    }
                                }
                            });
                            return(
                                <div style={{display:"flex",flexDirection:"row"}}>
                                    {statelist}
                                </div>
                            );
                        },
                    },
                    subTitle: {
                        render: (_, row) => {
                            return (
                                <Space size={0} key={1}>
                                    {(row.type===1)?<Tag color="blue" key={row.name}>{"数量型"}</Tag>
                                        :<Tag color="blue" key={row.name}>{"条目型"}</Tag>  
                                    }
                                </Space>
                            );
                        },
                        search: false,
                    },
                    actions:{
                        render:(_,row) =>{
                            return(
                                <img src={row.imageurl} width={60} height={60} loading="lazy" ></img>
                            );
                        }
                    },
                }}
                rowKey="key"
                headerTitle="您拥有的资产列表"
                dataSource={assetlist}
            />
        </div>
    );
};

export default Lookup;