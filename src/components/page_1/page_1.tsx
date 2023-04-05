import CreateES from "./createES";
import UserTable from "../Table";
import { Button, Table } from "antd";
import { request } from "../../utils/network";
import { Md5 } from "ts-md5";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import User from "./createES";
//start hqf

interface User{
    key: React.Key;
    username:string;
    password:string;
    entity:string;
}

const columns: ColumnsType<User> = [
    {
        title: "Username",
        dataIndex: "username",
    },
    {
        title: "Entity",
        dataIndex: "entity",
    },
];
const EStable=()=> {
    const [users, setUsers] = useState<User[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        request("/api/entity/superget","GET")
            .then((res)=>{
                let size:number=res.data.length;
                let initaluser :User[]=[];
                let i:number=0;
                for (i; i < size;i++){
                    if(res.data[i].admin!=null){
                        const newuser:User=(res.data[i].admin,"123456",res.data[i].name);
                        initaluser.push(newuser);
                    }
                }
                setUsers(initaluser);
            })
            .catch((err)=>{
                alert(err);
            });
    },[]);
    const start = () => {
        if (window.confirm("确认删除所选企业系统管理员？")){
            setLoading(true);
            //在这里加入删除的后端访问
            let i=0;
            const size= selectedRowKeys.length;
            let deleteduser:User[]=[];
            for (i ;i<size;i++){
                let tobedeleteuser=(users).find((obj)=>{return obj.key===selectedRowKeys.at(i);});
                if(tobedeleteuser != null ){
                    request("/api/entity/deleteadmin","DELETE",{entity:tobedeleteuser.entity})
                        .then((res)=>{
                            if(tobedeleteuser != null ){
                                deleteduser.push(tobedeleteuser);
                            }
                        })
                        .catch((err)=>{
                            alert(tobedeleteuser?.username+"delete failed");
                        });
                }         
            }
            let remained_user:User[]=[];
            i=0;
            let length_before=users.length;
            for (i;i<length_before;i++){
                if( deleteduser.find((obj)=>{return obj===users.at(i);}) == null){   
                    remained_user.push(users[i]);
                }
            }
            setUsers(remained_user);
            setLoading(false);
        }
    };
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    
    const handleCreateUser = (user: User) => {
        //在这里向后端发送请求
        const userdata={"name":user.username,"entity":user.entity,"password":Md5.hashStr(user.password)};
        request("/api/entity/assgin","POST",userdata)
            .then((res)=>{
                setUsers([...users, user]);
                setIsDialogOpen(false);
            })
            .catch((err)=>{
                alert("创建失败");
                setIsDialogOpen(false);
            });

    };

    return (
        <>
            <div >
                <Button onClick={() => setIsDialogOpen(true)} type="primary">创建企业系统管理员</Button>
                <Button type="default" danger = {true} onClick={start} disabled={!hasSelected} loading={loading} style={{float : "right"}}>解雇选中系统管理员</Button>
            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={users} />
            <CreateES isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onCreateUser={handleCreateUser} />
        </>
    );
};
export default EStable;