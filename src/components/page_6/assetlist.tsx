import { Avatar, List, Space, Button, message } from "antd";
import React from "react";
import {ProFormDatePicker, ProList} from "@ant-design/pro-components";
import { useState } from "react";
import {useEffect} from "react";
import { request } from "../../utils/network";
import CreateAsset from "./createAsset";
import CreateLabel from "./createLabel";
import {
    ProForm,
    ProFormSelect,
    ProFormText,
    QueryFilter,
} from "@ant-design/pro-components";

interface Asset{

    key: React.Key;
    name: string;
    person?: string;
    department?: string;
    parent?: string;
    child?: string;
    category: string;
    description?: string;
    number?: Number;
    addtion?: string;
    status?: Number;

}

interface short_asset{

    key: React.Key;
    assetname: string;
    description?: string;
    number_idle?: Number;
    category: string;
    status?: Number;

}

const Assetlist = ( () => {

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [assets, setAssets] = useState<short_asset[]>([]);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        request("/api/asset/get", "GET")
            .then((res) => {
                setAssets(res.data);
            })
            .catch((err) => {
                alert(err);
            });
    }, []);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };

    const hasSelected = selectedRowKeys.length > 0;

    const add_asset = ((asset: Asset) => {
        let short : short_asset = {key: asset.key, assetname: asset.name, description: asset.description, category : asset.category, status: 0, number_idle: asset.number};
        setAssets([...assets, short]); 
    });

    const delete_asset = (() => {
        
    });

    const status_transform = ((status: Number) => {

        if(status == 0) return "闲置";
        else if(status == 1) return "在使用";
        else if(status == 2) return "维保";
        else return "清退";

    });

    return (
        <div> 
            <div
                style={{
                    margin: 24,
                }}
            >
                <QueryFilter 
                    labelWidth="auto" 
                    onFinish={async (values) => {
                        message.success("查询成功");
                    }}
                >
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="name"
                            label="资产名称"
                            tooltip="最长为 128 位"
                            placeholder="请输入名称"
                        />
                        <ProFormSelect
                            options={[
                                {
                                    value: "free",
                                    label: "闲置",
                                },
                                {
                                    value: "occupied",
                                    label: "使用中",
                                },
                                {
                                    value: "fixing",
                                    label: "维保",
                                },
                                {
                                    value: "disabled",
                                    label: "清退",
                                },
                                
                            ]}
                            width="xs"
                            name="status"
                            label="资产状态"
                        />
                        <ProFormDatePicker
                            width="md"
                            name={["asset", "createTime"]}
                            label="资产入库时间"
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="sm" name="id" label="所属部门" />
                        <ProFormSelect
                            width="xs"
                            options={[
                                {
                                    value: "time",
                                    label: "履行完终止",
                                },
                            ]}
                            name="unusedMode"
                            label="合同约定失效效方式"
                        />
                    </ProForm.Group>
                    <ProFormText width="sm" name="id" label="主合同编号" />
                    <ProFormText
                        name="project"
                        width="md"
                        disabled
                        label="项目名称"
                        initialValue="xxxx项目"
                    />
                    <ProFormText width="xs" name="mangerName" disabled label="商务经理" initialValue="启途" />
                </QueryFilter>
            </div>
            <ProList<short_asset>

                pagination = {{pageSize: 10}}
                metas = {{
                    title: {dataIndex:"assetname"},
                    description: {
                        render: (_,row) => {
                            return (
                                <div>
                                    {row.description == undefined ? "暂无描述" : row.description}
                                </div>
                            );
                        }
                    },
                    content: {
                        render: (_, row) => {
                            if(row.status != undefined) {
                                return (
                                    <div key="label" style={{ display: "flex", justifyContent: "space-around" }}>
                                        <div key="status">
                                            <div style={{ color: "#00000073" }}>
                                                资产状态
                                            </div>
                                            <div style={{ color: "#000000D9" }}>
                                                {status_transform(row.status)}
                                            </div>
                                        </div>
                                        <div key="category">
                                            <div style={{ color: "#00000073" }}>
                                                资产种类
                                            </div>
                                            <div style={{ color: "#000000D9" }}>
                                                {row.category}
                                            </div>
                                        </div>
                                        
                                    </div>
                                );
                            } else if(row.number_idle != undefined){
                                return (
                                    <div key="label" style={{ display: "flex", justifyContent: "space-around" }}>
                                        <div key="status">
                                            <div style={{ color: "#00000073" }}>
                                                资产数量
                                            </div>
                                            <div style={{ color: "#000000D9" }}>
                                                {row.number_idle.toString()}
                                            </div>
                                        </div>
                                        <div key="category">
                                            <div style={{ color: "#00000073" }}>
                                                资产种类
                                            </div>
                                            <div style={{ color: "#000000D9" }}>
                                                {row.category}
                                            </div>
                                        </div>
                                        
                                    </div>
                                );
                            }
                            
                        },
                    },
                    avatar: {},
                    extra: {},
                    actions: {
                        render: (_,row) => {
                            return (
                                <Button type="link" onClick={() => {setIsDetailOpen(true);}}>
                                    查看详情
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
                        <CreateLabel></CreateLabel>,
                        <CreateAsset onCreateAsset={add_asset}></CreateAsset>,
                        <Button key="2" type="default" danger={true} onClick = {delete_asset} disabled = {!hasSelected}> 
                            删除选中资产
                        </Button>
                    ];
                }}
            />
        </div>
    );
}
);

export default Assetlist;