import { Avatar, List, Space, Button, Tag, message, Modal, Input } from "antd";
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

    isOpen: boolean;
    onClose: ()=>void;
    onSuccess:()=> void;
    proassetlist:asset[];
}
interface asset{
    key:React.Key;
    id:number;
    name:string;
    type:number;
    count:number;
    applycount:number;
}

const Applysubmit=(props:DialogProps)=>{
    const [reason,setreason]=useState<string>("");
    const [loading,setloading]=useState<boolean>(false);
    const handlesubmit=()=>{
        setloading(true);
        if(reason!==""){
            request("api/user/ns/userapply","POST",{assetsapply:props.proassetlist.map((val)=>{return{id:val.id,assetname:val.name,assetcount:val.applycount};}),reason:reason})
                .then((res)=>{
                    message.success("提交成功，请等待审批");
                    props.onClose();
                    props.onSuccess();
                    setloading(false);
                })
                .catch((err)=>{
                //申请没成功就关闭页面
                    message.warning(err.message);
                    props.onClose();
                    setloading(false);
                });    
        }else{
            message.warning("请填写申请原因");
            setloading(false);
        }
    };
    return (
        <Modal  title="资产领用申请" onOk={()=>{handlesubmit();}} okText={"提交申请"} confirmLoading={loading} onCancel={props.onClose} open={props.isOpen}  >
            <label>请填写申请原因：</label>
            <Input type='text' onChange={(e)=>{setreason(e.target.value);}} maxLength={200}></Input>
            <ProList<asset>
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
                                        <div>
                                            {"申请数量："+row.applycount}
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
                dataSource={props.proassetlist}
            />
        </Modal>
    );
};

export default Applysubmit;