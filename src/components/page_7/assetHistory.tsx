import React, { useEffect, useState } from "react";
import { request } from "../../utils/network";
import { Space, Tag, message } from "antd";
import { ProList } from "@ant-design/pro-components";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import moment from "moment";

interface History {
    key: React.Key;
    id: number;
    content: string;
    time: number;
    type: number;
    asset: string;
}

const AssetHistory = () => {

    const [historylist,sethistorylist] = useState<History[]>([]);    
    const [pagenation,setpagenation] = useState({
        current: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总记录数
    });

    useEffect((()=>{
        request("/api/asset/allhistory", "GET", {page: 1})
            .then((res) => {
            // 更新表格数据源和分页器状态
                sethistorylist(res.info.map((val)=>{
                    return {
                        key: val.id,
                        id: val.id,
                        content: val.content,
                        type: val.type,
                        time: val.time,
                        asset: val.asset,
                    };
                }));
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

    const handleFetch = (page:number, pageSize:number) => {
        // 构造请求参数
        // 发送请求获取数据
        request("/api/asset/allhistory","GET", {page: page})
            .then((res) => {
            // 更新表格数据源和分页器状态
                sethistorylist(res.info.map((val)=>{
                    return {
                        key: val.id,
                        id: val.id,
                        content: val.content,
                        type: val.type,
                        time: val.time,
                        asset: val.asset,
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

    return (
        <div>
            <ProList<History, Params>
                //切换页面的实现在于pagination的配置，如下
                pagination={{
                    current: pagenation.current,
                    pageSize: pagenation.pageSize,
                    onChange: handleFetch,
                    total: pagenation.total
                }}
                metas={{
                    title: { dataIndex:"asset" },
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
                                    {(row.type === 1) ? <Tag color="blue" key={row.id}>资产创建</Tag> :
                                        ((row.type===2) ? <Tag color="green" key={row.id}>资产领用</Tag> :  
                                            ((row.type===3) ? <Tag color="orange" key={row.id}>资产转移</Tag> :
                                                ((row.type===4) ? <Tag color="red" key={row.id}>资产维保</Tag> :
                                                    ((row.type===5) ? <Tag color="purple" key={row.id}>资产退库</Tag> :
                                                        <Tag color="cyan" key={row.id}>资产数量变动</Tag>))))
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
                                    <p>Happen at: {moment(row.time,"X").format("YYYY-MM-DD-HH:mm:ss")}</p>
                                </div>
                            );
                        },
                    },
                }}
                rowKey="key"
                headerTitle="资产历史查看"
                dataSource={historylist}
            />
        </div>
    );
};

export default AssetHistory;