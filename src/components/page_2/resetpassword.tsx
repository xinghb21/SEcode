import { useState } from "react";
import { Modal, Input, message } from "antd";
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
    const [loading , setloading]=useState<boolean>(false);
    const handleCreateUser = () => {
        setloading(true);
        const newuser: User_Password = {
            key: props.username,
            username:props.username,
            newpassword:newpassword
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
        props.onCreateUser(newuser);
        setloading(false);
        setnewpassword("");
    };

    return (
        <Modal  title="重置员工密码" open={props.isOpen} onOk={handleCreateUser} onCancel={props.onClose} okButtonProps={{loading:loading}} >
            <div>
                <label>将员工{props.username}的密码重置为:</label>
                <Input type="password" value={newpassword} onChange={(e) => setnewpassword(e.target.value)} />
            </div>
        </Modal>
    );
};
export default Resetpassword;