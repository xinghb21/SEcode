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
import Resetpassword from "./resetpassword"
import { Md5 } from "ts-md5";
import Column from "antd/es/table/Column";
import CreateUser2 from "./CreateUser2"
import CreateDE from "./CreateDE"
interface User_to_show{
    key:React.Key;
    username:string;
    departmentname:string;
    entityname:string;
    character:Number;
    whetherlocked:boolean;
    lockedapp:string;
}
interface User_DEpartment{
    key: React.Key;
    username:string;
    Department:string;
  }
interface User_to_store{
    key:React.Key;
    username:string;
    departmentname:string;
    entityname:string;
}
interface UserRegister{
    key: React.Key;
    username:string;
    password:string;
    identity:number;
    entityname:string;
      department:string;
}

interface department_to_show{
    value:string;
    label:string;
}
interface User_Password{
    key: React.Key;
    username:string;
    newpassword:string;
  }

const userlists:User_to_show[]=[{key:1,username:"11",departmentname:"111",entityname:"1111",character:3,whetherlocked:true,lockedapp:"111111111111"},{key:2,username:"12",departmentname:"112",entityname:"1111",character:4,whetherlocked:false,lockedapp:"1111111111"},{key:3,username:"112",departmentname:"111111",entityname:"1111111",character:4,whetherlocked:false,lockedapp:"11111221111111"}];

const Userlist =( () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isDialogOpen1, setIsDialogOpen1] = useState(false);
    const [isDialogOpen2,setIsDialogOpen2]=useState(false);
    const [userlist,setuserlist]=useState<User_to_show[]>([]);
    const [isassignopen,setIsassignOpen]=useState(false);
    const [assignentity,setAssignentity]=useState<string>("");
    const [isrest,setisreset]=useState<boolean>(false);
    const [departmentlsit,setdepartmentlist]=useState<department_to_show[]>([]);
    const [entity,setentityname]=useState<string>("");
    const [resetname,setresetname]=useState<string>("");
    const [isDEOpen,setisDEOpen]=useState<boolean>(false);
    const [apdDEname,setapdEDname]=useState<string>("");
    const [olddepartment,setdepartment]=useState<string>("");
    useEffect((()=>{
        request(`api/user/es/checkall`,"GET")
        .then((res)=>{
            let initiallist:User_to_show[]=[];
            let size:number=res.length;
            let i=0;
            let departments:department_to_show[]=[];
            for (i;i<size;i++){
                initiallist.push({key:res.data[i].name,username:res.data[i].name,departmentname:res.data[i].department,entityname:res.data[i].entity,character:res.data[i].indentity,whetherlocked:res.data[i].locked,lockedapp:res.data[i].lockedapp});
                if(departments.find((obj)=>{return obj.value===res.data[i].department})!=null){

                }else{
                    departments.push({value:res.data[i].department,label:res.data[i].department});
                }
            }
            setdepartmentlist(departments);
            setuserlist(initiallist);
            let entitynames =localStorage.getItem("entityname")?localStorage.getItem("entityname"):"";
            setentityname( entitynames?entitynames:"" );
        })
        .catch((err)=>{
            alert(err);
        });
    }),[]);

    

    const handleCreateUser = (user: UserRegister) => {
        
        request('api/user/createuser',"POST",{name:user.username,password:user.password,entity:user.entityname,department:user.department,identity:user.identity})
        .then((res)=>{
            setuserlist([...userlist,{key:user.username,username:user.username,departmentname:user.department,entityname:user.entityname,character:user.identity,whetherlocked:false,lockedapp:(user.identity===3?"000001110":"000000001")}]);
        })
        .catch((err)=>{
            alert(err);
        })
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
    const reset=((newuser:User_Password)=>{
            request(`api/user/es/reset`,"POST",{name:newuser.username,newpassword:Md5.hashStr(newuser.newpassword)})
            .then((res)=>{
                
            })
            .catch((err)=>{

            })
    });
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };
    const hasSelected = selectedRowKeys.length > 0;
    const assign=((user:User_DEpartment)=>{
        setapdEDname(user.username);
        setdepartment(user.Department);
    });
    const handleapdDE =((newde:User_DEpartment)=>{
        request(`api/user/es/alter`,"POST",{name:newde.username,department:newde.Department})
        .then()
        .catch()
    });
    const delete_users=(()=>{
         if (window.confirm("确认删除所选人员？")){
             //在这里添加后端通信，删除业务实体，并更改前端
             let i=0;
             const size= selectedRowKeys.length;
             let deleteuser:User_to_show[]=[];
             let deletedusername:string[]=[];
             //删除列表
             for (i ;i<size;i++){
                 let tobedeleteuser=(userlist).find((obj)=>{return obj.key===selectedRowKeys.at(i);});
                 if(tobedeleteuser != null ){
                     if(tobedeleteuser != null ){
                         //console.log("suscess");
                         deleteuser.push(tobedeleteuser);
                         deletedusername.push(tobedeleteuser.username);
                         //console.log(tobedeleteentity);
                     }
                 }
             }
             request("/api/user/es/batchdelete","DELETE",{name:deletedusername})
                 .then((res)=>{
                    // console.log(deletedusername.length);
                    // console.log(deleteentities);
                     let remained_user:User_to_show[]=[];
                     let j=0;
                     let length_before=userlist.length;
                     for (j;j<length_before;j++){
                         let fuck=(deleteuser).find((obj)=>{return obj.username===userlist[j].username;});
                         console.log(fuck);
                         if( fuck != null){   
                         }else{
                             remained_user.push(userlist[j]);
                         }
                     }
                     //console.log(remained_Entities);
                     setuserlist(remained_user);
                 })
                 .catch((err)=>{
                     alert(err);
                 });
         }
    });

    return (
        <div >
            <CreateUser isOpen={isDialogOpen1} onClose={()=>setIsDialogOpen1(false)} entityname={entity} departmentlist={departmentlsit} onCreateUser={handleCreateUser} ></CreateUser>
            <CreateUser2 isOpen={isDialogOpen2} onClose={()=>setIsDialogOpen2(false)} entityname={entity} departmentlist={departmentlsit} onCreateUser={handleCreateUser} ></CreateUser2>
            <Resetpassword isOpen={isrest} onClose={()=>{setisreset(false);}} username={resetname} onCreateUser={reset} ></Resetpassword>
            <CreateDE isOpen={isDEOpen} onClose={()=>{setisDEOpen(false);}} username={apdDEname} departmentlist={departmentlsit} onCreateUser={handleapdDE}  olddepartment={olddepartment}></CreateDE>
            <ProList<User_to_show>
                search={{}}
                toolBarRender={() => {
                    return [
                        <Button key="1" type="primary" onClick={()=>{setIsDialogOpen1(true);}}>
                            创建资产管理员
                        </Button>,
                        <Button key="3" type="primary" onClick={()=>{setIsDialogOpen2(true)}}>
                            创建企业员工
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
                                <Button onClick={()=>{setresetname(row.username)}}> 重置密码</Button>
                            </div>
                            );
                        },
                      },
                    actions: {
                        render: (_,row) => {
                            return (
                                <div style={{display:"flex" ,flexDirection:"column"}}>
                                    <Button onClick={()=>{assign({key:row.username,username: row.username , Department:row.departmentname});}} >调整部门</Button>
                                    <Button onClick={()=>{}}> 管理应用 </Button>
                                </div>
                            );
                        },
                    },
                }}
                rowKey="key"
                headerTitle="业务实体内员工列表"
                rowSelection={rowSelection}
                dataSource={userlist}
            />
        </div>
    );
}
);

export default Userlist;