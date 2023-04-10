import { useState } from "react";
import { Modal, Input } from "antd";
import React from "react";

interface Assert{

    key: React.Key;
    assertname: string;
    person: string;
    department: string;
    parent: string;
    child: string;
    status: string;
    category: string;
    description: string;
    type: boolean;
    number: Number;
    addtion: string;

}

interface DialogProps{
    isOpen: boolean;
    onClose: () => void;
    onCreateAssert: (assert: Assert) => void;
}

const CreateAssert = (props: DialogProps) =>{
    const [entity, setEntity] = useState("");

    const handleCreateAssert = () => {
        const assert: Assert = {
            key: Date.now(),
        };
        props.onCreateAssert(assert);
        setEntity("");
    };

    return (
        <Modal  title="添加资产" open={props.isOpen} onOk={handleCreateAssert} onCancel={props.onClose} >
        </Modal>
    );
};
export default CreateAssert;