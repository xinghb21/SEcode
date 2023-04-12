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
    onClose: () => void;
    onCreateUser: (user: User) => void;
  }

const CreateES=(props: DialogProps) =>{
    const [newusername, setUsername] = useState("");
    const [newpassword, setPassword] = useState("");
    const [newentity, setEntity] = useState("");

    const handleCreateUser = () => {
        const user: User = {
            key: newusername,
            username: newusername,
            password: newpassword,
            entity:newentity,
        };
        props.onCreateUser(user);
        setUsername("");
        setPassword("");
        setEntity("");
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
                <Input type="entity" value={newentity} onChange={(e) => setEntity(e.target.value)} />
            </div>
        </Modal>
    );
};
export default CreateES;
