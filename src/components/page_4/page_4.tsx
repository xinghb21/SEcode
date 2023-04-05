import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Typography } from "antd";
import { request } from "../../utils/network";
import CreateDT from "./createDT";
import { Modal, Tree } from "antd";
import {
    EditOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
    ExclamationCircleFilled
} from "@ant-design/icons";


type TreeData = {
    value: string;
    key: string;
    children?: TreeData[];
};

type Props = {
    data: Record<string, any>;
};

const { confirm } = Modal;
const Page_4 = () => {
    const[json,setJson]=useState({});
    // let json = { "Apple": { "商务分析部门": "$", "技术部门": { "芯片研发部门": "$" }, "应用设计部门": { "UI界面": "$", "服务器维护": "$", "创意部门": { "设计部门": "$" } } } };
    const router = useRouter();
    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        fetchJson();
    }, [router]);
    const { Title } = Typography;
    const fetchJson = () => {
        request("/api/user/es/departs", "GET")
            .then((res) => {
                setJson(res.info);
            })
            .catch((err) => {
                alert(err.message);
                router.push("/");
            });
    };


    const Dtree = ({ data }: Props) => {
        const [isDialogOpenCT, setIsDialogOpenCT] = useState(false);
        const [isDialogOpenCE, setIsDialogOpenCE] = useState(false);
        const [parent, setParent] = useState("");
        const [OldName, setOldName] = useState("");
        const parseTreeData = (data: Record<string, any>): TreeData[] => {
            return Object.entries(data).map(([key, keyvalue]) => {
                if (key == localStorage.getItem("entity")) {
                    if (keyvalue === "$") {
                        return {
                            title: (<div>
                                <span>{key}</span>
                                <span>
                                    <PlusCircleOutlined style={{ marginLeft: 20 }} onClick={() => onAdd(key)} />
                                </span>
                            </div>), value: key, key
                        };
                    }
                    return {
                        title: (<div>
                            <span>{key}</span>
                            <span>
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
        const onEdit = (key) => {
            setIsDialogOpenCE(true);
            setOldName(key);
        };
        const onAdd = (key) => {
            setIsDialogOpenCT(true);
            setParent(key);
        };
        const onDelete = (key) => {
            confirm({
                title: "你确定要删除该部门?",
                icon: <ExclamationCircleFilled />,
                content: "删除后该部门下属部门、资产、人员全部清空",
                okText: "Yes",
                okType: "danger",
                cancelText: "No",
                onOk() {
                    request("/api/user/es/deletedepart", "DELETE", {
                        name: key
                    })
                        .then(() => {
                            if (!router.isReady) {
                                return;
                            }
                            fetchJson();
                        })
                        .catch((err) => {
                            alert(err.message);
                        });
                },
                onCancel() {
                    console.log("CancelDelteDepartment");
                },
            });

        };
        const treeData = parseTreeData(data);
        const handleCreateDt = (department: string) => {
            console.log(parent+department+localStorage.getItem("entity"));
            request("/api/user/es/createdepart", "POST", {
                entity: localStorage.getItem("entity"),
                depname: department,
                parent: (parent==localStorage.getItem("entity"))?"":parent
            })
                .then(() => {
                    if (!router.isReady) {
                        return;
                    }
                    fetchJson();
                })
                .catch((err) => {
                    alert(err.message);
                });
            setIsDialogOpenCT(false);
        };
        const handleChangeDt = (department: string) => {
            request("/api/api/es/renamedepart", "POST", {
                oldname: OldName,
                newname: department
            })
                .then(() => {
                    if (!router.isReady) {
                        return;
                    }
                    fetchJson();
                })
                .catch((err) => {
                    alert(err.message);
                });
            setIsDialogOpenCT(false);
        };
        return (
            <div>
                <Tree
                    treeData={treeData}
                />
                <CreateDT title={"创建下属部门"} subtitle={"部门名称："} isOpen={isDialogOpenCT} onClose={() => setIsDialogOpenCT(false)} onCreateDt={handleCreateDt} />
                <CreateDT title={"修改部门名称"} subtitle={"新名称："} isOpen={isDialogOpenCE} onClose={() => setIsDialogOpenCE(false)} onCreateDt={handleChangeDt} />
            </div>
        );
    };

    return (
        <div>
            <Title level={3}>
                {localStorage.getItem("entity") + "部门管理"}
            </Title>
            <Dtree data={json} />
        </div>
    );
};

export default Page_4;