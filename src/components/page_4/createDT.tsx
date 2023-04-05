import { useState } from "react";
import { Modal, Input } from "antd";
import React from "react";

interface DialogProps{
    isOpen: boolean;
    onClose: () => void;
    onCreateDt: (department:string) => void;
  }

const CreateDT=(props: DialogProps) =>{
    const [department, setDt] = useState("");

    const handleCreateDt = () => {
        props.onCreateDt(department);
        setDt("");
    };

    return (
        <Modal  title="创建下属部门" open={props.isOpen} onOk={handleCreateDt} onCancel={props.onClose} >
            <div>
                <label>部门名称:</label>
                <Input type="Department" value={department} onChange={(e) => setDt(e.target.value)} />
            </div>
        </Modal>
    );
};
export default CreateDT;
