import { Avatar, List, Space, Button, Tag, message, Modal, Input, Table } from "antd";
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
import { ColumnsType } from "antd/es/table";
interface DialogProps{
    children:string;
    id:number;
    isOpen: boolean;
    onClose: ()=>void;
    reason:string;
    message:string;
}
interface asset{
    key:React.Key;
    id:number;
    name:string;
    count:number;
}

const columns: ColumnsType<asset> = [
    {
        title: "资产编号",
        dataIndex: "id",
    },
    {
        title: "资产名称",
        dataIndex: "name",
    },
    {
        title: "申请数量",
        dataIndex: "count",
    }

];

const Applydetail=(props:DialogProps)=>{

    const [assetlist,setassetlist]= useState<asset[]>([]);

    useEffect((()=>{
        if( props.id !== -1 ){
            request("api/user/ns/assetsinapply","GET",{id:props.id})
                .then((res)=>{
                    setassetlist(res.info.map((val)=>{
                        return {
                            key:val.id,
                            id:val.id,
                            name:val.assetname,
                            count:val.assetcount,
                        };
                    }));
                })
                .catch((err)=>{
                    message.warning(err.message);
                });
        }
    }),[props.id]);
    return (
        <Modal  title="该领用的信息" onOk={props.onClose} onCancel={props.onClose} open={props.isOpen}  >
            <label>申请原因：</label>
            <p>{props.reason}</p>
            <label> 批复意见：</label>    
            <p>{props.message}</p>
            <Table columns={columns} dataSource={assetlist} style={{ height: "100%", width: "70%" }}>
            </Table>
        </Modal>
    );
};

export default Applydetail;