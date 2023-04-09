import { Avatar, List, Space, Button, Tag } from "antd";
import React from "react";
import { ProList, hrHRIntl } from "@ant-design/pro-components";
import { Progress } from "antd";
import type { ReactText } from "react";
import { useState } from "react";
import { BUILD_ID_FILE } from "next/dist/shared/lib/constants";
import CreateUser from "./CreateUser";
import {useEffect} from "react";
import { request } from "../../utils/network";
import Manageapp from "./Manageapp";
import resetpassword from "./resetpassword"
import { Md5 } from "ts-md5";
import Column from "antd/es/table/Column";
interface User_to_show{
    key:React.Key;
    username:string;
    departmentname:string;
    entityname:string;
    character:Number;
    whetherlocked:boolean;
    lockedapp:string;
}
interface User_to_store{
    key:React.Key;
    username:string;
    departmentname:string;
    entityname:string;
}
interface User{
  key: React.Key;
  username:string;
  password:string;
  entity:string;
}
interface UserRegister{
  key:React.Key;
  entityname:string;
}

const userlists:User_to_show[]=[{key:1,username:"11",departmentname:"111",entityname:"1111",character:3,whetherlocked:true,lockedapp:"111111111111"},{key:2,username:"12",departmentname:"112",entityname:"1111",character:4,whetherlocked:false,lockedapp:"1111111111"},{key:3,username:"112",departmentname:"111111",entityname:"1111111",character:4,whetherlocked:false,lockedapp:"11111221111111"}];

