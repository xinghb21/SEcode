import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import { request } from '../utils/network';
import User from '../pages/user/index';
import { DEV_MIDDLEWARE_MANIFEST } from "next/dist/shared/lib/constants";
import useEffect from 'react';

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
        title: "Password",
        dataIndex: "password",
    },
    {
        title: "Entity",
        dataIndex: "entity",
    },
];

interface UserTableProps {
    users: User[];
}

  
const UserTable=(props: UserTableProps) =>{

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);
    const [users,setusers]=useState<User[]>([]);
//start hqf 
    const start = () => {
        setLoading(true);
        //在这里加入删除的后端访问
        let i=0;
        const size= selectedRowKeys.length;
        let deleteduser:User[]=[];
        for (i ;i<size;i++){
            let tobedeleteuser=(props.users).find((obj)=>{return obj.key===selectedRowKeys.at(i)});
            if(tobedeleteuser != null ){
                request(`/api/user/deleteuser`,"POST",{name:tobedeleteuser.username})
                .then((res)=>{
                    if(tobedeleteuser instanceof User ){
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
        let length_before=props.users.length;
        for (i;i<length_before;i++){
            if( deleteduser.find((obj)=>{return obj===props.users.at(i)}) == null){   
                remained_user.push(props.users[i]);
            }
        }
        props.users=remained_user;
        setLoading(false);
    };
    //end hqf
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    
    return (
        <div>
            <div style={{ marginBottom: 20}}>
                <Button type="default" danger = {true} onClick={start} disabled={!hasSelected} loading={loading} style={{float : "right"}}>
                    解雇选中系统管理员
                </Button>
            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={props.users} />
        </div>
    );
};
    
export default UserTable;