import { Button, message } from 'antd';
import React from 'react';
import { ProFormDateRangePicker, ProFormDigitRange, ProList} from '@ant-design/pro-components';
import { useState } from 'react';
import {useEffect} from "react";
import { request } from '../../utils/network';
import {
    ProForm,
    ProFormSelect,
    ProFormText,
    QueryFilter,
} from '@ant-design/pro-components';

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
    addtion?: Object;
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
                alert(err);
            })
    }, []);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };


    //给后端发请求删除对应的asset
    const delete_asset = (() => {

        const newAssets = assets.filter(item => !selectedRowKeys.includes(item.key));

        const selectedNames = selectedRowKeys.map(key => {
            const item = assets.find(data => data.key === key);
            return item ? item.name : "";
        });
        
        request("/api/asset/delete", "DELETE", selectedNames)
            .then(() => {
                setAssets(newAssets);
                setSelectedRowKeys([]);
                message.success("删除成功");
            })
            .catch((err) => {
                alert(err);
            });
    });

    const hasSelected = selectedRowKeys.length > 0;

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
                        
                        request("/api/asset/get", "GET", 
                        {
                            parent: values.parent,
                            category: values.category,
                            name: values.name,
                            belonging: values.belonging,
                            from: values.date[0],
                            to: values.date[1],
                            user: values.user,
                            status: values.status,
                            pricefrom: values.price[0],
                            priceto: values.price[1],
                        })
                            .then((res) => {
                                setAssets(res.data);
                                message.success("查询成功");
                            }).catch((err) => {
                                message.warning(err);
                            })
                    }}
                >
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="name"
                            label="资产名称"
                            initialValue={""}
                            placeholder="请输入名称"
                        />
                        <ProFormSelect
                            options={[
                                {
                                    value: 0,
                                    label: '闲置',
                                },
                                {
                                    value: 1,
                                    label: '使用中',
                                },
                                {
                                    value: 2,
                                    label: '维保',
                                },
                                {
                                    value: 3,
                                    label: '清退',
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
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText 
                            width="md" 
                            name="parent" 
                            label="上级资产名称" 
                            initialValue={""}
                        />
                        <ProFormText 
                            width="md" 
                            name="category" 
                            label="资产类别" 
                        />

                    </ProForm.Group>
                    <ProForm.Group>
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
                    </ProForm.Group>
                    <ProFormDigitRange
                        width="xs"
                        name="price"
                        label="资产价值区间"
                    />
                </QueryFilter>
            </div>
            <ProList<Asset>

                pagination = {{pageSize: 10}}
                metas = {{
                    title: {dataIndex:"name"},
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
                        // render: (_,row) => {
                        //     return (
                        //         <Button type="link" onClick={() => {setIsDetailOpen(true)}}>
                        //             查看详情
                        //         </Button>
                        //     );
                        // },
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