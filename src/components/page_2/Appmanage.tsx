import { Button, message, Modal, Popconfirm, Spin } from "antd";
import React from "react";
import { ProList} from "@ant-design/pro-components";
import { useState } from "react";
import {useEffect} from "react";
import { request } from "../../utils/network";
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
    const [isspin,setspin] = useState<boolean>(false);
    useEffect((()=>{
        if(props.username!==""){

            fetchlist();
        }
    }),[props.username]);
    const fetchlist=()=>{
        setspin(true);
        request("api/user/es/getonesapp","GET",{name:props.username})
            .then((res)=>{
                let temp:app[]=[];
                let i=0;
                let size=res.info.length;
                for(i;i<size;i++){
                    temp.push({key:res.info[i].name,name:res.info[i].name,urlvalue:res.info[i].urlvalue});
                }
                setapplist(temp);
                setspin(false);
            })
            .catch((err)=>{
                setspin(false);
                message.warning(err.message);
            });
    };   
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };
    const hasSelected = selectedRowKeys.length > 0;
    const  delete_apps=()=>{

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
        
    };
    return (
        <Spin spinning={isspin} size="small">
            <Modal  title="应用列表管理" onOk={()=>{props.onClose();}} onCancel={()=>{props.onClose();}} open={props.isOpen}  >
                <Addapp isOpen={dialogopen1} username={props.username} onClose={()=>{ setIsDialogOpen1(false);fetchlist(); }}></Addapp>
            
                <ProList<app>
                    toolBarRender={() => {
                        return [
                            <Button key="1" type="primary" onClick={()=>{setIsDialogOpen1(true);}}>
                                添加应用
                            </Button>,
                            <Popconfirm
                                title="删除应用"
                                description="您确定要删除选中应用吗?"
                                onConfirm={delete_apps}
                                onCancel={()=>{}}
                                okText="Yes"
                                cancelText="No"
                                key={"delete confirm"}
                                disabled={!hasSelected}
                            >
                                <Button key="2" type="default" danger={true} disabled={!hasSelected}> 删除选中应用</Button>
                            </Popconfirm>,                        
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
        </Spin>
    );
};

export default Appmagage;