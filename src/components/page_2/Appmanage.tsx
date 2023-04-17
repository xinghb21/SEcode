import { Avatar, List, Space, Button, Tag, message, Modal } from "antd";
import React from "react";
import { ProForm, ProFormDatePicker, ProFormSelect, ProFormText, ProList, QueryFilter, hrHRIntl } from "@ant-design/pro-components";
import { Progress } from "antd";
import type { ReactText } from "react";
import { useState } from "react";
import { BUILD_ID_FILE } from "next/dist/shared/lib/constants";
import CreateUser from "./CreateUser";
import {useEffect} from "react";
import { request } from "../../utils/network";
import Resetpassword from "./resetpassword";
import { Md5 } from "ts-md5";
import Column from "antd/es/table/Column";
import Addapp from "../applists/Addapp";
interface DialogProps{
    children:string;
    isOpen: boolean;
    username:string;
    onClose: ()=>void;
}
interface app{
    key:React.Key;
    name:string;
    urlvalue:string;
}

const Appmagage=(props:DialogProps)=>{
    const [applists,setapplist]=useState<app[]>([]);
    const [dialogopen1,setIsDialogOpen1]=useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    useEffect((()=>{
        if(props.username!==""){
            fetchlist();
        }
    }),[props.username]);
    const fetchlist=()=>{
        request("api/user/es/getonesapp","GET",{name:props.username})
            .then((res)=>{
                let temp:app[]=[];
                let i=0;
                let size=res.info.length;
                for(i;i<size;i++){
                    temp.push({key:res.info[i].name,name:res.info[i].name,urlvalue:res.info[i].urlvalue});
                }
                setapplist(temp);
            })
            .catch((err)=>{
                message.warning(err.message);
            });
    };   
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };
    const hasSelected = selectedRowKeys.length > 0;
    const  delete_apps=()=>{
        if(window.confirm("确定删除所选应用？")){

            let deleted:app[]=applists.filter((obj)=>{return selectedRowKeys.find((rowkey)=>{return rowkey === obj.key; }) != null; });
            if (deleted.length>0){
                request("api/user/es/deleteapps","DELETE",{username:props.username,appdeleted:deleted.map((val)=>{return val.name;})})
                    .then((res)=>{
                        message.success("删除成功");
                        fetchlist();
                        setSelectedRowKeys([]);
                    })
                    .catch((err)=>{
                        message.warning(err.message);
                    });
            }
        }
    };
    return (
        <Modal  title="创建企业系统管理员" onOk={()=>{setapplist([]);props.onClose();}} onCancel={()=>{setapplist([]);props.onClose();}} open={props.isOpen}  >
            <Addapp isOpen={dialogopen1} username={props.username} onClose={()=>{ setIsDialogOpen1(false);fetchlist(); }}></Addapp>
            <ProList<app>
                toolBarRender={() => {
                    return [
                        <Button key="1" type="primary" onClick={()=>{setIsDialogOpen1(true);}}>
                            添加应用
                        </Button>,
                        <Button key="2" type="default" danger={true} onClick={delete_apps} disabled={!hasSelected}> 删除选中应用</Button>,                        
                    ];
                }}
                pagination={{
                    pageSize: 6,
                }}
                metas={{
                    title: {dataIndex:"name",},
                    description: {
                        render: (_,row) => {
                            return (
                                <div>
                                    {"URL: "+row.urlvalue}
                                </div>
                            );
                        },
                    },
                }}
                rowKey="key"
                headerTitle="该员工应用列表"
                rowSelection={rowSelection}
                dataSource={applists}
            />
        </Modal>
    );
};

export default Appmagage;