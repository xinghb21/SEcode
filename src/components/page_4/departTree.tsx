import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spin, message } from "antd";
import { request } from "../../utils/network";
import CtCeDT from "./ctceDT";
import { Modal, Tree, Tooltip, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    FormOutlined,
    PlusSquareOutlined,
    MinusSquareOutlined,
    ExclamationCircleFilled,
    CaretDownOutlined,
} from "@ant-design/icons";

//树组件的item
type TreeData = {
    value: string;
    key: string;
    children?: TreeData[];
};

const { confirm } = Modal;

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

//定义table里的每个item
type Depuser = {
    key: React.Key;
    username: string;
    department: string;
    identity: string;
}
//定义page_4的核心组件：一个树组件和相应的table
const Dtree = () => {
    // const [data, setData] = useState<TreeData[]>([]);
    const [json, setJson] = useState({});
    const [isSpinning, setSpnning] = useState(false);
    const [Depusers, setUser] = useState<Depuser[]>([]);
    const [Departs, setDepart] = useState<String[]>([]);
    const [isDialogOpenCT, setIsDialogOpenCT] = useState(false);
    const [isDialogOpenCE, setIsDialogOpenCE] = useState(false);
    const [parent, setParent] = useState("");
    const [OldName, setOldName] = useState("");
    const router = useRouter();
    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        setSpnning(true);
        fetchJson();
    }, [router]);

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
                                    <PlusSquareOutlined style={{ marginLeft: 10 }} onClick={() => onAdd(key)} />
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
                                <PlusSquareOutlined style={{ marginLeft: 10 }} onClick={() => onAdd(key)} />
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
                            <Tooltip placement="bottomRight"  title={<span>修改部门名称</span>}>
                                <FormOutlined style={{ marginLeft: 10 }} onClick={() => onEdit(key)} />
                            </Tooltip>
                            <Tooltip placement="bottom" title={<span>添加部门</span>}>
                                <PlusSquareOutlined style={{ marginLeft: 10 }} onClick={() => onAdd(key)} />
                            </Tooltip>
                            <Tooltip placement="bottomLeft" title={<span>删除部门</span>}>
                                < MinusSquareOutlined style={{ marginLeft: 10 }} onClick={() => onDelete(key)} />
                            </Tooltip>
                        </span>
                    </div>), value: key, key
                };
            }
            return {
                title: (<div>
                    <span>{key}</span>
                    <span>
                        <Tooltip placement="bottomRight" title={<span>修改部门名称</span>}>
                            <FormOutlined style={{ marginLeft: 10 }} onClick={() => onEdit(key)} />
                        </Tooltip>
                        <Tooltip placement="bottom" title={<span>添加部门</span>}>
                            <PlusSquareOutlined style={{ marginLeft: 10 }} onClick={() => onAdd(key)} />
                        </Tooltip>
                        <Tooltip placement="bottomLeft" title={<span>删除部门</span>}>
                            < MinusSquareOutlined style={{ marginLeft: 10 }} onClick={() => onDelete(key)} />
                        </Tooltip>
                    </span>
                </div>),
                value: key,
                key,
                children: parseTreeData(keyvalue),
            };
        });
    };

    //将获得json利用递归转为相应的树组件data
    const fetchJson = () => {
        request("/api/user/es/departs", "GET")
            .then((res) => {
                setJson(res.info);
                // setData(parseTreeData(json));
                //延时执行取消加载组件的动画功能
                setTimeout(() => {
                    setSpnning(false);
                }, 500);
            })
            .catch((err) => {
                setSpnning(false);
                message.warning(err.message);
                router.push("/");
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
                        fetchJson();
                        fetchDepart();
                        if (isSpinning == true) {
                            setTimeout(() => {
                                setSpnning(false);
                            }, 500);
                        }
                    })
                    .catch((err) => {
                        message.warning(err.message);
                        if (isSpinning == true) {
                            setTimeout(() => {
                                setSpnning(false);
                            }, 500);
                        }
                    });
            },
            onCancel() {
                console.log("CancelDelteDepartment");
            },
        });

    };
    //创建新的部门
    const handleCreateDt = (department: string) => {
        //不允许空输入
        if (!department.trim() ||department.length == 0) {
            message.warning("请输入部门名称");
            return;
        }
        setSpnning(true);
        request("/api/user/es/createdepart", "POST", {
            entity: localStorage.getItem("entity"),
            depname: department,
            parent: (parent == localStorage.getItem("entity")) ? "" : parent
        })
            .then(() => {
                fetchJson();
                fetchDepart();
                if (isSpinning == true) {
                    setTimeout(() => {
                        setSpnning(false);
                    }, 500);
                }
            })
            .catch((err) => {
                message.warning(err.message);
                setSpnning(false);
            });
        setIsDialogOpenCT(false);
    };
    //更改部门的名称
    const handleChangeDt = (department: string) => {
        //不允许空输入
        if (!department.trim() ||department.length == 0) {
            message.warning("请输入部门名称");
            return;
        }
        setSpnning(true);
        request("/api/user/es/renamedepart", "POST", {
            oldname: OldName,
            newname: department
        })
            .then(() => {
                fetchJson();
                fetchDepart();
                if (isSpinning == true) {
                    setTimeout(() => {
                        setSpnning(false);
                    }, 500);
                }
            })
            .catch((err) => {
                message.warning(err.message);
                setSpnning(false);
            });
        setIsDialogOpenCE(false);
    };
    //选中节点后传给table显示相应部门下的用户
    const handleCheck = (checkedKeys) => {
        setDepart(checkedKeys.checked);
        // console.log(checkedKeys.checked);
    };
    //将获得json利用递归转为相应的树组件data
    const fetchDepart = () => {
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
                message.warning(err.message);
            });
    };

    //获取该企业实体下的所有用户用来在table里显示
    useEffect((() => {
        fetchDepart();
    }), [Departs]);
    return (
        <div style={{ display: "flex", flex: "flex-start", flexDirection: "row", height: "100%", width: "100%" }}>
            <div style={{ backgroundColor: "#f7f7f7", marginRight: 20, padding: 10, borderRadius: 10, width: "30%", height: "100%" }}>
                <Spin spinning={isSpinning}>
                    <Tree
                        showLine
                        switcherIcon={<CaretDownOutlined />}
                        checkStrictly={true}
                        style={{ backgroundColor: "#ffffff", padding: 10, borderRadius: 20 }}
                        checkable
                        treeData={parseTreeData(json)}
                        onCheck={handleCheck}
                    />
                </Spin>
            </div>
            <Table columns={columns} dataSource={Depusers} style={{ height: "100%", width: "70%" }} />
            <CtCeDT title={"创建下属部门"} subtitle={"部门名称："} isOpen={isDialogOpenCT} onClose={() => setIsDialogOpenCT(false)} onCreateDt={handleCreateDt} />
            <CtCeDT title={"修改部门名称"} subtitle={"新名称："} isOpen={isDialogOpenCE} onClose={() => setIsDialogOpenCE(false)} onCreateDt={handleChangeDt} />
        </div>
    );
};
export default Dtree;