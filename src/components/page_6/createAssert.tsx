import { useState } from "react";
import { Modal, Input } from "antd";
import React from "react";

interface EntityRegister{
    key: React.Key;
    entityname:string;
  }

interface DialogProps{
    isOpen: boolean;
    onClose: () => void;
    onCreateUser: (entity:EntityRegister ) => void;
}

const CreateAssert = (props: DialogProps) =>{
    const [entity, setEntity] = useState("");

    const handleCreateUser = () => {
        const entity: EntityRegister = {
            key: Date.now(),
            entityname:"",
        };
        props.onCreateUser(entity);
        setEntity("");
    };

    return (
        <Modal  title="创建业务实体" open={props.isOpen} onOk={handleCreateUser} onCancel={props.onClose} >
        </Modal>
    );
};
export default CreateAssert;