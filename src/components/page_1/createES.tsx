import { useState } from "react";
import { Modal, Input, message } from "antd";
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
    const [loading,setloading]=useState<boolean>(false);
    const handleCreateUser = () => {
        setloading(true);
        const user: User = {
            key: newusername,
            username: newusername,
            password: newpassword,
            entity:newentity,
        };
        if(newpassword.length<8||newpassword.length>128){
            message.warning("密码应为8-128个字符");
            setloading(false);
            return;
        }
        const pasr:RegExp=/([A-Z]|[a-z]|[0-9])*/m;
        let a=pasr.exec(newpassword)
        if(a != null){
            if(a[0] !== newpassword){
                message.warning("密码只能包括英文字符或数字");
                setloading(false);
                return;
            }
        }else{
            message.warning("密码只能包括英文字符或数字");
            setloading(false);
            return;
        }
        props.onCreateUser(user);
        setloading(false)
        setUsername("");
        setPassword("");
        setEntity("");
    };

    return (
        <Modal  title="创建企业系统管理员" open={props.isOpen} onOk={handleCreateUser} onCancel={props.onClose} okButtonProps={{loading:loading}} >
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
