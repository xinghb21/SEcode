import { Button, message } from "antd";
import React from "react";
import {ProFormDatePicker, ProList} from "@ant-design/pro-components";
import { useState } from "react";
import {useEffect} from "react";
import { request } from "../../utils/network";
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
    type?: boolean;

}

const DelAsset = ( () => {

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        request("/api/asset/get", "GET")
            .then((res) => {
                setAssets(res.data);
            })
            .catch((err) => {
                message.error(err);
            });
    }, []);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };

    const hasSelected = selectedRowKeys.length > 0;

    //给后端发请求删除对应的asset
    const delete_asset = (() => {
        const newAssets = assets.filter(item => !selectedRowKeys.includes(item.key));
        setAssets(newAssets);
        const selectedNames = selectedRowKeys.map(key => {
            const item = assets.find(data => data.key === key);
            return item ? item.name : "";
        });
        
    });

    return (
        <div> 
            <div
                style={{
                    margin: 20,
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
            <ProList<Asset>

                pagination = {{pageSize: 10}}
                metas = {{
                    title: {dataIndex:"assetname"},
                    description: {
                        render: (_,row) => {
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

export default DelAsset;