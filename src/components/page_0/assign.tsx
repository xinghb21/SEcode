import { useState } from "react";
import { Modal, Input } from "antd";
import React from "react";

interface User{
    key: React.Key;
    username:string;
    password:string;
    entity:string;
  }

interface DialogProps{
    isOpen: boolean;
    entityname:string;
    onClose: () => void;
    onCreateUser: (user: User) => void;
  }

const AssignEs=(props: DialogProps) =>{
    const [newusername, setUsername] = useState<string>("");
    const [newpassword, setPassword] = useState<string>("");
    const [newentity,setEntity]=useState<string>(props.entityname);
    const handleCreateUser = () => {
        const user: User = {
            key: Date.now(),
            username: newusername,
            password: newpassword,
            entity: props.entityname,
        };
        props.onCreateUser(user);
        setUsername("");
        setPassword("");
    };

    return (
        <Modal  title="创建企业系统管理员" open={props.isOpen} onOk={handleCreateUser} onCancel={props.onClose} >
            <div>
                <label>用户名:</label>
                <Input type="text" value={newusername} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label>密码:</label>
                <Input type="password" value={newpassword} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
                <label>所属业务实体:</label>
                <div>{props.entityname}</div>
            </div>
        </Modal>
    );
};
export default AssignEs;
