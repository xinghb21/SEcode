import { Avatar, List, Space, Button, Tag, message, Tooltip } from "antd";
import React from "react";
import { ProColumns, ProForm, ProFormSelect, ProFormText, ProList, ProTable, QueryFilter, TableDropdown } from "@ant-design/pro-components";
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
import Appmanage from "./Appmanage";
import { ArrowDownOutlined, ArrowUpOutlined, DownOutlined, LockOutlined, PlusSquareOutlined, UnlockOutlined } from "@ant-design/icons";

export type TableListItem = {
  key: string;
  name: string;
  department: string;
  status: string;
  job: string;
  entity:string;
  lockedapp:string;
};
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
    const [usertable,setusertable] = useState<TableListItem[]>([]);
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
    const [ismanageopen,setmanage]=useState<boolean>(false);
    const [manageappname,setmanagename]=useState<string>("");
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
                        message.warning(err.message);
                    });
                }
            })
            .catch((err)=>{
                message.warning(err.message);
            });
        request("api/user/es/searchuser","POST")
            .then((res)=>{
                let size1:number=(res.data).length;
                let i=0;
                let temptable : TableListItem[] = [];
    
                for (i;i<size1;i++){
                    temptable.push({key:res.data[i].name,
                        name:res.data[i].name,
                        department:res.data[i].department,
                        job:(res.data[i].identity === 3)?"ep":"em",
                        status:(res.data[i].locked)?"locked":"unlocked",
                        lockedapp:res.data[i].lockedapp,
                        entity:res.data[i].entity
                    });
                }
                setusertable(temptable);
                // message.success("查询成功");
            })
            .catch((err)=>{
                message.warning(err.message);
            });

    }),[castnum]);
    const columns: ProColumns<TableListItem>[] = [
        {
            title: "用户名",
            width: 80,
            dataIndex: "name",
            copyable: true,
            ellipsis: true,
        },
        {
            title: "部门",
            dataIndex: "department",
            width: 80,
            copyable: true,
            ellipsis: true,
        // valueEnum: departmentlsit.map((item)=>{return {text:item.label,value:item.value};}),
        // align: 'center',
        // sorter: (a, b) => a.containers - b.containers,
        },
        {
            title: "状态",
            width: 80,
            dataIndex: "status",
            hideInSearch: true,
            filters: true,
            onFilter: true,
            // align: 'center',
            valueEnum: {
                unlocked: { text:"正常", status: "Success" },
                locked: { text: "被锁定", status: "Error" },
            },
            render: (text, row) => [
                (row.status === "unlocked")?
                (<div>
                    <Tag color="green" key={row.status}>正常</Tag>
                    <span>
                        <Tooltip placement="bottom" title={<span>点击锁定</span>}>
                            <UnlockOutlined style={{ marginLeft: 10 }} onClick={() => lock(row.name)} />
                        </Tooltip>
                    </span>
                </div>):
                (<div>
                    <Tag color="red" key={row.status}>被锁定</Tag>
                    <span>
                        <Tooltip placement="bottom" title={<span>点击解锁</span>}>
                            <LockOutlined style={{ marginLeft: 10 }} onClick={() => unlock(row.name)} />
                        </Tooltip>
                    </span>
                </div>)
            ]
        },
        {
            title: "职位",
            width: 80,
            dataIndex: "job",
            hideInSearch: true,
            filters: true,
            onFilter: true,
            // align: 'center',
            valueEnum: {
                em: { text: "👨‍🔧普通员工"},
                ep: { text: "💼资产管理员"},
            },
            render: (text, row) => [
                (row.job === "em")?
                (<div>
                    <span>👨‍🔧普通员工</span>
                    <span>
                        <Tooltip placement="bottom" title={<span>升职为资产管理员</span>}>
                            <ArrowUpOutlined  style={{ marginLeft: 10 }} onClick={() => changepos(row)} />
                        </Tooltip>
                    </span>
                </div>):
                (<div>
                    <span>💼资产管理员</span>
                    <span>
                        <Tooltip placement="bottom" title={<span>降职为普通员工</span>}>
                            <ArrowDownOutlined style={{ marginLeft: 10 }} onClick={() => changepos(row)} />
                        </Tooltip>
                    </span>
                </div>)
            ]
        },
        {
            title: "操作",
            valueType: "option",
            width: 80,
            key: "option",
            render: (text, row, _) => [
                <Button key="outer" onClick={()=>{assign({key:row.name,username: row.name , Department:row.department});}} >调整部门</Button>,
                <TableDropdown
                    key="actionGroup"
                    onSelect={(key) => {
                        if(key === "app"){
                            setmanagename(row.name);
                            setmanage(true);
                        }else if(key === "reset"){
                            setresetname(row.name);
                            setisreset(true);
                        }else if(key === "lock"){
                            lock(row.name);
                        }else if(key === "unlock"){
                            unlock(row.name);
                        }else if(key === "down"){
                            changepos(row);
                        }else if(key === "up"){
                            changepos(row);
                        }
                    }}
                    menus={[
                        { key: "app", name: "管理应用" },
                        { key: "reset", name: "重置密码" },
                        (row.status === "unlocked")?{ key: "lock", name: "锁定" }:{ key: "unlock", name: "解锁" },
                        (row.job === "ep")?{ key: "down", name: "降职" }:{ key: "up", name: "升职" },
                    ]}
                />,
            ],
        },
    ];


    

    const handleCreateUser = (user: UserRegister) => {
        if( user.username!== "" && user.department !== ""){
            request("api/user/createuser","POST",{name:user.username,password:user.password,entity:user.entityname,department:user.department,identity:user.identity})
                .then((res)=>{
                    setusertable([...usertable,{key:user.username,name:user.username,department:user.department,job:(user.identity=== 3)?"ep":"em",status:"unlocked",entity:user.entityname,lockedapp:(user.identity===3?"000001110":"000000001")}]);
                    setIsDialogOpen1(false);
                    setIsDialogOpen2(false);
                })
                .catch((err)=>{
                    message.warning(err.message);
                    setIsDialogOpen1(false);
                    setIsDialogOpen2(false);
                });
        }else{
            message.warning("用户名或部门为空");
            setIsDialogOpen1(false);
            setIsDialogOpen2(false);
        }
    };


    const reset=((newuser:User_Password)=>{
        request("api/user/es/reset","POST",{name:newuser.username,newpassword:Md5.hashStr(newuser.newpassword)})
            .then((res)=>{
                message.success("成功重置该员工密码");
                setisreset(false);
            })
            .catch((err)=>{
                message.warning(err.message);
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
                message.warning(err.message);
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
                    message.warning(err.message);
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
                message.warning(err.message);
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
                message.warning(err.message);
            });
    });
    const changepos=((changeuser:TableListItem)=>{
        request("api/user/es/changeidentity","POST",{name:changeuser.name,new:((changeuser.job==="ep")?4:3),department:changeuser.department,entity:changeuser.entity})
            .then((res)=>{
                let i=castnum+1;
                setcastnum(i);
                let messages:string="成功将"+changeuser.name+"改为"+((changeuser.job==="em")?"资产管理员":"普通员工");
                message.success(messages);
            })
            .catch((err)=>{
                message.warning(err.message);
            });
    });
    return (
        <div >
            <Appmanage isOpen={ismanageopen} username={manageappname} onClose={()=>{setmanage(false);}}>  </Appmanage>
            <CreateUser isOpen={isDialogOpen1} onClose={()=>setIsDialogOpen1(false)} entityname={entity} departmentlist={departmentlsit} onCreateUser={handleCreateUser} ></CreateUser>
            <CreateUser2 isOpen={isDialogOpen2} onClose={()=>setIsDialogOpen2(false)} entityname={entity} departmentlist={departmentlsit} onCreateUser={handleCreateUser} ></CreateUser2>
            <Resetpassword isOpen={isrest} onClose={()=>{setisreset(false);}} username={resetname} onCreateUser={reset} ></Resetpassword>
            <CreateDE isOpen={isDEOpen} onClose={()=>{setisDEOpen(false);}} username={apdDEname} departmentlist={departmentlsit} onCreateUser={handleapdDE}  olddepartment={olddepartment}></CreateDE>
            <Manageapp isOpen={isappOpen} onClose={()=>{setappopen(false);}} username={appapduser?.username} applist={appapduser?.oldapplist} identity={appapduser.identity} Onok={()=>{setappopen(false);let i=castnum+1;setcastnum(i);}}></Manageapp>
            <ProTable<TableListItem>
                rowSelection={rowSelection}
                columns={columns}
                request={(params, sorter, filter) => {
                    // 表单搜索项会从 params 传入，传递给后端接口。
                    console.log("hello world");
                    console.log(params);
                    let tableListDataSource: TableListItem[] = [];
                    let success:boolean = true;
                    request("api/user/es/searchuser","POST",{username:params.name,department:params.department,identity:(params.job)?((params.job === "ep")?3:4):undefined})
                        .then((res)=>{
                            let size1:number=(res.data).length;
                            let i=0;
                            let temptable : TableListItem[] = [];

                            for (i;i<size1;i++){
                                temptable.push({key:res.data[i].name,
                                    name:res.data[i].name,
                                    department:res.data[i].department,
                                    job:(res.data[i].identity === 3)?"ep":"em",
                                    status:(res.data[i].locked)?"locked":"unlocked",
                                    lockedapp:res.data[i].lockedapp,
                                    entity:res.data[i].entity
                                });
                            }
                            setusertable(temptable);
                            success = true;
                        // message.success("查询成功");
                        })
                        .catch((err)=>{
                            success = false;
                            message.warning(err.message);
                        });
                    return Promise.resolve({
                        data: [],
                        success: success,
                    });
                }}
                rowKey="key"
                pagination={{
                    showQuickJumper: true,
                }}
                search={{
                    labelWidth: "auto",
                }}
                dateFormatter="string"
                dataSource={usertable}
                headerTitle="员工列表"
                toolBarRender={() => [
                    <Button key="1" type="primary" onClick={()=>{setIsDialogOpen1(true);}}>
                    创建资产管理员
                    </Button>,
                    <Button key="3" type="primary" onClick={()=>{setIsDialogOpen2(true);}}>
                    创建企业员工
                    </Button>,
                    <Button key="2" type="default" danger={true} onClick={delete_users} disabled={!hasSelected}> 删除选中人员</Button>,                        
                ]}
            />
        </div>
    );
}
);

export default Userlist;