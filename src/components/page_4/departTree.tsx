import React, { Key, useEffect, useState } from "react";
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
        title: "用户ID",
        dataIndex: "id",
    },
    {
        title: "用户名",
        dataIndex: "username",
    },
    {
        title: "职位",
        dataIndex: "identity",
    }

];

//定义table里的每个item
type Depuser = {
    key: React.Key;
    id: number;
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
    const [isDialogOpenCT, setIsDialogOpenCT] = useState(false);
    const [isDialogOpenCE, setIsDialogOpenCE] = useState(false);
    const [parent, setParent] = useState("");
    const [OldName, setOldName] = useState("");
    const router = useRouter();
    const [pagenation,setpagenation] = useState({
        current: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总记录数
    });
    //选中的keys
    const [myselectedkeys, setkeys] = useState<{ checked: string[], halfChecked: string[] }>({ checked: [], halfChecked: [] });
    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        setSpnning(true);
        fetchJson();
    }, [router]);

    useEffect(() => {
        if(myselectedkeys.checked.length == 0)
            setUser([]);
        else if(myselectedkeys.checked.length == 1)
            fetchDepart(myselectedkeys.checked[0]);
    }, [myselectedkeys]);


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
        if (!department.trim() || department.length == 0) {
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
        if (!department.trim() || department.length == 0) {
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
        //实现单选
        let checked_len = (checkedKeys.checked).length;
        if (checked_len == 0) {
            setkeys({ checked: [], halfChecked: [] });
        }
        else {
            setkeys({ checked: [(checkedKeys.checked)[checked_len - 1]], halfChecked: [] });
        }
        // console.log(checkedKeys.checked);
    };
    //将获得json利用递归转为相应的树组件data
    const fetchDepart = (name: string) => {
        request("/api/user/es/staffs", "GET", 
            {
                department: name,
                page: 1,
            })
            .then((res) => {
                let oriUser: Depuser[] = res.info.map((val) => ({
                    key: val.id,
                    id: val.id,
                    username: val.username,
                    identity: (val.number == 3) ? "资产管理员" : "员工",
                }));
                setUser(oriUser);
                setpagenation({
                    current: 1,
                    pageSize: 10,
                    total: res.count,
                });
                // console.log("newUser"+Depusers);
            })
            .catch((err) => {
                message.warning(err.message);
            });
    };

    const handleFetch = (page:number, pageSize:number) => {
        // 构造请求参数
        // 发送请求获取数据
        request("/api/user/es/staffs","GET", 
            {
                department: myselectedkeys.checked[0],
                page: page
            })
            .then((res) => {
                let oriUser: Depuser[] = res.info.map((val) => ({
                    key: val.id,
                    id: val.id,
                    username: val.username,
                    identity: (val.number == 3) ? "资产管理员" : "员工",
                }));
                setUser(oriUser);
                setpagenation({
                    current: 1,
                    pageSize: 10,
                    total: res.count,
                });
                // console.log("newUser"+Depusers);
            })
            .catch((err) => {
                message.warning(err.message);
            });
    };

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
                        checkedKeys={myselectedkeys}
                    />
                </Spin>
            </div>
            <Table
                pagination={{
                    current: pagenation.current,
                    pageSize: pagenation.pageSize,
                    onChange: handleFetch,
                    total: pagenation.total
                }}
                columns={columns} 
                dataSource={Depusers} 
                style={{ height: "100%", width: "70%" }} 
            />
            <CtCeDT title={"创建下属部门"} subtitle={"部门名称："} isOpen={isDialogOpenCT} onClose={() => setIsDialogOpenCT(false)} onCreateDt={handleCreateDt} />
            <CtCeDT title={"修改部门名称"} subtitle={"新名称："} isOpen={isDialogOpenCE} onClose={() => setIsDialogOpenCE(false)} onCreateDt={handleChangeDt} />
        </div>
    );
};
export default Dtree;