import React from "react";
import { useState } from "react";
import { Modal, Input, Select } from "antd";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateDt: (department: string, aclass: string) => void;
    title: string;
    subtitle: string;
}



const CreateAC = (props: DialogProps) => {
    const [department, setDt] = useState("");
    const [aclass, setAClass] = useState("");
    const handleChange = (value: string) => {
        setAClass(value);
    };
    const handleCreateDt = () => {
        props.onCreateDt(department, aclass);
        setDt("");
        setAClass("");
    };

    return (
        <Modal title={props.title} open={props.isOpen} onOk={handleCreateDt} onCancel={props.onClose} >
            <div>
                <label>{props.subtitle}</label>
                <div style={{ display: "flex", alignItems: "center", flexDirection: "row"}}>
                    <Input type="Department" value={department} onChange={(e) => setDt(e.target.value)} style={{marginRight:5}}/>
                    <Select
                        style={{ width: 120 }}
                        onChange={handleChange}
                        options={[
                            { value: "0", label: "条目型" },
                            { value: "1", label: "数量型" },
                        ]}
                    />
                </div>
            </div>
        </Modal>
    );
};
export default CreateAC;
