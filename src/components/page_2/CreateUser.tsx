import { useState } from "react";
import { Modal, Input ,Select} from "antd";
import React from "react";

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
    departmentlist:department_to_show[];
    onCreateUser: (user:UserRegister ) => void;
  }
const CreateUser=(props: DialogProps) =>{
    const [newusername, setusername] = useState<string>("");
    const [newuserdepaertment,setdepartment]=useState<string>("");
    const [password,setpassword]=useState<string>("");

    const handleCreateUser = () => {
        const newuser :UserRegister={
            key:newusername,
            username:newusername,
            password:password,
            identity:3,
            entityname:props.entityname,
            department:newuserdepaertment
        };     
        props.onCreateUser(newuser);
        setpassword("");
        setusername("");
    };
    const handleChange = (value: { value: string; label: React.ReactNode }) => {
        setdepartment(value.value);
    };

    return (
        <Modal  title="创建资产管理员" open={props.isOpen} onOk={handleCreateUser} onCancel={props.onClose} >
            <div>
                <label>业务实体名称:{props.entityname}</label>
            </div>
            <div>
                <label>用户名:</label>
                <Input type="text" value={newusername} onChange={(e) => setusername(e.target.value)} />
            </div>
            <div>
                <label>密码:</label>
                <Input type="text" value={password} onChange={(e) => setpassword(e.target.value)} />
            </div>
            <div style={{display:"flex",flexDirection:"column"}}>
                <label>部门:</label>
                <Select
                    labelInValue
                    defaultValue={{value:"",label:""}}
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={props.departmentlist}
                />
            </div>            
        </Modal>
    );
};
export default CreateUser;