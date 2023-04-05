import { Button } from "antd";
import React from "react";
import { ProList } from "@ant-design/pro-components";
import { useState } from "react";
import CreateEn from "./createEn";
import {useEffect} from "react";
import { request } from "../../utils/network";

interface Entity{
    key:React.Key;
    entityname:string;
    admingname:string;
}

interface EntityRegister{
  key:React.Key;
  entityname:string;
}
let data:Entity[] =[{key:1 ,entityname:"good",admingname:"good"},{key:2,entityname:"fuck",admingname:"se"},{key:5,entityname:"test",admingname:""}];






const Entitylist =( () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [Entitylist,setEntitylist]=useState<Entity[]>([]);
    useEffect((()=>{
        request("/api/entity/superget","GET")
            .then((res)=>{
                let size=res.data.length;
                let i=0;
                let initentities: Entity[]=[];
                for(i;i<size;i++){
        
                }
            })
            .catch((err)=>{

            });
    }),[Entitylist]);

    const handleCreateEntity=((entity:EntityRegister)=>{
    //在这里实现后端通信，添加业务实体，不指派管理员，setEntitylist
    });
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };
    const hasSelected = selectedRowKeys.length > 0;
    const assign=((assign_entity:string)=>{
        //加一个弹窗？
    });
    const delete_entity=(()=>{
        if (window.confirm("确认删除所选业务实体？")){
            //在这里添加后端通信，删除业务实体，并更改前端
        }
    });
    return (
        <div>
            <CreateEn isOpen={isDialogOpen} onClose={()=>setIsDialogOpen(false)} onCreateUser={handleCreateEntity}></CreateEn>
            <ProList<Entity>
                toolBarRender={() => {
                    return [
                        <Button key="1" type="primary" onClick={()=>{setIsDialogOpen(true);}}>
              创建业务实体
                        </Button>,
                        <Button key="1" type="default" danger={true} onClick={delete_entity} disabled={!hasSelected}> 删除选中业务实体</Button>,
                    ];
                }}
                pagination={{
                    pageSize: 10,
                }}
                metas={{
                    title: {dataIndex:"entityname",},
                    description: {
                        dataIndex:"admingname",
                        render: (_,row) => {
                            return (
                                <div>
                                    {(row.admingname==="")?"暂无系统管理员":("系统管理员 :  "+row.admingname)}
                                </div>
                            );
                        },
                    },
                    avatar: {},
                    extra: {
                    },
                    actions: {
                        dataIndex:"admingname",
                        render: (_,row) => {
                            return (
                            //这里的回调函数可能有问题
                                <Button style={((row.admingname)==="")?{display:"block"}:{display:"none"}} onClick={()=>{assign(row.entityname);}} >
                      创建并委派企业系统管理员
                                </Button>
                            );
                        },
                    },
                }}
                rowKey="key"
                headerTitle="业务实体列表"
                rowSelection={rowSelection}
                dataSource={data}
            />
        </div>
    );
}
);

export default Entitylist;