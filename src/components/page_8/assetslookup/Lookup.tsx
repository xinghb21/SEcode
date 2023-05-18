import React, { useState } from "react";
import { useEffect } from "react";
import type { MenuProps } from "antd";
import { Button, Input, Menu, Space, Tag, message, Table, Skeleton, Divider, Spin } from "antd";
import { request } from "../../../utils/network";
import { ProColumns, ProList, ProTable } from "@ant-design/pro-components";
import { ColumnsType } from "antd/es/table";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import moment from "moment";
import OSS from "ali-oss";
import CryptoJS from "crypto-js";
import Base64 from "base-64";
import VirtualList from "rc-virtual-list";
import InfiniteScroll from "react-infinite-scroll-component";
import Column from "antd/es/table/Column";
interface asset {
    key: React.Key;
    id: number;
    name: string;
    type: number;
    count: number;
    state: object;
    haspic: boolean;
    imageurl: string;
    in_use: number;
    in_mentain: number;
    in_damage: number;
    in_deal: number;
}

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

const client = new OSS({
    region: "oss-cn-beijing",
    accessKeyId: accessKeyId,
    accessKeySecret: accessSecret,
    bucket: "aplus-secoder",
});

const state: string[] = ["使用中", "使用中", "维保中", "报废", "使用中", "正在处理"];
const color: string[] = ["", "green", "blue", "red", "", "yellow"];

const Lookup = () => {
    const [assetlist, setassetlist] = useState<asset[]>([]);
    const [pagenation, setpagenation] = useState({
        current: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总记录数
    });
    const [spinloading, setspinloading] = useState<boolean>(false);
    const columns: ProColumns<asset>[] = [
        {
            title: "资产名称",
            dataIndex: "name",
        },
        {
            title: "资产编号",
            dataIndex: "id",
        },
        {
            title: "资产类别",
            dataIndex: "type",
            render: (_, row) => {
                return (
                    <Space size={0}>
                        {(row.type === 1) ? <Tag color="blue" key={row.name}>{"数量型"}</Tag>
                            : <Tag color="blue" key={row.name}>{"条目型"}</Tag>
                        }
                    </Space>
                );
            },
        },
        {
            title: "使用中数量",
            key: "in use",
            render: (_, row) => {
                return (
                    <div style={{ color: "green" }} >{row.in_use}</div>
                );
            },
        },
        {
            title: "维保中数量",
            key: " mentain",
            render: (_, row) => {
                return (
                    <div style={{ color: "orange" }} >{row.in_mentain}</div>
                );
            },
        },
        {
            title: "报废数量",
            key: " damaged",
            render: (_, row) => {
                return (
                    <div style={{ color: "red" }} >{row.in_damage}</div>
                );
            },
        },
        {
            title: "处理中数量",
            key: " deal",
            render: (_, row) => {
                return (
                    <div style={{ color: "blue" }}>{row.in_deal}</div>
                );
            },
        },
        {
            title: "资产图片",
            key: "picpic",
            render: (_, row) => {
                if (row.imageurl != "") {
                    return <img src={row.imageurl} width={60} height={60} loading="lazy" ></img>;
                } else {
                    return <a>暂无图片</a>;
                }
            }
        }
    ];



    const fetchlist = () => {
        setspinloading(true);
        request("/api/user/ns/possess", "GET")
            .then((res) => {
                // 更新表格数据源和分页器状态
                let templist = res.assets.map((val) => {
                    let imageurli = "";
                    if (val.haspic) {
                        imageurli = client.signatureUrl(res.entity + "/" + res.department + "/" + val.name);
                    }
                    let temp = {
                        key: val.id,
                        id: val.id,
                        name: val.name,
                        type: val.type,
                        state: val.state,
                        haspic: val.haspic,
                        imageurl: imageurli,
                        in_use: 0,
                        in_mentain: 0,
                        in_damage: 0,
                        in_deal: 0,
                    };
                    Object.entries(val.state).forEach(([k, v]) => {
                        let stnum: number = +k;
                        let count: number = v as number;
                        if (v !== 0) {
                            switch (stnum) {
                            case 1:
                                temp.in_use = count;
                                break;
                            case 2:
                                temp.in_mentain = count;
                                break;
                            case 3:
                                temp.in_damage = count;
                                break;
                            case 5:
                                temp.in_deal = count;
                                break;
                            }
                        }
                    });
                    return temp;
                });
                setassetlist(templist);
                setspinloading(false);
            })
            .catch((error) => {
                setspinloading(false);
                message.warning(error.message);
            });
    };
    useEffect((() => {
        fetchlist();
    }), []);

    return (
        <div
            style={{
                height: "600px",
                overflow: "auto",
                marginTop: 10
                // border: "1px solid rgba(140, 140, 140, 0.35)",
            }}
        >
            <Spin spinning={spinloading} size="large"  >
                <ProTable<asset>
                    //切换页面的实现在于pagination的配置，如下
                    columns={columns}
                    bordered={true}
                    search={false}
                    options={false}
                    rowKey="key"
                    headerTitle="您拥有的资产列表"
                    dataSource={assetlist}
                />
            </Spin>
        </div>
    );
};

export default Lookup;