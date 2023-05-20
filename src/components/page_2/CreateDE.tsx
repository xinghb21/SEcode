import { useState } from "react";
import { Modal, Input, Select, message } from "antd";
import React from "react";

interface User_DEpartment{
    key: React.Key;
    username:string;
    Department:string;
  }

interface department_to_show{
    value:string;
    label:string;
}

interface DialogProps{
    isOpen: boolean;
    onClose: () => void;
    username:string;
    departmentlist:department_to_show[];
    olddepartment:string;
    onCreateUser: (newuser:User_DEpartment ) => void;
  }

const CreateDE=(props: DialogProps) =>{
    const [newdepartment, setdepartment] = useState<string>("");
    const [loading,setloading]=useState<boolean>(false);
    const handleCreateUser = () => {
        setloading(true);
        const newuser: User_DEpartment = {
            key: props.username,
            username:props.username,
            Department:newdepartment
        };
        if(newdepartment.length===0){
            message.warning("部门名字不能为空");
            setloading(false);
            return;
        }
        props.onCreateUser(newuser);
        setloading(false);
    };
    const handleChange = (value: { value: string; label: React.ReactNode }) => {
        setdepartment(value.value);
    };
    return (
        <Modal  title="更改员工部门" open={props.isOpen} okButtonProps={{loading:loading}} onOk={handleCreateUser} onCancel={props.onClose} >
            <div style={{display:"flex",flexDirection:"column"}}>
                <label>部门:</label>
                <Select
                    labelInValue
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={props.departmentlist}
                />
            </div>  
        </Modal>
    );
};
export default CreateDE;