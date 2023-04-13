import { useState } from "react";
import { Modal, Input } from "antd";
import React from "react";

interface User_Password{
    key: React.Key;
    username:string;
    newpassword:string;
  }

interface DialogProps{
    isOpen: boolean;
    onClose: () => void;
    username:string;
    onCreateUser: (newuser:User_Password ) => void;
  }

const Resetpassword=(props: DialogProps) =>{
    const [newpassword, setnewpassword] = useState<string>("");

    const handleCreateUser = () => {
        const newuser: User_Password = {
            key: props.username,
            username:props.username,
            newpassword:newpassword
        };
        props.onCreateUser(newuser);
        setnewpassword("");
    };

    return (
        <Modal  title="重置员工密码" open={props.isOpen} onOk={handleCreateUser} onCancel={props.onClose} >
            <div>
                <label>将员工{props.username}的密码重置为:</label>
                <Input type="text" value={newpassword} onChange={(e) => setnewpassword(e.target.value)} />
            </div>
        </Modal>
    );
};
export default Resetpassword;