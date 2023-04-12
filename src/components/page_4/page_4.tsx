import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Space, Typography, Spin } from "antd";
import { request } from "../../utils/network";
import CreateDT from "./createDT";
import { Modal, Tree, Tooltip, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    FormOutlined,
    PlusSquareOutlined,
    MinusSquareOutlined,
    ExclamationCircleFilled,
    BarsOutlined
} from "@ant-design/icons";

//树组件的item
type TreeData = {
    value: string;
    key: string;
    children?: TreeData[];
};

type Props = {
    data: Record<string, any>;
};
const { confirm } = Modal;

//定义table里的每个item
type Depuser = {
    key: React.Key;
    username: string;
    department: string;
    identity: string;
}
//定义table的column
const columns: ColumnsType<Depuser> = [
    {
        title: "用户名",
        dataIndex: "username",
    },
    {
        title: "部门",
        dataIndex: "department",
    },
    {
        title: "职位",
        dataIndex: "identity",
    }

];

const Page_4 = () => {
    const [json, setJson] = useState({});
    const [isSpinning, setSpnning] = useState(true);
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
                //延时执行取消加载组件的动画功能
                setTimeout(() => {
                    setSpnning(false);
                }, 500);
            })
            .catch((err) => {
                alert(err.message);
                router.push("/");
            });
    };
    //定义page_4的核心组件：一个树组件和相应的table
    const Dtree = ({ data }: Props) => {
        const [Depusers, setUser] = useState<Depuser[]>([]);
        const [Departs, setDepart] = useState<String[]>([]);
        const [isDialogOpenCT, setIsDialogOpenCT] = useState(false);
        const [isDialogOpenCE, setIsDialogOpenCE] = useState(false);
        const [parent, setParent] = useState("");
        const [OldName, setOldName] = useState("");
        //将获得json利用递归转为相应的树组件data
        const parseTreeData = (data: Record<string, any>): TreeData[] => {
            return Object.entries(data).map(([key, keyvalue]) => {
                if (key == localStorage.getItem("entity")) {
                    //为叶子结点
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
                //为叶子结点
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
        //编辑按钮
        const onEdit = (key) => {
            setIsDialogOpenCE(true);
            setOldName(key);
        };
        //添加按钮
        const onAdd = (key) => {
            setIsDialogOpenCT(true);
            setParent(key);
        };
        //删除按钮
        const onDelete = (key) => {
            confirm({
                title: "你确定要删除该部门?",
                icon: <ExclamationCircleFilled />,
                content: "删除后该部门下属部门、资产、人员全部清空",
                okText: "Yes",
                okType: "danger",
                cancelText: "No",
                onOk() {
                    setSpnning(true);
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
        //创建新的部门
        const handleCreateDt = (department: string) => {
            // console.log(parent + department + localStorage.getItem("entity"));
            setSpnning(true);
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
                    fetchJson();
                });
            setIsDialogOpenCT(false);
        };
        //更改部门的名称
        const handleChangeDt = (department: string) => {
            setSpnning(true);
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
                    fetchJson();
                });
            setIsDialogOpenCE(false);
        };
        //选中节点后传给table显示相应部门下的用户
        const handleCheck = (checkedKeys) => {
            setDepart(checkedKeys.checked);
            // console.log(checkedKeys.checked);
        };

        //获取该企业实体下的所有用户用来在table里显示
        useEffect((() => {
            request("/api/user/es/checkall", "GET")
                .then((res) => {
                    let oriUser: Depuser[] = res.data.map((val) => ({
                        key: val.name,
                        username: val.name,
                        department: val.department,
                        identity: (val.identity == 3) ? "资产管理员" : "员工",
                    }));
                    let newUser: Depuser[] = [];
                    let len = res.data.length;
                    // console.log("oriUser" + oriUser);
                    // console.log("departs" + Departs);
                    for (let index = 0; index < len; index++) {
                        //利用includes函数筛选出相应的部门的用户
                        if (Departs.includes(oriUser[index].department)) {
                            newUser.push(oriUser[index]);
                        }
                    }
                    setUser(newUser);
                    // console.log("newUser"+Depusers);
                })
                .catch((err) => {
                    alert(err);
                });
        }), [Departs]);
        return (
            <Space direction="horizontal" align="start">
                <Spin spinning={isSpinning}>
                    <Tree
                        checkStrictly={true}
                        style={{ paddingTop: 10, backgroundColor: "#F5F5F5", minHeight: 500, minWidth: 300, borderRadius: 10 }}
                        checkable
                        treeData={treeData}
                        onCheck={handleCheck}
                    />
                    <CreateDT title={"创建下属部门"} subtitle={"部门名称："} isOpen={isDialogOpenCT} onClose={() => setIsDialogOpenCT(false)} onCreateDt={handleCreateDt} />
                    <CreateDT title={"修改部门名称"} subtitle={"新名称："} isOpen={isDialogOpenCE} onClose={() => setIsDialogOpenCE(false)} onCreateDt={handleChangeDt} />
                </Spin>
                <div >
                    <Table columns={columns} dataSource={Depusers} style={{ marginLeft: 20, minHeight: 500, minWidth: 600 }} />
                </div>
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