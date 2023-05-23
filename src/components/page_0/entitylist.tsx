import { Button, Popconfirm, message } from "antd";
import React from "react";
import { ProList, ProTable } from "@ant-design/pro-components";
import { useState } from "react";
import CreateEn from "./createEn";
import { useEffect } from "react";
import { request } from "../../utils/network";
import AssignEs from "./assign";
import { Md5 } from "ts-md5";
import { ColumnsType } from "antd/es/table";
import { NoFormStyle } from "antd/es/form/context";
interface Entity {
    key: React.Key;
    entityname: string;
    admingname: string;
}
interface User {
    key: React.Key;
    username: string;
    password: string;
    entity: string;
}
interface EntityRegister {
    key: React.Key;
    entityname: string;
}

const columns: ColumnsType<Entity> = [
    {
        title:"业务实体名称",
        dataIndex:"entityname",
        render:(name:string)=>{return (<a> </a>);}
    },
];


const Entitylist = (() => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [Entitylist, setEntitylist] = useState<Entity[]>([]);
    const [isassignopen, setIsassignOpen] = useState(false);
    const [assignentity, setAssignentity] = useState<string>("");
    useEffect((() => {
        request("/api/entity/superget", "GET")
            .then((res) => {
                let size = res.data.length;
                let i = 0;
                let initentities: Entity[] = [];
                for (i; i < size; i++) {
                    initentities.push({ key: res.data[i].name, entityname: (res.data)[i].name, admingname: (res.data)[i].admin });
                }
                setEntitylist(initentities);
            })
            .catch((err) => {
                message.warning(err.message);
            });
    }), []);

    const handleCreateUser = (user: User) => {
        //在这里向后端发送请求
        const userdata = { "name": user.username, "entity": user.entity, "password": Md5.hashStr(user.password) };
        if(user.username!==""){
            request("/api/entity/assgin", "POST", userdata)
                .then((res) => {
                    let newEntitilist: Entity[] = [];
                    let i = 0;
                    let size = Entitylist.length;
                    for (i; i < size; i++) {
                        if (Entitylist[i].entityname === user.entity) {
                            Entitylist[i].admingname = user.username;
                            newEntitilist.push(Entitylist[i]);
                        } else {
                            newEntitilist.push(Entitylist[i]);
                        }
                    }
                    setEntitylist(newEntitilist);
                    setIsassignOpen(false);
                })
                .catch((err) => {
                    message.warning("创建失败");
                    setIsassignOpen(false);
                });
        }else{
            message.warning("用户名为空");
            setIsassignOpen(false);
        }
    };

    const handleCreateEntity = ((entitys: EntityRegister) => {
        //在这里实现后端通信，添加业务实体，不指派管理员，setEntitylist
        if(entitys.entityname !== ""){
            request("/api/entity/create", "POST", { name: entitys.entityname })
                .then((res) => {
                    const newentity: Entity = { key: entitys.entityname, entityname: entitys.entityname, admingname: "" };
                    setEntitylist([...Entitylist, newentity]);
                    setIsDialogOpen(false);
                    message.success("创建成功");
                })
                .catch((err) => {
                    message.warning(err.message);
                });
        }else{
            message.warning("用户名为空");
            setIsDialogOpen(false);
        }
    });
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };
    const hasSelected = selectedRowKeys.length > 0;
    const assign = ((assign_entity: string) => {
        setAssignentity(assign_entity);
        setIsassignOpen(true);

    });
    const delete_entity = (() => {
        //在这里添加后端通信，删除业务实体，并更改前端
        let i = 0;
        const size = selectedRowKeys.length;
        let deleteentities: Entity[] = [];
        let deleteentityname: string[] = [];
        for (i; i < size; i++) {
            let tobedeleteentity = (Entitylist).find((obj) => { return obj.key === selectedRowKeys.at(i); });
            if (tobedeleteentity != null) {
                if (tobedeleteentity != null) {
                    console.log("suscess");
                    deleteentities.push(tobedeleteentity);
                    deleteentityname.push(tobedeleteentity.entityname);
                    console.log(tobedeleteentity);
                }
            }
        }
        request("/api/entity/deleteall", "DELETE", { name: deleteentityname })
            .then((res) => {
                console.log(deleteentities.length);
                console.log(deleteentities);
                let remained_Entities: Entity[] = [];
                let j = 0;
                let length_before = Entitylist.length;
                for (j; j < length_before; j++) {
                    let fuck = (deleteentities).find((obj) => { return obj.entityname === Entitylist[j].entityname; });
                    console.log(fuck);
                    if (fuck != null) {
                    } else {
                        remained_Entities.push(Entitylist[j]);
                    }
                }
                console.log(remained_Entities);
                setEntitylist(remained_Entities);
                setSelectedRowKeys([]);
            })
            .catch((err) => {
                message.warning(err.message);
            });
    });
    return (
        <div >
            <AssignEs isOpen={isassignopen} loading={false} entityname={assignentity} onClose={() => setIsassignOpen(false)} onCreateUser={handleCreateUser} ></AssignEs>
            <CreateEn isOpen={isDialogOpen} loading={false} onClose={() => setIsDialogOpen(false)} onCreateUser={handleCreateEntity} ></CreateEn>
            <ProTable<Entity>
                toolBarRender={() => {
                    return [
                        <Button key="1" type="primary" onClick={() => { setIsDialogOpen(true); }}>
                            创建业务实体
                        </Button>,
                        <Popconfirm
                            key="2"
                            title="确认删除所选业务实体？"
                            onConfirm={delete_entity}
                            okText="确认"
                            cancelText="取消"
                            key={"nmsl"}
                        >
                            <Button  type="default" danger={true} disabled={!hasSelected}> 删除选中业务实体</Button>
                        </Popconfirm>,
                    ];
                }}
                pagination={{
                    pageSize: 10,
                    showSizeChanger:false,
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
