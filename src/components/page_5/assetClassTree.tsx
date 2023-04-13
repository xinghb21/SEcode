import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spin, Tag } from "antd";
import { request } from "../../utils/network";
import { Modal, Tree, Tooltip, Table } from "antd";
// import type { ColumnsType } from "antd/es/table";
import {
    FormOutlined,
    PlusSquareOutlined,
    MinusSquareOutlined,
    ExclamationCircleFilled,
    CaretDownOutlined,
} from "@ant-design/icons";
import CreateAC from "./createAC";
import ChangeAC from "./changeAC";

//树组件的item
type TreeData = {
    value: string;
    key: string;
    children?: TreeData[];
};

const { confirm } = Modal;

//定义table的column
// const columns: ColumnsType<Depuser> = [
//     {
//         title: "用户名",
//         dataIndex: "username",
//     },
//     {
//         title: "部门",
//         dataIndex: "department",
//     },
//     {
//         title: "职位",
//         dataIndex: "identity",
//     }

// ];

//定义table里的每个item
// type Depuser = {
//     key: React.Key;
//     username: string;
//     department: string;
//     identity: string;
// }

//定义page_5的核心组件：一个树组件
const ACtree = () => {
    // const [data, setData] = useState<TreeData[]>([]);
    const [json, setJson] = useState({});
    const [isSpinning, setSpnning] = useState(false);
    // const [Depusers, setUser] = useState<Depuser[]>([]);
    // const [Departs, setDepart] = useState<String[]>([]);
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
            if (key == localStorage.getItem("department")) {
                //为叶子结点
                if (keyvalue === "$") {
                    return {
                        disableCheckbox: true,
                        title: (<div>
                            <span style={{ marginLeft: 6 }}>{key}</span>
                            <span>
                                <Tooltip placement="bottom" title={<span>添加资产类型</span>}>
                                    <PlusSquareOutlined style={{ marginLeft: 10 }} onClick={() => onAdd(key)} />
                                </Tooltip>
                            </span>
                        </div>),
                        value: key,
                        key,
                    };
                }
                return {
                    disableCheckbox: true,
                    title: (<div>
                        <span style={{ marginLeft: 6 }}>{key}</span>
                        <span>
                            <Tooltip placement="bottom" title={<span>添加资产类型</span>}>
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
                let tmpkey = key.split(",");
                return {
                    title: (<div>
                        <span style={{ marginRight: 8 }}>{tmpkey[0]}</span>
                        <Tag color={tmpkey[1] == "0" ? "blue" : "green"}>{tmpkey[1] == "0" ? "条目型" : "数量型"}</Tag>
                        <span>
                            <Tooltip placement="bottomLeft" title={<span>修改资产类型名称</span>}>
                                <FormOutlined style={{ marginLeft: 10 }} onClick={() => onEdit(key)} />
                            </Tooltip>
                            <Tooltip placement="bottom" title={<span>添加资产类型</span>}>
                                <PlusSquareOutlined style={{ marginLeft: 10 }} onClick={() => onAdd(key)} />
                            </Tooltip>
                            <Tooltip placement="bottomRight" title={<span>删除资产类型</span>}>
                                < MinusSquareOutlined style={{ marginLeft: 10 }} onClick={() => onDelete(key)} />
                            </Tooltip>
                        </span>
                    </div>),
                    value: tmpkey[0],
                    key: tmpkey[0],
                };
            }
            let tmpkey = key.split(",");
            return {
                title: (<div>
                    <span style={{ marginRight: 8 }}>{tmpkey[0]} </span>
                    <Tag color={tmpkey[1] == "0" ? "blue" : "green"}>{tmpkey[1] == "0" ? "条目型" : "数量型"}</Tag>
                    <span>
                        <Tooltip placement="bottomLeft" title={<span>修改资产类型名称</span>}>
                            <FormOutlined style={{ marginLeft: 10 }} onClick={() => onEdit(key)} />
                        </Tooltip>
                        <Tooltip placement="bottom" title={<span>添加资产类型</span>}>
                            <PlusSquareOutlined style={{ marginLeft: 10 }} onClick={() => onAdd(key)} />
                        </Tooltip>
                        <Tooltip placement="bottomRight" title={<span>删除资产类型</span>}>
                            < MinusSquareOutlined style={{ marginLeft: 10 }} onClick={() => onDelete(key)} />
                        </Tooltip>
                    </span>
                </div>),
                value: tmpkey[0],
                key: tmpkey[0],
                children: parseTreeData(keyvalue),
            };
        });
    };

    //将获得json利用递归转为相应的树组件data
    const fetchJson = () => {
        request("/api/asset/assetclasstree", "GET")
            .then((res) => {
                setJson(res.info);
                //延时执行取消加载组件的动画功能
                setTimeout(() => {
                    setSpnning(false);
                }, 500);
            })
            .catch((err) => {
                setSpnning(false);
                alert(err.message);
                router.push("/");
            });
    };
    //编辑按钮
    const onEdit = (key) => {
        setIsDialogOpenCE(true);
        setOldName(key.split(",")[0]);
    };
    //添加按钮
    const onAdd = (key) => {
        setIsDialogOpenCT(true);
        setParent(key.split(",")[0]);
    };
    //删除按钮
    const onDelete = (key) => {
        confirm({
            title: "你确定要删除该资产类型?",
            icon: <ExclamationCircleFilled />,
            content: "删除后该资产类型下具体资产全部清空",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                setSpnning(true);
                request("/api/asset/assetclass", "DELETE", {
                    name: key.split(",")[0]
                })
                    .then(() => {
                        fetchJson();
                    })
                    .catch((err) => {
                        alert(err.message);
                        if (isSpinning == true) {
                            setTimeout(() => {
                                setSpnning(false);
                            }, 500);
                        }
                    });
            },
            onCancel() {
                console.log("CancelDelteAssetClass");
            },
        });

    };
    //创建新的资产类型
    const handleCreateAC = (assetClassName: string, assetClass: string) => {
        //不允许空输入
        if (assetClassName.match("\\s+") || assetClassName.length == 0) {
            alert("请输入资产类型名称");
            return;
        }
        //不允许不选
        if (assetClass.length == 0) {
            alert("请选择资产类别为条目型或数量型");
            return;
        }
        setSpnning(true);
        console.log(assetClassName + assetClass);
        //如果父亲是部门，则不用向后端发送
        if (parent == localStorage.getItem("department")) {
            request("/api/asset/assetclass", "POST", {
                name: assetClassName,
                type: parseInt(assetClass),
            }
            )
                .then(() => {
                    fetchJson();
                })
                .catch((err) => {
                    alert(err.message);
                    setSpnning(false);
                });
        }
        //父亲不是部门的时候要向后端发送上层类别
        else {
            request("/api/asset/assetclass", "POST", {
                parent: parent,
                name: assetClassName,
                type: parseInt(assetClass),
            }
            )
                .then(() => {
                    fetchJson();
                })
                .catch((err) => {
                    alert(err.message);
                    setSpnning(false);
                });
        }

        setSpnning(false);
        setIsDialogOpenCT(false);
    };
    //更改部门的名称
    const handleChangeAC = (assetClassName: string) => {
        //不允许空输入
        if (assetClassName.match("\\s+") || assetClassName.length == 0) {
            alert("请输入资产类型名称");
            return;
        }
        setSpnning(true);
        request("/api/asset/assetclass", "PUT", {
            oldname: OldName,
            newname: assetClassName
        })
            .then(() => {
                fetchJson();
            })
            .catch((err) => {
                alert(err.message);
                setSpnning(false);
            });
        setIsDialogOpenCE(false);
    };
    //选中节点后传给table显示相应部门下的用户
    // const handleCheck = (checkedKeys) => {
    //     setDepart(checkedKeys.checked);
    // console.log(checkedKeys.checked);
    // };

    //获取该企业实体下的所有用户用来在table里显示
    // useEffect((() => {
    //     request("/api/user/es/checkall", "GET")
    //         .then((res) => {
    //             let oriUser: Depuser[] = res.data.map((val) => ({
    //                 key: val.name,
    //                 username: val.name,
    //                 department: val.department,
    //                 identity: (val.identity == 3) ? "资产管理员" : "员工",
    //             }));
    //             let newUser: Depuser[] = [];
    //             let len = res.data.length;
    //             // console.log("oriUser" + oriUser);
    //             // console.log("departs" + Departs);
    //             for (let index = 0; index < len; index++) {
    //                 //利用includes函数筛选出相应的部门的用户
    //                 if (Departs.includes(oriUser[index].department)) {
    //                     newUser.push(oriUser[index]);
    //                 }
    //             }
    //             setUser(newUser);
    //             // console.log("newUser"+Depusers);
    //         })
    //         .catch((err) => {
    //             alert(err);
    //         });
    // }), [Departs]);
    return (
        <div>
            <div style={{ backgroundColor: "#ADD8E6", marginRight: 20, padding: 10, borderRadius: 10, minWidth: "30%", maxWidth: "60%", height: "100%" }}>
                <Spin spinning={isSpinning}>
                    <Tree
                        showLine
                        switcherIcon={<CaretDownOutlined />}
                        // checkStrictly={true}
                        style={{ backgroundColor: "#fdfdfd", padding: 10, borderRadius: 20 }}
                        // checkable
                        treeData={parseTreeData(json)}
                    // onCheck={handleCheck}
                    />
                </Spin>
                {/* <Table columns={columns} dataSource={Depusers} style={{ height: "100%", width: "70%" }} /> */}
                <CreateAC title={"创建下属资产类型"} subtitle={"资产类别名称："} isOpen={isDialogOpenCT} onClose={() => setIsDialogOpenCT(false)} onCreateDt={handleCreateAC} />
                <ChangeAC title={"修改资产类型名称"} subtitle={"新名称："} isOpen={isDialogOpenCE} onClose={() => setIsDialogOpenCE(false)} onCreateDt={handleChangeAC} />
            </div>
            <div style={{ width: "40%" }}></div>
        </div>
    );
};
export default ACtree;