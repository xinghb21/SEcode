import { Avatar, List, Space, Button, Tag, message, Modal, Input } from 'antd';
import React from "react";
import { ProForm, ProFormDatePicker, ProFormSelect, ProFormText, ProList, QueryFilter, hrHRIntl } from "@ant-design/pro-components";
import { Progress } from "antd";
import type { ReactText } from "react";
import { useState } from "react";
import {useEffect} from "react";
import { request } from "../../utils/network";
import { Md5 } from "ts-md5";
import Column from "antd/es/table/Column";
import Addapp from "../applists/Addapp";
interface DialogProps{
    children:string;
    isOpen: boolean;
    username:string;
    onClose: ()=>void;
}
interface asset{
    key:React.Key;
    id:number;
    name:string;
    type:number;
    count:number;
    applycount:number;
}

const Appmagage=(props:DialogProps)=>{
    const [assetlists,setassetlist]=useState<asset[]>([]);
    const [reason,setreason]=useState<string>("");
    return (
        <Modal  title="提交资产领用申请" onOk={()=>{}} onCancel={()=>{}} open={props.isOpen}  >
            <Input type='text' onChange={(e)=>{setreason(e.target.value)}}></Input>
            <ProList<asset>
                toolBarRender={() => {
                    return [
                        <Button key="shengq" type="primary" onClick={()=>{}}>
                            提交申请
                        </Button>,                        
                    ];
                }}
                pagination={{
                    pageSize: 6,
                }}
                metas={
                    {
                        title: {dataIndex:"name"},
                        description: {
                            render: (_,row) => {
                                return (
                                <div>
                                        <div>
                                            {"现有数量: "+row.count}
                                        </div>
                                        <div>
                                            {"资产编号："+row.id}
                                        </div>
                                </div>

                                );
                            },
                        },
                        subTitle: {
                            render: (_, row) => {
                                return (
                                    <Space size={0}>
                                        {(row.type===1)?<Tag color="blue" key={row.name}>{"数量型"}</Tag>
                                            :<Tag color="blue" key={row.name}>{"条目型"}</Tag>  
                                        }
                                    </Space>
                                );
                            },
                            search: false,
                        },
                    }
                }
                rowKey="key"
                headerTitle="本次领用的所有资产"
                dataSource={assetlists}
            />
        </Modal>
    );
};

export default Appmagage;