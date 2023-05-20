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
    const [loading ,setloading ]= useState<boolean>(false);
    const handleCreateDt = () => {
        setloading(true);
        props.onCreateDt(department);
        setDt("");
        setloading(false);
    };

    return (
        <Modal  title={props.title}  okButtonProps={{loading:loading}} open={props.isOpen} onOk={handleCreateDt} onCancel={props.onClose} >
            <div>
                <label>{props.subtitle}</label>
                <Input type="Department" value={department} onChange={(e) => setDt(e.target.value)} />
            </div>
        </Modal>
    );
};
export default CtCeDT;
