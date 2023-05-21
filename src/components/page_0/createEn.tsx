import { useState } from "react";
import { Modal, Input, message } from "antd";
import React from "react";

interface EntityRegister{
    key: React.Key;
    entityname:string;
  }

interface DialogProps{
    isOpen: boolean;
    onClose: () => void;
    loading:boolean;
    onCreateUser: (entity:EntityRegister ) => void;
  }

const CreateEn=(props: DialogProps) =>{
    const [entity, setEntity] = useState<string>("");
    
    const handleCreateUser = () => {
        
        const newentity: EntityRegister = {
            key: entity,
            entityname:entity,
        };
        if(entity===""){
            message.warning("企业实体名字不能为空");
            
            return ;
        }
        props.onCreateUser(newentity);
        
        setEntity("");
    };

    return (
        <Modal  title="创建业务实体" open={props.isOpen} onOk={handleCreateUser} onCancel={props.onClose} okButtonProps={{loading:props.loading}} >
            <div>
                <label>业务实体名称:</label>
                <Input type="text" value={entity} onChange={(e) => setEntity(e.target.value)} />
            </div>
        </Modal>
    );
};
export default CreateEn;
