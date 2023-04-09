import { Avatar, List, Space, Button, message } from 'antd';
import React from 'react';
import {ProFormDatePicker, ProList} from '@ant-design/pro-components';
import { useState } from 'react';
import {useEffect} from "react";
import { request } from '../../utils/network';
import CreateAssert from './createAssert';
  import {
    ProForm,
    ProFormSelect,
    ProFormText,
    QueryFilter,
  } from '@ant-design/pro-components';

interface Assert{

    key: React.Key;
    assertname: string;
    person: string;
    department: string;
    parent: string;
    child: string;
    status: string;
    category: string;
    description: string;
    type: boolean;
    number: Number;
    addtion: string;

}

interface short_assert{

    key: React.Key;
    name: string;
    description: string;
    number: Number;
    category: string;
    status: Number;

}

function getAssert(
    key: React.Key,
    name: string,
    description: string,
    number: Number,
    category: string,
    status: Number,
): short_assert {
    return {
        key,
        name,
        description,
        number,
        category,
        status,
    } as short_assert;
}

const Assertlist = ( () => {

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [asserts, setAsserts] = useState<short_assert[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        request("/asset/get", "GET")
            .then((res) => {
                let group = res.asserts;
                let now_list: short_assert[] = [];
                for(let i = 0; i < group.size(); i++) {
                    if("number_idle" in group[i]) 
                        now_list.push(getAssert(Date.now(), group[i].name, group[i].description, group[i].number_idle, group[i].category, 0));
                    else 
                        now_list.push(getAssert(Date.now(), group[i].name, group[i].description, -1, group[i].category, group[i].status));
                }
                setAsserts(now_list);
            })
            .catch((err) => {
                message.warning(err.detail);
            })
    }, []);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };

    const hasSelected = selectedRowKeys.length > 0;

    const delete_assert = (() => {
        
    });

    const status_transform = ((status: Number) => {

        if(status == 0) return "闲置";
        else if(status == 1) return "在使用"
        else if(status == 2) return "维保";
        else return "清退";

    })

    return (
        <div>
            {/* <CreateAssert isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} ></CreateAssert> */}
            
            <div
                style={{
                margin: 24,
                }}
            >
                <QueryFilter labelWidth="auto" onFinish={async (values) => {
                        message.success('查询成功');
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
                                    value: 'free',
                                    label: '闲置',
                                },
                                {
                                    value: 'occupied',
                                    label: '使用中',
                                },
                                {
                                    value: 'fixing',
                                    label: '维保',
                                },
                                {
                                    value: 'disabled',
                                    label: '清退',
                                },
                                
                            ]}
                            width="xs"
                            name="status"
                            label="资产状态"
                        />
                        <ProFormDatePicker
                            width="md"
                            name={['assert', 'createTime']}
                            label="资产入库时间"
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="sm" name="id" label="所属部门" />
                        <ProFormSelect
                            width="xs"
                            options={[
                                {
                                value: 'time',
                                label: '履行完终止',
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
            <ProList<short_assert>

                pagination = {{pageSize: 10}}
                metas = {{
                    title: {dataIndex:"assertname"},
                    description: {
                        render: (_,row) => {
                            return (
                              <div>
                                {row.description}
                              </div>
                          );
                        }
                    },
                    content: {
                        render: (_, row) => {
                            if(row.number == -1) {
                                return (
                                    <div key="label" style={{ display: 'flex', justifyContent: 'space-around' }}>
                                        <div key="status">
                                            <div style={{ color: '#00000073' }}>
                                                资产状态
                                            </div>
                                            <div style={{ color: '#000000D9' }}>
                                                {status_transform(row.status)}
                                            </div>
                                        </div>
                                        <div key="category">
                                            <div style={{ color: '#00000073' }}>
                                                资产种类
                                            </div>
                                            <div style={{ color: '#000000D9' }}>
                                                {row.category}
                                            </div>
                                        </div>
                                        
                                    </div>
                                );
                            } else {
                                return (
                                    <div key="label" style={{ display: 'flex', justifyContent: 'space-around' }}>
                                        <div key="status">
                                            <div style={{ color: '#00000073' }}>
                                                资产数量
                                            </div>
                                            <div style={{ color: '#000000D9' }}>
                                                {row.number.toString()}
                                            </div>
                                        </div>,
                                        <div key="category">
                                            <div style={{ color: '#00000073' }}>
                                                资产种类
                                            </div>
                                            <div style={{ color: '#000000D9' }}>
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
                                <Button type="link" onClick={() => {setIsDetailOpen(true)}}>
                                    查看详情
                                </Button>
                            );
                        },
                    },
                }}
                rowKey="key"
                headerTitle="资产列表"
                rowSelection={rowSelection}
                dataSource={asserts}

                toolBarRender={() => {
                    return [
                        <Button key="1" type="primary" onClick={() => {setIsDialogOpen(true)}}>
                            创建资产
                        </Button>,
                        <Button key="2" type="default" danger={true} onClick = {delete_assert} disabled = {!hasSelected}> 
                            删除选中资产
                        </Button>
                    ];
                }}
            />
        </div>
    );
    }
);

export default Assertlist;