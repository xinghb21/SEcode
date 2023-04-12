import { Avatar, List, Space, Button, Tag, message } from "antd";
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
import CreateUser2 from "./CreateUser2";
import CreateDE from "./CreateDE";
import Manageapp from "./Manageapp";
interface User_to_show{
    key:React.Key;
    username:string;
    departmentname:string;
    entityname:string;
    character:number;
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
interface User_app{
    username:string;
    oldapplist:string;
    identity:number;
}

const userlists:User_to_show[]=[{key:1,username:"11",departmentname:"111",entityname:"1111",character:3,whetherlocked:true,lockedapp:"111111111111"},{key:2,username:"12",departmentname:"112",entityname:"1111",character:4,whetherlocked:false,lockedapp:"1111111111"},{key:3,username:"112",departmentname:"111111",entityname:"1111111",character:4,whetherlocked:false,lockedapp:"11111221111111"}];

const Userlist =( () => {
    const [castnum,setcastnum]=useState<number>(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isDialogOpen1, setIsDialogOpen1] = useState(false);
    const [isDialogOpen2,setIsDialogOpen2]=useState(false);
    const [userlist,setuserlist]=useState<User_to_show[]>([]);
    const [isrest,setisreset]=useState<boolean>(false);
    const [departmentlsit,setdepartmentlist]=useState<department_to_show[]>([]);
    const [entity,setentityname]=useState<string>("");
    const [resetname,setresetname]=useState<string>("");
    const [isDEOpen,setisDEOpen]=useState<boolean>(false);
    const [apdDEname,setapdEDname]=useState<string>("");
    const [olddepartment,setdepartment]=useState<string>("");
    const [appapduser,setappapduser]=useState<User_app>({username:"",identity:-1,oldapplist:""});
    const [isappOpen,setappopen]=useState<boolean>(false);
    useEffect((()=>{
        request("api/user/es/checkall","GET")
            .then((res)=>{
                let initiallist:User_to_show[]=[];
                let size1:number=(res.data).length;
                let i=0;
                console.log(size1);
                for (i;i<size1;i++){
                    initiallist.push({key:res.data[i].name,username:res.data[i].name,departmentname:res.data[i].department,entityname:res.data[i].entity,character:res.data[i].identity as number,whetherlocked:res.data[i].locked,lockedapp:res.data[i].lockedapp});
                }
                setuserlist(initiallist);
                console.log(initiallist);
                let entitynames =localStorage.getItem("entityname")?localStorage.getItem("entityname"):"";
                setentityname( entitynames?entitynames:"" );
                if(castnum===1){
                    request("api/entity/getalldep","GET").then((res)=>{
                        let departs:department_to_show[]=[];
                        let size=res.data.length;
                        for(let i=0;i<size;i++){
                            departs.push({value:res.data[i] ,label:res.data[i]});
                        }
                        setdepartmentlist(departs);
                    }).catch((err)=>{
                        alert(err);
                    });
                }
            })
            .catch((err)=>{
                alert(err);
            });

    }),[castnum]);

    

    const handleCreateUser = (user: UserRegister) => {
        
        request("api/user/createuser","POST",{name:user.username,password:user.password,entity:user.entityname,department:user.department,identity:user.identity})
            .then((res)=>{
                setuserlist([...userlist,{key:user.username,username:user.username,departmentname:user.department,entityname:user.entityname,character:user.identity,whetherlocked:false,lockedapp:(user.identity===3?"000001110":"000000001")}]);
                setIsDialogOpen1(false);
                setIsDialogOpen2(false);
            })
            .catch((err)=>{
                alert(err);
            });
    };


    const reset=((newuser:User_Password)=>{
        request("api/user/es/reset","POST",{name:newuser.username,newpassword:Md5.hashStr(newuser.newpassword)})
            .then((res)=>{
                message.success("成功重置该员工密码");
                setisreset(false);
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
    const assign=((user:User_DEpartment)=>{
        setapdEDname(user.username);
        setdepartment(user.Department);
        setisDEOpen(true);
    });
    const handleapdDE =((newde:User_DEpartment)=>{
        request("api/user/es/alter","POST",{name:newde.username,department:newde.Department})
            .then((res)=>{
                let i=0;
                let size=userlist.length;
                let newuserlist:User_to_show[]=[];
                for(i;i<size;i++){
                    if(userlist[i].username===newde.username){
                        newuserlist.push( userlist[i]);
                        newuserlist[i].departmentname=newde.Department;
                    }else{
                        newuserlist.push(userlist[i]);
                    }   
                }
                setuserlist(newuserlist);
                setisDEOpen(false);
            })
            .catch((err)=>{
                alert(err);
            });

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
            request("/api/user/es/batchdelete","DELETE",{names:deletedusername})
                .then((res)=>{
                    let i=castnum+1;
                    setcastnum(i);
                    setSelectedRowKeys([]);
                })
                .catch((err)=>{
                    alert(err);
                });
        }
    });
    const lock=((name:string)=>{
        request("api/user/es/lock","POST",{name:name})
            .then((res)=>{
                let i=castnum+1;
                setcastnum(i);
                message.success("成功锁定该用户");
            })
            .catch((err)=>{
                alert(err);
            });
    });
    const unlock=((name:string)=>{
        request("api/user/es/unlock","POST",{name:name})
            .then((res)=>{
                let i=castnum+1;
                setcastnum(i);
                message.success("成功解锁该用户");
            })
            .catch((err)=>{
                alert(err);
            });
    });
    const changepos=((changeuser:User_to_show)=>{
        request(`api/user/es/changeidentity`,"POST",{name:changeuser.username,new:((changeuser.character===3)?4:3),department:changeuser.departmentname,entity:changeuser.entityname})
        .then((res)=>{
            let i=castnum+1;
            setcastnum(i);
            let messages:string="成功将"+changeuser.username+"改为"+((changeuser.character===4)?"资产管理员":"普通员工");
            message.success(messages);
        })
        .catch((err)=>{
            message.warning(err.message);
        });
    });
    return (
        <div >
            <QueryFilter labelWidth="auto" onFinish={async (values) => {
                    request(`api/user/es/searchuser`,"POST",{username:values.username,department:values.department,identity:values.identity})
                    .then((res)=>{
                        let initiallist:User_to_show[]=[];
                        let size1:number=(res.data).length;
                        let i=0;
                        console.log(size1);
                        for (i;i<size1;i++){
                            initiallist.push({key:res.data[i].name,username:res.data[i].name,departmentname:res.data[i].department,entityname:res.data[i].entity,character:res.data[i].identity as number,whetherlocked:res.data[i].locked,lockedapp:res.data[i].lockedapp});
                        }
                        setuserlist(initiallist);
                        message.success('查询成功');
                    })
                    .catch((err)=>{
                        alert(err);
                    });
                    }}
                >
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="username"
                            label="员工姓名"
                            tooltip="最长为 128 位"
                            placeholder="请输入名称"
                        />
                        <ProFormSelect
                            options={departmentlsit}
                            width="xs"
                            name="department"
                            label="员工部门"
                        />
                        <ProFormSelect
                            options={[
                                {value:3,label:"资产管理员"},
                                {value:4,label:"企业员工"}
                            ]}
                            width="xs"
                            name="identity"
                            label="员工类型"
                        />
                    </ProForm.Group>
                </QueryFilter>
            <CreateUser isOpen={isDialogOpen1} onClose={()=>setIsDialogOpen1(false)} entityname={entity} departmentlist={departmentlsit} onCreateUser={handleCreateUser} ></CreateUser>
            <CreateUser2 isOpen={isDialogOpen2} onClose={()=>setIsDialogOpen2(false)} entityname={entity} departmentlist={departmentlsit} onCreateUser={handleCreateUser} ></CreateUser2>
            <Resetpassword isOpen={isrest} onClose={()=>{setisreset(false);}} username={resetname} onCreateUser={reset} ></Resetpassword>
            <CreateDE isOpen={isDEOpen} onClose={()=>{setisDEOpen(false);}} username={apdDEname} departmentlist={departmentlsit} onCreateUser={handleapdDE}  olddepartment={olddepartment}></CreateDE>
            <Manageapp isOpen={isappOpen} onClose={()=>{setappopen(false);}} username={appapduser?.username} applist={appapduser?.oldapplist} identity={appapduser.identity} Onok={()=>{setappopen(false);let i=castnum+1;setcastnum(i);}}></Manageapp>
            <ProList<User_to_show>
                toolBarRender={() => {
                    return [
                        <Button key="1" type="primary" onClick={()=>{setIsDialogOpen1(true);}}>
                            创建资产管理员
                        </Button>,
                        <Button key="3" type="primary" onClick={()=>{setIsDialogOpen2(true);}}>
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
                                    <Button onClick={()=>{unlock(row.username);}} style={(row.whetherlocked)?{display:"block"}:{display:"none"}}> 解锁用户</Button>
                                    <Button onClick={()=>{lock(row.username);}} style={(row.whetherlocked)?{display:"none"}:{display:"block"}}> 锁定用户</Button>
                                    <Button onClick={()=>{setresetname(row.username);setisreset(true);}}> 重置密码</Button>
                                    <Button onClick={()=>{changepos(row)}} style={(row.character===3)?{display:"block"}:{display:"none"}}> 降职 </Button>
                                    <Button onClick={()=>{changepos(row)}}  style={(row.character===4)?{display:"block"}:{display:"none"}}> 升职</Button>
                                </div>
                            );
                        },
                    },
                    actions: {
                        render: (_,row) => {
                            return (
                                <div style={{display:"flex" ,flexDirection:"column"}}>
                                    <Button onClick={()=>{assign({key:row.username,username: row.username , Department:row.departmentname});}} >调整部门</Button>
                                    <Button onClick={()=>{ setappapduser({username:row.username,identity:row.character,oldapplist:row.lockedapp});setappopen(true);}}> 管理应用 </Button>
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