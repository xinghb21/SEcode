import { Button, Descriptions, message, Modal } from "antd";
import React from "react";
import { ProColumns, ProFormDateRangePicker, ProFormDigitRange, ProList } from "@ant-design/pro-components";
import { useState } from "react";
import { useEffect } from "react";
import { request } from "../../utils/network";
import {
    ProForm,
    ProFormSelect,
    ProFormText,
    QueryFilter,
} from "@ant-design/pro-components";
import DisplayModel from "./displayModel";
import MoveAsset from "./moveAsset";
import OSS from "ali-oss";
import CryptoJS from "crypto-js";
import Base64 from "base-64";
import moment from "moment";

interface Asset {

    key: React.Key;
    name: string;
    person?: string;
    department?: string;
    parent?: string;
    child?: string;
    assetclass: string;
    description?: string;
    number?: Number;
    addtion?: Object;
    status?: Number;
    type?: boolean;

}

type AssetMoveType = {
    key: React.Key;//资产的编号
    assetname: string;//资产的名称
}

type Userlist = {
    key: React.Key;
    name: string;
    number: number;
}

type AssetDisplayType = {
    //table数据的格式
    key: React.Key;//资产的编号
    parent?: string;//父资产的名称
    department: string;//资产所属部门
    entity: string;//资产所属实体
    category: string;//资产的类型
    name: string;//资产的名称
    type: boolean;//条目型或数量型
    description: string;//资产描述
    create_time: number;//创建时间
    price: number;//资产原始价值
    life: number;//资产使用年限
    belonging: string;//挂账人
    number_idle?: number;//闲置数量
    additional: Record<string, string>;//附加信息
    user?: string;//条目型当前使用人
    usage?: Object[];//数量型当前使用情况
    status?: number;//条目型资产状态
    mantain?: string;//数量型维保情况
    number_expire?: number;//数量型过期数量
    number?: number;//总数数量
    haspic: boolean;//是否有图片
    userlist: Userlist[]; //使用人列表
    additionalinfo: string;//附加信息
    imageurl?: string;//图片url
}

const ddata: AssetDisplayType = {
    key: 0, name: "", category: "", number_idle: 0, description: "", create_time: 0, price: 0,
    life: 0, additional: {}, number: 0, haspic: false, userlist: [], additionalinfo: "", 
    belonging: "", department: "", entity: "", parent: "", type: false, user: "", usage: [], status: 0,
};

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

