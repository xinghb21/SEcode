import { useState } from "react";
import { Modal, Input } from "antd";
import React from "react";

interface DialogProps{
    isOpen: boolean;
    onClose: () => void;
    onCreateDt: (department:string) => void;
    title: string;
    subtitle: string;
  }

const CtCeDT=(props: DialogProps) =>{
    const [department, setDt] = useState("");

    const handleCreateDt = () => {
        props.onCreateDt(department);
        setDt("");
    };

    return (
        <Modal  title={props.title} open={props.isOpen} onOk={handleCreateDt} onCancel={props.onClose} >
            <div>
                <label>{props.subtitle}</label>
                <Input type="Department" value={department} onChange={(e) => setDt(e.target.value)} />
            </div>
        </Modal>
    );
};
export default CtCeDT;
