import { Avatar, List, Space, Button } from "antd";
import React from "react";
import { ProList } from "@ant-design/pro-components";
import { Progress } from "antd";
import type { ReactText } from "react";
import { useState } from "react";
import { BUILD_ID_FILE } from "next/dist/shared/lib/constants";
import CreateEn from "./createEn";
import {useEffect} from "react";
import { request } from "../../utils/network";
import AssignEs from "./assign";
import { Md5 } from "ts-md5";
interface Entity{
    key:React.Key;
    entityname:string;
    admingname:string;
}
interface User{
  key: React.Key;
  username:string;
  password:string;
  entity:string;
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
    const [isassignopen,setIsassignOpen]=useState(false);
    const [assignentity,setAssignentity]=useState<string>("");
    useEffect((()=>{
        request("/api/entity/superget","GET")
            .then((res)=>{
                let size=res.data.length;
                let i=0;
                let initentities: Entity[]=[];
                for(i;i<size;i++){
                    initentities.push({key:res.data[i].name,entityname:(res.data)[i].name,admingname: (res.data)[i].admin});
                }
                setEntitylist(initentities);
            })
            .catch((err)=>{
                alert(err);
            });
    }),[]);

    const handleCreateUser = (user: User) => {
    //在这里向后端发送请求
        const userdata={"name":user.username,"entity":user.entity,"password":Md5.hashStr(user.password)};
        request("/api/entity/assgin","POST",userdata)
            .then((res)=>{
                let newEntitilist:Entity[]=[];
                let i=0;
                let size=Entitylist.length;
                for(i;i<size;i++){
                    if(Entitylist[i].entityname===user.entity){
                        Entitylist[i].admingname=user.username;
                        newEntitilist.push(Entitylist[i]);
                    }else{
                        newEntitilist.push(Entitylist[i]);
                    }
                }
                setEntitylist(newEntitilist);
                setIsassignOpen(false);
            })
            .catch((err)=>{
                alert("创建失败");
                setIsassignOpen(false);
            });
    };

    const handleCreateEntity=((entitys:EntityRegister)=>{
    //在这里实现后端通信，添加业务实体，不指派管理员，setEntitylist
        request("/api/entity/create","POST",{name:entitys.entityname})
            .then((res)=>{
                const newentity:Entity={key: entitys.entityname,entityname: entitys.entityname,admingname:""};
                setEntitylist([...Entitylist,newentity]);
                setIsDialogOpen(false);
            })
            .catch((err)=>{
                alert(err);
            });
    });
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };
    const hasSelected = selectedRowKeys.length > 0;
    const assign=((assign_entity:string)=>{
        setAssignentity(assign_entity);
        setIsassignOpen(true);

    });
    const delete_entity=(()=>{
        if (window.confirm("确认删除所选业务实体？")){
            //在这里添加后端通信，删除业务实体，并更改前端
            let i=0;
            const size= selectedRowKeys.length;
            let deleteentities:Entity[]=[];
            let deleteentityname:string[]=[];
            for (i ;i<size;i++){
                let tobedeleteentity=(Entitylist).find((obj)=>{return obj.key===selectedRowKeys.at(i);});
                if(tobedeleteentity != null ){
                    if(tobedeleteentity != null ){
                        console.log("suscess");
                        deleteentities.push(tobedeleteentity);
                        deleteentityname.push(tobedeleteentity.entityname);
                        console.log(tobedeleteentity);
                    }
                }
            }
            request("/api/entity/deleteall","DELETE",{name:deleteentityname})
                .then((res)=>{
                    console.log(deleteentities.length);
                    console.log(deleteentities);
                    let remained_Entities:Entity[]=[];
                    let j=0;
                    let length_before=Entitylist.length;
                    for (j;j<length_before;j++){
                        let fuck=(deleteentities).find((obj)=>{return obj.entityname===Entitylist[j].entityname;});
                        console.log(fuck);
                        if( fuck != null){   
                        }else{
                            remained_Entities.push(Entitylist[j]);
                        }
                    }
                    console.log(remained_Entities);
                    setEntitylist(remained_Entities);
                })
                .catch((err)=>{
                    alert(err);
                });
        }
    });
    return (
        <div >
            <AssignEs isOpen={isassignopen}  entityname={assignentity} onClose={()=>setIsassignOpen(false)} onCreateUser={handleCreateUser} ></AssignEs>
            <CreateEn isOpen={isDialogOpen} onClose={()=>setIsDialogOpen(false)} onCreateUser={handleCreateEntity} ></CreateEn>
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
                        render: (_,row) => {
                            return (
                                <div>
                                    {(row.admingname==="")?"暂无系统管理员":("系统管理员 :  "+row.admingname)}
                                </div>
                            );
                        },
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
                dataSource={Entitylist}
            />
        </div>
    );
}
);

export default Entitylist;