const DelAsset = (() => {

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [customfeatureList, setcustomFeature] = useState<string[]>();
    const [assetclasslist, setac] = useState<string[]>([]);
    const [displaydata, setDisplay] = useState<AssetDisplayType>(ddata);
    const [isMoveOpen, setIsMoveOpen] = useState(false);
    const [selectedAssets, setSelectedAssets] = useState<AssetMoveType[]>([]);

    useEffect(() => {
        //获取当下部门所有的资产
        request("/api/asset/get", "GET")
            .then((res) => {
                setAssets(res.data);
            })
            .catch((err) => {
                message.warning(err.message);
            });
        //获取部门下的自定义属性
        request("/api/asset/attributes", "GET")
            .then((res) => {
                setcustomFeature(res.info);
            }).catch((err) => {
                message.warning(err.message);
            });
        //获取部门下的资产类别
        request("/api/asset/assetclass", "GET")
            .then((res) => {
                setac(res.data);
            }).catch((err) => {
                message.warning(err.message);
            });
    }, []);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };

    //给后端发请求转移对应的asset
    const change_asset = (() => {

        setSelectedAssets(selectedRowKeys.map(key => {
            const item = assets.find(data => data.key === key);
            return item ? { key: item.key, assetname: item.name } : { key: 0, assetname: "" };
        }));

        setIsMoveOpen(true);

    });

    const hasSelected = selectedRowKeys.length > 0;

    return (
        <>
            <div
                style={{
                    margin: 20,
                }}
            >
                <QueryFilter
                    labelWidth="auto"
                    onFinish={async (values) => {
                        //发送查询请求，注意undefined的情况
                        request("/api/user/ep/queryasset", "POST",
                            {
                                parent: (values.parent != undefined) ? values.parent : "",
                                assetclass: (values.assetclass != undefined) ? values.assetclass : "",
                                name: (values.name != undefined) ? values.name : "",
                                belonging: (values.belonging != undefined) ? values.belonging : "",
                                from: (values.date != undefined) ? Date.parse(values.date[0]) / 1000 : 0,
                                to: (values.date != undefined) ? Date.parse(values.date[1]) / 1000 : 0,
                                user: (values.user != undefined) ? values.user : "",
                                status: (values.status != undefined) ? values.status : -1,
                                pricefrom: (values.price != undefined) ? values.price[0] : 0,
                                priceto: (values.price != undefined) ? values.price[1] : 0,
                                custom: (values.cusfeature != undefined) ? values.cusfeature : "",
                                content: (values.cuscontent != undefined) ? values.cuscontent : "",
                            })
                            .then((res) => {
                                setAssets(res.data);
                                message.success("查询成功");
                            }).catch((err) => {
                                message.warning(err.message);
                            });
                    }
                    }
                >
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="name"
                            label="资产名称"
                            placeholder="请输入名称"
                        />
                        <ProFormSelect
                            options={[
                                {
                                    value: 0,
                                    label: "全部闲置",
                                },
                                {
                                    value: 1,
                                    label: "被全部占用",
                                },
                                {
                                    value: 2,
                                    label: "全部维保中",
                                },
                                {
                                    value: 3,
                                    label: "需要清退",
                                },
                                {
                                    value: 4,
                                    label: "被部分占用",
                                },
                                {
                                    value: 5,
                                    label: "部分维保中",
                                },
                            ]}
                            width="xs"
                            name="status"
                            label="资产状态"
                        />
                        <ProFormDateRangePicker
                            width="md"
                            name="date"
                            label="资产创建时间"
                        />
                        <ProFormText
                            width="md"
                            name="parent"
                            label="上级资产名称"
                            initialValue={""}
                        />
                        <ProFormSelect
                            options={assetclasslist}
                            width="md"
                            name="assetclass"
                            label="资产类别"
                        />

                        <ProFormText
                            width="md"
                            name="belonging"
                            label="资产挂账人"
                        />
                        <ProFormText
                            width="md"
                            name="user"
                            label="当前使用者"
                        />
                        <ProFormDigitRange
                            width="xs"
                            name="price"
                            label="资产价值区间"
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <div>
                            <ProFormSelect
                                options={customfeatureList}
                                width="xs"
                                name="cusfeature"
                                label="自定义属性"
                            />
                            <ProFormText
                                width="md"
                                name="cuscontent"
                                placeholder="请输入属性详细"
                            />
                        </div>
                    </ProForm.Group>
                </QueryFilter>
            </div>
            <ProList<Asset>

                pagination={{ pageSize: 10 }}
                metas={{
                    title: { dataIndex: "name" },
                    description: {
                        render: (_, row) => {
                            return (
                                <div>
                                    {row.description == "" ? "暂无描述" : row.description}
                                </div>
                            );
                        }
                    },
                    avatar: {},
                    extra: {},
                    actions: {
                        render: (_, row) => {
                            return (
                                <Button type="link" onClick={() => {
                                    request("/api/asset/getdetail", "GET", {
                                        id: row.key
                                    }).then((res) => {
                                        res.data.create_time *= 1000;
                                        res.data.key = row.key;
                                        if(res.data.type == false) {
                                            res.data.number_idle = res.data.status == 0 ? 1 : 0;
                                            if(res.data.user != "") res.data.userlist = [{key: res.data.user, name: res.data.user, number: 1}];
                                        } else {
                                            res.data.userlist = [];
                                            res.data.userlist.push(Object.entries(res.data.usage).forEach(([key, value]) => {
                                                return {key: key, name: key, number: value};
                                            }));
                                        }
                                        if(res.data.haspic == true) 
                                            res.data.imageurl = client.signatureUrl(res.data.entity + "/" + res.data.department + "/" + res.data.name);
                                        setDisplay(res.data);
                                        setIsDetailOpen(true);
                                    }).catch((err) => {
                                        message.warning(err.message);
                                    });
                                }}>
                                    查看及修改资产信息
                                </Button>
                            );
                        },
                    },
                }}
                rowKey="key"
                headerTitle="资产列表"
                rowSelection={rowSelection}
                dataSource={assets}
                toolBarRender={() => {
                    return [
                        <Button key="2" type="primary" onClick={change_asset} disabled={!hasSelected}>
                            调拨选中资产
                        </Button>
                    ];
                }}
            />
            <DisplayModel isOpen={isDetailOpen} onClose={() => { setIsDetailOpen(false); }} content={displaydata} />
            <MoveAsset isOpen={isMoveOpen} onClose={() => { setIsMoveOpen(false); }} content={selectedAssets}></MoveAsset>
        </>
    );
}
);

export default DelAsset;