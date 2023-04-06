import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Space, Typography } from "antd";
import { request } from "../../utils/network";
import CreateDT from "./createDT";
import { Modal, Tree, Tooltip } from "antd";
import {
    FormOutlined,
    PlusSquareOutlined,
    MinusSquareOutlined,
    ExclamationCircleFilled,
    BarsOutlined
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
    const [json, setJson] = useState({});
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
                            disableCheckbox: true,
                            title: (<div>
                                <span>{key}</span>
                                <span>
                                    <Tooltip placement="bottom" title={<span>添加部门</span>}>
                                        <PlusSquareOutlined style={{ marginLeft: 20 }} onClick={() => onAdd(key)} />
                                    </Tooltip>
                                </span>
                            </div>), value: key, key
                        };
                    }
                    return {
                        disableCheckbox: true,
                        title: (<div>
                            <span>{key}</span>
                            <span>
                                <Tooltip placement="bottom" title={<span>添加部门</span>}>
                                    <PlusSquareOutlined style={{ marginLeft: 20 }} onClick={() => onAdd(key)} />
                                </Tooltip>
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
                                <Tooltip placement="bottomLeft" title={<span>修改部门名称</span>}>
                                    <FormOutlined style={{ marginLeft: 20 }} onClick={() => onEdit(key)} />
                                </Tooltip>
                                <Tooltip placement="bottom" title={<span>添加部门</span>}>
                                    <PlusSquareOutlined style={{ marginLeft: 15 }} onClick={() => onAdd(key)} />
                                </Tooltip>
                                <Tooltip placement="bottomRight" title={<span>删除部门</span>}>
                                    < MinusSquareOutlined style={{ marginLeft: 15 }} onClick={() => onDelete(key)} />
                                </Tooltip>
                            </span>
                        </div>), value: key, key
                    };
                }
                return {
                    title: (<div>
                        <span>{key}</span>
                        <span>
                            <Tooltip placement="bottomLeft" title={<span>修改部门名称</span>}>
                                <FormOutlined style={{ marginLeft: 20 }} onClick={() => onEdit(key)} />
                            </Tooltip>
                            <Tooltip placement="bottom" title={<span>添加部门</span>}>
                                <PlusSquareOutlined style={{ marginLeft: 15 }} onClick={() => onAdd(key)} />
                            </Tooltip>
                            <Tooltip placement="bottomRight" title={<span>删除部门</span>}>
                                < MinusSquareOutlined style={{ marginLeft: 15 }} onClick={() => onDelete(key)} />
                            </Tooltip>
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
            console.log(parent + department + localStorage.getItem("entity"));
            request("/api/user/es/createdepart", "POST", {
                entity: localStorage.getItem("entity"),
                depname: department,
                parent: (parent == localStorage.getItem("entity")) ? "" : parent
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
            request("/api/user/es/renamedepart", "POST", {
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
            <Space align="start" direction="vertical">
                <Tree
                    style={{ backgroundColor: "#F5F5F5", minHeight: 500, minWidth: 300, borderRadius: 10 }}
                    checkable
                    treeData={treeData}
                />
                <CreateDT title={"创建下属部门"} subtitle={"部门名称："} isOpen={isDialogOpenCT} onClose={() => setIsDialogOpenCT(false)} onCreateDt={handleCreateDt} />
                <CreateDT title={"修改部门名称"} subtitle={"新名称："} isOpen={isDialogOpenCE} onClose={() => setIsDialogOpenCE(false)} onCreateDt={handleChangeDt} />
            </Space>
        );
    };

    return (
        <div>
            <Space direction="vertical">
                <Space align="center" direction="horizontal">
                    <BarsOutlined style={{ marginTop: 20 }} />
                    <Title level={4}>
                        {localStorage.getItem("entity") + "部门管理"}
                    </Title>
                </Space>
                <Dtree data={json} />
            </Space>
        </div>
    );
};

export default Page_4;