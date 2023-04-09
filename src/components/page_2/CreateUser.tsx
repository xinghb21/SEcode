import { useState } from "react";
import { Modal, Input } from "antd";
import React from "react";

interface UserRegister{
    key: React.Key;
    entityname:string;
    department:string;
  }

interface DialogProps{
    isOpen: boolean;
    onClose: () => void;
    onCreateUser: (entity:EntityRegister ) => void;
  }

const CreateUser=(props: DialogProps) =>{
    const [entity, setEntity] = useState<string>("");

    const handleCreateUser = () => {
        const newentity: EntityRegister = {
            key: Date.now(),
            entityname:entity,
        };
        props.onCreateUser(newentity);
        setEntity("");
    };

    return (
        <Modal  title="创建业务实体" open={props.isOpen} onOk={handleCreateUser} onCancel={props.onClose} >
            <div>
                <label>业务实体名称:</label>
                <Input type="text" value={entity} onChange={(e) => setEntity(e.target.value)} />
            </div>
        </Modal>
    );
};
export default CreateUser;