const Userlist =( () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userlist,setuserlist]=useState<User_to_show[]>([]);
    const [isassignopen,setIsassignOpen]=useState(false);
    const [assignentity,setAssignentity]=useState<string>("");
    useEffect((()=>{
        request(`api/user/es/checkall`,"GET")
        .then((res)=>{
            let initiallist:User_to_show[]=[];
            let size:number=res.length;
            let i=0;
            for (i;i<size;i++){
                initiallist.push({key:res[i].name,username:res[i].name,departmentname:res[i].department,entityname:res[i].entity,character:res[i].indentity,whetherlocked:res[i].locked,lockedapp:res[i].lockedapp});
            }
            setuserlist(initiallist);
        })
        .catch((err)=>{
            alert(err);
        });
    }),[]);

    

    const handleCreateUser = (user: User) => {
    //在这里向后端发送请求
        const userdata={"name":user.username,"entity":user.entity,"password":Md5.hashStr(user.password)};
        // request("/api/entity/assgin","POST",userdata)
        //     .then((res)=>{
        //         //let newEntitilist:Entity[]=[];
        //         let i=0;
        //         let size=Entitylist.length;
        //         for(i;i<size;i++){
        //             if(Entitylist[i].entityname===user.entity){
        //                 Entitylist[i].admingname=user.username;
        //                 //newEntitilist.push(Entitylist[i]);
        //             }else{
        //                 //newEntitilist.push(Entitylist[i]);
        //             }
        //         }
        //         //setEntitylist(newEntitilist);
        //         setIsassignOpen(false);
        //     })
        //     .catch((err)=>{
        //         alert("创建失败");
        //         setIsassignOpen(false);
        //     });
    };

    const handleCreateEntity=((newuser:User_to_show)=>{
    //在这里实现后端通信，添加业务实体，不指派管理员，setEntitylist
        // request("/api/entity/create","POST",{name:entitys.entityname})
        //     .then((res)=>{
        //         const newentity:Entity={key: entitys.entityname,entityname: entitys.entityname,admingname:""};
        //         setEntitylist([...Entitylist,newentity]);
        //         setIsDialogOpen(false);
        //     })
        //     .catch((err)=>{
        //         alert(err);
        //     });
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
    const delete_users=(()=>{
        // if (window.confirm("确认删除所选业务实体？")){
        //     //在这里添加后端通信，删除业务实体，并更改前端
        //     let i=0;
        //     const size= selectedRowKeys.length;
        //     let deleteentities:Entity[]=[];
        //     let deleteentityname:string[]=[];
        //     for (i ;i<size;i++){
        //         let tobedeleteentity=(Entitylist).find((obj)=>{return obj.key===selectedRowKeys.at(i);});
        //         if(tobedeleteentity != null ){
        //             if(tobedeleteentity != null ){
        //                 console.log("suscess");
        //                 deleteentities.push(tobedeleteentity);
        //                 deleteentityname.push(tobedeleteentity.entityname);
        //                 console.log(tobedeleteentity);
        //             }
        //         }
        //     }
        //     request("/api/entity/deleteall","DELETE",{name:deleteentityname})
        //         .then((res)=>{
        //             console.log(deleteentities.length);
        //             console.log(deleteentities);
        //             let remained_Entities:Entity[]=[];
        //             let j=0;
        //             let length_before=Entitylist.length;
        //             for (j;j<length_before;j++){
        //                 let fuck=(deleteentities).find((obj)=>{return obj.entityname===Entitylist[j].entityname;});
        //                 console.log(fuck);
        //                 if( fuck != null){   
        //                 }else{
        //                     remained_Entities.push(Entitylist[j]);
        //                 }
        //             }
        //             console.log(remained_Entities);
        //             setEntitylist(remained_Entities);
        //         })
        //         .catch((err)=>{
        //             alert(err);
        //         });
        // }
    });
    return (
        <div >
            <ProList<User_to_show>
                search={{}}
                toolBarRender={() => {
                    return [
                        <Button key="1" type="primary" onClick={()=>{setIsDialogOpen(true);}}>
                            创建资产管理员
                        </Button>,
                        <Button key="3" type="primary" onClick={()=>{setIsDialogOpen(true)}}>
                            创建员工
                        </Button>,
                        <Button key="2" type="default" danger={true} onClick={delete_users} disabled={!hasSelected}> 删除选中人员</Button>,                        
                    ];
                }}
                pagination={{
                    pageSize: 10,
                }}
                metas={{
                    title: {dataIndex:"username",},
                    description: {
                        render: (_,row) => {
                            return (
                                <div>
                                    {"部门: "+row.departmentname}
                                </div>
                            );
                        },
                    },
                    subTitle: {
                        render: (_, row) => {
                          return (
                            <Space size={0}>
                              {(row.character===3)?<Tag color="blue" key={row.username}>{"资产管理员"}</Tag>
                            :<Tag color="blue" key={row.username}>{"普通员工"}</Tag>  
                            }
                            </Space>
                          );
                        },
                        search: false,
                      },
                      extra: {
                        render: (_,row) =>{
                            return(
                            <div style={{display:"flex",flexDirection:"column"}}>
                                <Button onClick={()=>{}} style={(row.whetherlocked)?{display:"block"}:{display:"none"}}> 解锁用户</Button>
                                <Button onClick={()=>{}} style={(row.whetherlocked)?{display:"none"}:{display:"block"}}> 锁定用户</Button>
                                <Button onClick={()=>{}}> 重置密码</Button>
                            </div>
                            );
                        },
                      },
                    actions: {
                        render: (_,row) => {
                            return (
                                <div style={{display:"flex" ,flexDirection:"column"}}>
                                    <Button onClick={()=>{assign(row.entityname);}} >调整部门</Button>
                                    <Button onClick={()=>{}}> 管理应用 </Button>
                                </div>
                            );
                        },
                    },
                    status: {
                        // 自己扩展的字段，主要用于筛选，不在列表中显示
                        title: '状态',
                        valueType: 'select',
                        valueEnum: {
                          all: { text: '全部', status: 'Default' },
                          open: {
                            text: '未解决',
                            status: 'Error',
                          },
                          closed: {
                            text: '已解决',
                            status: 'Success',
                          },
                          processing: {
                            text: '解决中',
                            status: 'Processing',
                          },
                        },
                      },
                }}
                rowKey="key"
                headerTitle="业务实体内员工列表"
                rowSelection={rowSelection}
                dataSource={userlists}
            />
        </div>
    );
}
);

export default Userlist;