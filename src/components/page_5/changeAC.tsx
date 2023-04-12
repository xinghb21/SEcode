import { useState } from "react";
import { Modal, Input } from "antd";
import React from "react";

interface DialogProps{
    isOpen: boolean;
    onClose: () => void;
    onCreateDt: (assetClassName:string) => void;
    title: string;
    subtitle: string;
  }

const ChangeAC=(props: DialogProps) =>{
    const [assetClassName, setDt] = useState("");

    const handleCreateDt = () => {
        props.onCreateDt(assetClassName);
        setDt("");
    };

    return (
        <Modal  title={props.title} open={props.isOpen} onOk={handleCreateDt} onCancel={props.onClose} >
            <div>
                <label>{props.subtitle}</label>
                <Input type="Department" value={assetClassName} onChange={(e) => setDt(e.target.value)} />
            </div>
        </Modal>
    );
};
export default ChangeAC;
