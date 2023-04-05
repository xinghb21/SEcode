import { Avatar, List, Space, Button } from 'antd';
import React from 'react';
import {ProList} from '@ant-design/pro-components';
import { useState } from 'react';
import {useEffect} from "react";
import { request } from '../../utils/network';
import CreateAssert from './createAssert';

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
    addtion: string;

}

interface Asserts{

    data: Assert[];

}

const Assertlist = ( (props: Asserts) => {

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };

    const hasSelected = selectedRowKeys.length > 0;

    const delete_assert = (() => {
        
    });


    return (
        <div>
            {/* <CreateAssert isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} ></CreateAssert> */}
            <ProList<Assert>
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
                            return (
                                <div key="label" style={{ display: 'flex', justifyContent: 'space-around' }}>
                                    
                                    <div key="status">
                                        <div style={{ color: '#00000073' }}>
                                            资产状态
                                        </div>
                                        <div style={{ color: '#000000D9' }}>
                                            {row.status}
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
                dataSource={props.data}
            />
        </div>
    );
    }
);

export default Assertlist;