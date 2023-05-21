import { useState } from "react";
import { Modal, Input, Select, message } from "antd";
import React from "react";
import { Md5 } from "ts-md5";

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

//资产管理员
interface DialogProps{
    isOpen: boolean;
    onClose: () => void;
    entityname:string;
    loading:boolean;
    departmentlist:department_to_show[];
    onCreateUser: (user:UserRegister ) => void;
  }
const CreateUser=(props: DialogProps) =>{
    const [newusername, setusername] = useState<string>("");
    const [newuserdepaertment,setdepartment]=useState<string>("");
    const [password,setpassword]=useState<string>("");
    const [loading ,setloading]=useState<boolean>(false);
    const handleCreateUser = () => {
        setloading(true);
        const newuser :UserRegister={
            key:newusername,
            username:newusername,
            password:Md5.hashStr(password),
            identity:3,
            entityname:props.entityname,
            department:newuserdepaertment
        };
        if(password.length<8||password.length>128){
            message.warning("密码应为8-128个字符");
            setloading(false);
            return;
        }
        const pasr:RegExp=/([A-Z]|[a-z]|[0-9])*/m;
        let a=pasr.exec(password);
        if(a != null){
            if(a[0] !== password){
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
        setpassword("");
        setusername("");
    };
    const handleChange = (value: { value: string; label: React.ReactNode }) => {
        setdepartment(value.value);
    };

    return (
        <Modal  title="创建资产管理员" open={props.isOpen} onOk={handleCreateUser} onCancel={props.onClose} okButtonProps={{loading:props.loading}} >
            <div>
                <label>业务实体名称:{props.entityname}</label>
            </div>
            <div>
                <label>用户名:</label>
                <Input type="text" value={newusername} onChange={(e) => setusername(e.target.value)} />
            </div>
            <div>
                <label>{"密码:\(8-128个英文字符或数字\)"}</label>
                <Input type="password" value={password} onChange={(e) => setpassword( ( e.target.value))}  />
            </div>
            <div style={{display:"flex",flexDirection:"column"}}>
                <label>部门:</label>
                <Select
                    labelInValue
                    defaultValue={{value:"",label:""}}
                    style={{ minWidth: 180 }}
                    onChange={handleChange}
                    options={props.departmentlist}
                />
            </div>            
        </Modal>
    );
};
export default CreateUser;