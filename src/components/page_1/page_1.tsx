import CreateES from "./createES";
import { Button, Space, Table, message, Spin, Descriptions, Popconfirm } from "antd";
import { request } from "../../utils/network";
import { Md5 } from "ts-md5";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import User from "./createES";
import { stat } from "fs";
import CreateEn from "../page_0/createEn";
import AssignEs from "../page_0/assign";
import Label from "../page_5/label";
import { color } from "echarts";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Typography } from "antd";

const { Title } = Typography;
//start hqf

interface User{
    key: React.Key;
    username:string;
    password:string;
    entity:string;
}

interface EntityRegister{
    key: React.Key;
    entityname:string;
}

const EStable=()=> {
    const [users, setUsers] = useState<User[]>([]);
    const [isentityDialogOpen, setIsentityDialogOpen] = useState(false);
    const [spinloading , setspinloading] = useState (false);
    const [isuserDialogopen, setIsuserDialogopen] = useState(false);
    const [assignentity,setassignentity] = useState<string>("");
    const columns: ProColumns<User> []= [
        {        
            title: "业务实体编号",
            dataIndex: "key",
        },
        {
            title: "业务实体名称",
            dataIndex: "entity",
        },
        {
            title: "系统管理员",
            dataIndex: "username",
            render:(_,row)=>{return (row.username==""?<div>暂无资产管理员</div>:<div>{row.username}</div>);}
        },
        {
            title: "操作",
            key: "action",
            render: (_, row) => (
                (row.username=="")?
                    <Space size="middle">
                        <Popconfirm
                            title="确认委派系统管理员？"
                            onConfirm={() => { setassignentity(row.entity);setIsuserDialogopen(true); }}
                            okText="确认"
                            cancelText="取消"
                        >
                            <a style={{color:"green"}} > {"委派系统管理员"}</a>
                        </Popconfirm>
                        <Popconfirm
                            title="确认删除所选业务实体？"
                            onConfirm={() => { delete_entity(row.entity); }}
                            okText="确认"
                            cancelText="取消"
                        >
                            <a style={{color:"red"}}>删除业务实体</a>
                        </Popconfirm>
                    </Space>
                    :
                    <Space size="middle">
                        <Popconfirm
                            title="确认删除所选系统管理员？"
                            onConfirm={()=>{start(row.entity);}}
                            okText="确认"
                            cancelText="取消"
                        >
                            <a style={{color:"red"}}>{"删除系统管理员"}</a>
                        </Popconfirm>
                        <Popconfirm
                            title="确认删除所选业务实体？"
                            onConfirm={() => { delete_entity(row.entity); }}
                            okText="确认"
                            cancelText="取消"
                        >
                            <a style={{color:"red"}}>删除业务实体</a>
                        </Popconfirm>
                    </Space>
            ),
        },
    ];
    useEffect(() => {
        fetchlist();
    },[]);
    const handleCreateUser = (user: User) => {
        //在这里向后端发送请求
        const userdata = { "name": user.username, "entity": user.entity, "password": Md5.hashStr(user.password) };
        if(user.username!==""){
            request("/api/entity/assgin", "POST", userdata)
                .then((res) => {
                    setIsuserDialogopen(false);
                    message.success("创建成功");
                    fetchlist();
                })
                .catch((err) => {
                    setIsuserDialogopen(false);
                    message.warning("创建失败");
                });
        }else{
            message.warning("用户名为空");
        }
    };

    const handleCreateEntity = ((entitys: EntityRegister) => {
        //在这里实现后端通信，添加业务实体，不指派管理员，setEntitylist
        if(entitys.entityname !== ""){
            request("/api/entity/create", "POST", { name: entitys.entityname })
                .then((res) => {
                    setIsentityDialogOpen(false);
                    fetchlist();
                    message.success("创建成功");
                })
                .catch((err) => {
                    setIsentityDialogOpen(false);
                    message.warning(err.message);
                });
        }else{
            message.warning("用户名为空");
        }
    });
    const fetchlist = ()=>{
        setspinloading(true);
        request("/api/entity/superget","GET")
            .then((res)=>{
                let size:number=res.data.length;
                let initaluser :User[]=[];
                let i:number=0;
                for (i; i < size;i++){
                    const newuser:User={key:res.data[i].id,username: res.data[i].admin,password: "123456",entity: res.data[i].name};
                    initaluser.push(newuser);
                }
                setUsers(initaluser);
                setspinloading(false);
            })
            .catch((err)=>{
                message.warning(err.message);
                setspinloading(false);
            });
    };
    const start = (entityname:string) => {

        //在这里加入删除的后端访问
        let i=0;
        let deleteenbtityname:string[]=[];
        deleteenbtityname.push(entityname);
        request("/api/entity/deletealladmins","DELETE",{entity:deleteenbtityname})
            .then((res)=>{
                fetchlist();
            })
            .catch((err)=>{
                message.warning(err.message);
            });
        
    };

    const delete_entity = ((name:string) => {
        //在这里添加后端通信，删除业务实体，并更改前端
        let i = 0;
        let deleteentityname: string[] = [];
        deleteentityname.push(name);
        request("/api/entity/deleteall", "DELETE", { name: deleteentityname })
            .then((res) => {
                fetchlist();
                message.success("删除成功");
            })
            .catch((err) => {
                message.warning(err.message);
            });
        
    });


    return (
        <div style={{height:"100%"}} >  
            <Spin size="large" spinning={spinloading}>    
                <Title level={4} style={{marginLeft: "2%"}}>业务实体列表</Title>
                <Button onClick={()=>{setIsentityDialogOpen(true);}} style={{color:"green",float:"right",marginBottom:"5px"}} > 添加业务实体 </Button>
                <ProTable <User>
                    bordered={true}
                    size="large"
                    search={false}
                    options={false}
                    columns={columns} 
                    pagination={{
                        pageSize: 10,
                        showSizeChanger:false,
                    }}
                    dataSource={users} 
                />
                <AssignEs isOpen={isuserDialogopen} entityname={assignentity} onClose={() => setIsuserDialogopen(false)} onCreateUser={handleCreateUser} ></AssignEs>
                <CreateEn isOpen={isentityDialogOpen} onClose={() => setIsentityDialogOpen(false)} onCreateUser={handleCreateEntity} ></CreateEn>
            
            </Spin>
        </div>
    );
};
export default EStable;
