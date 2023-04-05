import React, { useState } from "react";
import { Modal, Tree } from "antd";
import {
    EditOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
    ExclamationCircleFilled
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { request } from "../../utils/network";
import CreateDT from "./createDT";

type TreeData = {
    value: string;
    key: string;
    children?: TreeData[];
};

type Props = {
    data: Record<string, any>;
};

const { confirm } = Modal;
// const router = useRouter();
const Dtree = ({ data }: Props) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [parent, setParent] = useState("");
    const parseTreeData = (data: Record<string, any>): TreeData[] => {
        return Object.entries(data).map(([key, keyvalue]) => {
            if (key == localStorage.getItem("entity")) {
                if (keyvalue === "$") {
                    return {
                        title: (<div>
                            <span>{key}</span>
                            <span>
                                <EditOutlined style={{ marginLeft: 20 }} onClick={() => onEdit(key)} />

                                <PlusCircleOutlined style={{ marginLeft: 10 }} onClick={() => onAdd(key)} />
                            </span>
                        </div>), value: key, key
                    };
                }
                return {
                    title: (<div>
                        <span>{key}</span>
                        <span>
                            <EditOutlined style={{ marginLeft: 20 }} onClick={() => onEdit(key)} />

                            <PlusCircleOutlined style={{ marginLeft: 10 }} onClick={() => onAdd(key)} />
                        </span>
                    </div>),
                    value: key,
                    key,
                    children: parseTreeData(keyvalue),
                };
            }
            if (keyvalue === "$") {
                return {
                    title: (<div>
                        <span>{key}</span>
                        <span>
                            <EditOutlined style={{ marginLeft: 20 }} onClick={() => onEdit(key)} />

                            <PlusCircleOutlined style={{ marginLeft: 10 }} onClick={() => onAdd(key)} />

                            <MinusCircleOutlined style={{ marginLeft: 10 }} onClick={() => onDelete(key)} />
                        </span>
                    </div>), value: key, key
                };
            }
            return {
                title: (<div>
                    <span>{key}</span>
                    <span>
                        <EditOutlined style={{ marginLeft: 20 }} onClick={() => onEdit(key)} />

                        <PlusCircleOutlined style={{ marginLeft: 10 }} onClick={() => onAdd(key)} />

                        <MinusCircleOutlined style={{ marginLeft: 10 }} onClick={() => onDelete(key)} />
                    </span>
                </div>),
                value: key,
                key,
                children: parseTreeData(keyvalue),
            };
        });
    };
    const onEdit = (key) => { };
    const onAdd = (key) => {
        setIsDialogOpen(true);
        setParent(key);
    };
    const onDelete = (key) => {
        confirm({
            title: "Are you sure delete this task?",
            icon: <ExclamationCircleFilled />,
            content: "Some descriptions",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                request("/api/user/es/deletedepart", "DELETE", {
                    name: key
                })
                    .then()
                    .catch((err) => {
                        alert(err.message);
                    });
            },
            onCancel() {
                console.log("Cancel");
            },
        });

    };
    const treeData = parseTreeData(data);
    const handleCreateDt = (department: string) => {
        request("/api/user/es/createdepart", "GET", {
            entity: localStorage.getItem("entity"),
            department: department,
            parent: parent
        })
            .then()
            .catch((err) => {
                alert(err.message);
            });
        setIsDialogOpen(false);
    };
    return (
        <div>
            <Tree
                treeData={treeData}
            />
            <CreateDT isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onCreateDt={handleCreateDt} />
        </div>
    );
};

export default Dtree;
