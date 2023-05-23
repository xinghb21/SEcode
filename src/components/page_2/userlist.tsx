import { Avatar, List, Space, Button, Tag, message, Tooltip, Typography, Spin, Popconfirm } from "antd";
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

import Pagination from "antd";

const { Text } = Typography;

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

const Userlist =( () => {
    const [isSpinning, setSpnning] = useState(false);
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
    const [ searchname , setsearchname ] = useState<any>();
    const [ searchdepartment,setsearchdepart ] = useState<any>();
    const [ iscr1loading, setscr1loading ] = useState<boolean>(false);
    const [ iscr2loading, setscr2loading ] = useState<boolean>(false);
    const [ searchidentity,setsearchidentity ] = useState<any>();
    const [ isrsloading,setrsloading  ] = useState<boolean>(false);
    const [isDeloading, setisDeloading ] = useState<boolean>(false);
    const [deleloading, setdeleloading ] =useState<boolean>(false); 
    const [pagenation,setpagenation] = useState({
        current: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总记录数
    });
    useEffect((()=>{
        setSpnning(true);
        request("api/user/es/searchuser","POST",{page:pagenation.current,username:searchname,department:searchdepartment,identity:searchidentity})
            .then((res)=>{
                let size1:number=(res.data).length;
                let i=0;
                let temptable : User_to_show[] = [];
                for (i;i<size1;i++){
                    temptable.push({
                        username:res.data[i].name,
                        departmentname:res.data[i].department,
                        character:(res.data[i].identity === 3)?3:4,
                        whetherlocked:(res.data[i].locked)?true:false,
                        lockedapp:res.data[i].lockedapp,
                        entityname:res.data[i].entity,
                        key: res.data[i].name +" "+res.data[i].department,
                    });
                }
                setpagenation({current: pagenation.current,pageSize:pagenation.pageSize,total:res.count});
                setuserlist(temptable);
                if(castnum===1){
                    let entity = localStorage.getItem("entity");
                    setentityname(entity?entity:"");
                    request("api/entity/getalldep","GET").then((res)=>{
                        let departs:department_to_show[]=[];
                        let size=res.data.length;
                        for(let i=0;i<size;i++){
                            departs.push({value:res.data[i] ,label:res.data[i]});
                        }
                        setdepartmentlist(departs);
                    }).catch((err)=>{
                        setSpnning(false);
                        message.warning(err.message);
                    });
                }
                setTimeout(() => {
                    setSpnning(false);
                }, 500);
            })
            .catch((err)=>{
                setSpnning(false);
                message.warning(err.message);
            });

    }),[castnum]);
    const columns: ProColumns<User_to_show>[] = [
        {
            title: "用户名",
            dataIndex: "username",
            copyable: true,
            ellipsis: true,
            width:"20%"
        },
        {
            title: "部门",
            dataIndex: "departmentname",
            copyable: true,
            ellipsis: true,
            width:"20%",
            request:async ()=>{
                let departs:department_to_show[]=[];
                request("api/entity/getalldep","GET")
                    .then((res)=>{
                        let size=res.data.length;
                        for(let i=0;i<size;i++){
                            departs.push({value:res.data[i] ,label:res.data[i]});
                        }})
                    .catch((err)=>{
                        message.warning(err.message);
                    });
                return departs;
            },
        // valueEnum: departmentlsit.map((item)=>{return {text:item.label,value:item.value};}),
        // align: 'center',
        // sorter: (a, b) => a.containers - b.containers,
        },
        {
            title: "状态",
            dataIndex: "whetherlocked",
            width:"20%",
            hideInSearch: true,
            ellipsis: true,
            // align: 'center',
            valueEnum: {
                unlocked: { text:"正常", status: "Success" },
                locked: { text: "被锁定", status: "Error" },
            },
            render: (text, row) => [
                (!row.whetherlocked)?
                    (<div>
                        <Tag color="green" key={row.username}>正常</Tag>
                        <span>
                            <Tooltip placement="bottom" title={<span>点击锁定</span>}>
                                <UnlockOutlined style={{ marginLeft: 10 }} onClick={() => lock(row.username)} />
                            </Tooltip>
                        </span>
                    </div>):
                    (<div>
                        <Tag color="red" key={row.username}>被锁定</Tag>
                        <span>
                            <Tooltip placement="bottom" title={<span>点击解锁</span>}>
                                <LockOutlined style={{ marginLeft: 10 }} onClick={() => unlock(row.username)} />
                            </Tooltip>
                        </span>
                    </div>)
            ]
        },
        {
            title: "职位",
            width: "20%",
            dataIndex: "character",
            ellipsis: true,
            
            valueEnum:{
                3:"资产管理员",
                4:"企业员工",
            },
            // align: 'center',
            render: (text, row) => [
                (row.character === 4)?
                    (<div>
                        <span>👨‍🔧普通员工</span>
                        <span>
                            <Tooltip placement="bottom" title={<span>升职为资产管理员</span>}>
                                <ArrowUpOutlined  style={{ marginLeft: 10 }} onClick={() => {                            
                                    let temp = row;
                                    temp.character=3;
                                    changepos(temp);}} 
                                />
                            </Tooltip>
                        </span>
                    </div>):
                    (<div>
                        <span>💼资产管理员</span>
                        <span>
                            <Tooltip placement="bottom" title={<span>降职为普通员工</span>}>
                                <ArrowDownOutlined style={{ marginLeft: 10 }} onClick={() => {                            
                                    let temp = row;
                                    temp.character=4;
                                    changepos(temp);
                                }} />
                            </Tooltip>
                        </span>
                    </div>)
            ]
        },
        {
            title: "操作",
            valueType: "option",
            width: "20%",
            key: "option",
            render: (text, row, _) => [
                <Button key="outer" onClick={()=>{assign({key:row.username,username: row.username , Department:row.departmentname});}} >调整部门</Button>,
                <TableDropdown
                    key="actionGroup"
                    onSelect={(key) => {
                        if(key === "app"){
                            setmanagename(row.username);
                            setmanage(true);
                        }else if(key === "reset"){
                            setresetname(row.username);
                            setisreset(true);
                        }else if(key === "lock"){
                            lock(row.username);
                        }else if(key === "unlock"){
                            unlock(row.username);
                        }else if(key === "down"){
                            let temp = row;
                            temp.character=4;
                            changepos(temp);
                        }else if(key === "up"){
                            let temp = row;
                            temp.character=3;
                            changepos(temp);
                        }
                    }}
                    menus={[
                        { key: "app", name: "管理应用" },
                        { key: "reset", name: "重置密码" },
                        (!row.whetherlocked)?{ key: "lock", name: "锁定" }:{ key: "unlock", name: "解锁" },
                        ((row.character === 3))?{ key: "down", name: "降职" }:{ key: "up", name: "升职" },
                    ]}
                />,
            ],
        },
    ];
    const handleCreateUser = (user: UserRegister) => {
        if( user.username!== "" && user.department !== ""){
            if(user.identity === 3){
                setscr1loading(true);
            }else{
                setscr2loading(true);
            }
            request("api/user/createuser","POST",{name:user.username,password:user.password,entity:user.entityname,department:user.department,identity:user.identity})
                .then((res)=>{
                    if(user.identity === 3){
                        setscr1loading(false);
                    }else{
                        setscr2loading(false);
                    }
                    setcastnum(castnum+1);
                    setcastnum(castnum+1);
                    setIsDialogOpen1(false);
                    setIsDialogOpen2(false);
                })
                .catch((err)=>{
                    if(user.identity === 3){
                        setscr1loading(false);
                    }else{
                        setscr2loading(false);
                    }
                    message.warning(err.message);
                });
        }else{
            message.warning("用户名或部门为空");
            setIsDialogOpen1(false);
            setIsDialogOpen2(false);
        }
    };


    const reset=((newuser:User_Password)=>{
        setrsloading(true);
        request("api/user/es/reset","POST",{name:newuser.username,newpassword:Md5.hashStr(newuser.newpassword)})
            .then((res)=>{
                message.success("成功重置该员工密码");
                setrsloading(false);
                setisreset(false);
            })
            .catch((err)=>{
                setrsloading(false);
                setisreset(false);
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
        setisDeloading(true);
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
                setisDeloading(false);
                setuserlist(newuserlist);
                setisDEOpen(false);
            })
            .catch((err)=>{
                setisDeloading(false);
                message.warning(err.message);
            });

    });
    const delete_users=(()=>{

        
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
        setdeleloading(true);
        request("/api/user/es/batchdelete","DELETE",{names:deletedusername})
            .then((res)=>{
                let i=castnum+1;
                setcastnum(i);
                setSelectedRowKeys([]);
                setdeleloading(false);
            })
            .catch((err)=>{
                setdeleloading(false);
                message.warning(err.message);
            });
        
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
    const changepos=((changeuser:User_to_show)=>{
        request("api/user/es/changeidentity","POST",{name:changeuser.username,new:changeuser.character,department:changeuser.departmentname,entity:changeuser.entityname})
            .then((res)=>{
                let i=castnum+1;
                setcastnum(i);
                let messages:string="成功将"+changeuser.username+"改为"+((changeuser.character===3)?"资产管理员":"普通员工");
                message.success(messages);
            })
            .catch((err)=>{
                message.warning(err.message);
            });
    });
    return (
        <div >
           
            <Appmanage isOpen={ismanageopen} username={manageappname} onClose={()=>{setmanage(false);}}>  </Appmanage>
            <CreateUser isOpen={isDialogOpen1} onClose={()=>setIsDialogOpen1(false)} entityname={entity} departmentlist={departmentlsit} onCreateUser={handleCreateUser} loading={iscr1loading} ></CreateUser>
            <CreateUser2 isOpen={isDialogOpen2} loading={iscr2loading} onClose={()=>setIsDialogOpen2(false)} entityname={entity} departmentlist={departmentlsit} onCreateUser={handleCreateUser} ></CreateUser2>
            <Resetpassword isOpen={isrest} onClose={()=>{setisreset(false);}} username={resetname} onCreateUser={reset} loading={isrsloading} ></Resetpassword>
            <CreateDE isOpen={isDEOpen}  loading={isDeloading} onClose={()=>{setisDEOpen(false);}} username={apdDEname} departmentlist={departmentlsit} onCreateUser={handleapdDE}  olddepartment={olddepartment}></CreateDE>
           
            <Spin spinning={isSpinning}>
                <ProTable<User_to_show>
                    rowSelection={rowSelection}
                    columns={columns}
                    options={false}
                    request={(params, sorter, filter) => {
                        // 表单搜索项会从 params 传入，传递给后端接口。
                        setSelectedRowKeys([]);
                        console.log("hello world");
                        console.log(params);
                        let success:boolean = true;
                        setsearchname(params.username);
                        setsearchdepart(params.departmentname);
                        setsearchidentity(params.character);
                        setSpnning(true);
                        request("api/user/es/searchuser","POST",{page:params.current,username:params.username,department:params.departmentname,identity:params.character})
                            .then((res)=>{
                                    
                                let size1:number=(res.data).length;
                                let i=0;
                                let temptable : User_to_show[] = [];
                                for (i;i<size1;i++){
                                    temptable.push({
                                        username:res.data[i].name,
                                        departmentname:res.data[i].department,
                                        character:(res.data[i].identity === 3)?3:4,
                                        whetherlocked:(res.data[i].locked)?true:false,
                                        lockedapp:res.data[i].lockedapp,
                                        entityname:res.data[i].entity,
                                        key: res.data[i].name +" "+res.data[i].department,
                                    });
                                }
                                setpagenation({current:params.page,pageSize:pagenation.pageSize,total:res.count});
                                setuserlist(temptable);
                                success = true;
                                setSpnning(false);
                                message.success("刷新成功");
                            })
                            .catch((err)=>{
                                success = false;
                                setSpnning(false);
                                message.warning(err.message);
                            });
                        return Promise.resolve({
                            data: [],
                            success: success,
                        });
                    }}
                    rowKey="key"
                    pagination={{current:pagenation.current,pageSize:pagenation.pageSize,total:pagenation.total,showSizeChanger:false}}
                    search={{
                        labelWidth: "auto",
                    }}
                    dateFormatter="string"
                    dataSource={userlist}
                    headerTitle=
                        {<Text ellipsis={true}>{"员工列表"}</Text>}
                    toolBarRender={() => [
                        <Button key="1" type="primary" onClick={()=>{setIsDialogOpen1(true);}}>
                            创建资产管理员
                        </Button>,
                        <Button key="3" type="primary" onClick={()=>{setIsDialogOpen2(true);}}>
                            创建企业员工
                        </Button>,
                        <Popconfirm
                            title="删除选中人员"
                            description="您确定要删除选中的人员吗?"
                            onConfirm={delete_users}
                            onCancel={()=>{}}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{loading:deleloading}}
                            key={"delete confirm"}
                            disabled={!hasSelected}
                        >
                            <Button type="link" key="2" danger={true} disabled={!hasSelected} >删除选中人员</Button>
                        </Popconfirm>                       
                    ]}
                />
            </Spin>
        </div>
    );
}
);

export default Userlist ;