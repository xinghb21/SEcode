import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { request } from "../../utils/network";
import { Modal, Tree, Tooltip, Table, message, Button, Spin, Tag, Typography, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
const { Title } = Typography;
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
// 属性
interface Type {
    key: React.Key,
    info: string,
}
const columns: ColumnsType<Type> = [
    {
        title: "已定义属性",
        dataIndex: "info",
    },
];
//属性

const { confirm } = Modal;

//定义page_5的核心组件：一个树组件
const ACtree = () => {
    // const [data, setData] = useState<TreeData[]>([]);
    const [json, setJson] = useState({});
    const [isSpinning, setSpnning] = useState(false);
    const [isSpinning2, setSpnning2] = useState(false);
    // const [Depusers, setUser] = useState<Depuser[]>([]);
    // const [Departs, setDepart] = useState<String[]>([]);
    const [isDialogOpenCT, setIsDialogOpenCT] = useState(false);
    const [isDialogOpenCE, setIsDialogOpenCE] = useState(false);
    const [parent, setParent] = useState("");
    const [OldName, setOldName] = useState("");
    const router = useRouter();

    //属性
    const [types, setType] = useState<Type[]>([]);

    //从后端获取部门对应的所有自定义属性
    //属性

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        setSpnning(true);
        setSpnning2(true);
        fetchJson();
        fetchType();
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
                message.warning(err.message);
                router.push("/");
            });
    };

    const fetchType = () => {
        request("/api/asset/attributes", "GET")
            .then((res) => {
                setTimeout(() => {
                    setSpnning2(false);
                }, 500);
                let typelist: Type[] = [];
                for (let i = 0; i < res.info.length; i++) {
                    let tmp_type: Type = {
                        key: res.info[i],
                        info: res.info[i],
                    };
                    typelist.push(tmp_type);
                }
                setType(typelist);
            })
            .catch((err) => {
                setSpnning2(false);
                message.warning(err.message);
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
                        message.success("成功删除该类别");
                        fetchJson();
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
                console.log("CancelDelteAssetClass");
            },
        });

    };
    //创建新的资产类型
    const handleCreateAC = (assetClassName: string, assetClass: string) => {
        //不允许空输入
        if (!assetClassName.trim() || assetClassName.length == 0) {
            message.warning("请输入资产类型名称");
            return;
        }
        //不允许不选
        if (assetClass.length == 0) {
            message.warning("请选择资产类别为条目型或数量型");
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
                    message.success("成功创建新类别");
                    fetchJson();
                })
                .catch((err) => {
                    message.warning(err.message);
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
                    message.success("成功创建新类别");
                    fetchJson();
                })
                .catch((err) => {
                    message.warning(err.message);
                    setSpnning(false);
                });
        }
        setTimeout(() => {
            setSpnning2(false);
        }, 500);
        setIsDialogOpenCT(false);
    };
    //更改部门的名称
    const handleChangeAC = (assetClassName: string) => {
        //不允许空输入
        if (!assetClassName.trim() || assetClassName.length == 0) {
            message.warning("请输入资产类型名称");
            return;
        }
        setSpnning(true);
        request("/api/asset/assetclass", "PUT", {
            oldname: OldName,
            newname: assetClassName
        })
            .then(() => {
                message.success("成功修改类别名称");
                fetchJson();
            })
            .catch((err) => {
                message.warning(err.message);
                setSpnning(false);
            });
        setIsDialogOpenCE(false);
    };
    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ width: "50%", height: "100%" }}>
                <Title level={4} style={{ marginTop: 10 }}>资产类别定义</Title>
                <div style={{ backgroundColor: "#f7f7f7", marginRight: 20, padding: 10, borderRadius: 10 }}>
                    <Spin spinning={isSpinning}>
                        <Tree
                            showLine
                            switcherIcon={<CaretDownOutlined />}
                            // checkStrictly={true}
                            style={{ backgroundColor: "#ffffff", padding: 10, borderRadius: 20 }}
                            // checkable
                            treeData={parseTreeData(json)}
                        // onCheck={handleCheck}
                        />
                    </Spin>
                    {/* <Table columns={columns} dataSource={Depusers} style={{ height: "100%", width: "70%" }} /> */}
                    <CreateAC title={"创建下属资产类型"} subtitle={"资产类别名称："} isOpen={isDialogOpenCT} onClose={() => setIsDialogOpenCT(false)} onCreateDt={handleCreateAC} />
                    <ChangeAC title={"修改资产类型名称"} subtitle={"新名称："} isOpen={isDialogOpenCE} onClose={() => setIsDialogOpenCE(false)} onCreateDt={handleChangeAC} />
                </div>
            </div>
            <div style={{ width: "50%", height: "100%" }}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <Title level={4} style={{ marginTop: 10, width: "80%" }}>资产属性定义</Title>
                    <ModalForm
                        style={{ width: "20%" }}
                        autoFocusFirstInput
                        modalProps={{
                            destroyOnClose: true,
                        }}
                        trigger={
                            <Button type="primary"
                                style={{ margin: 10 }}>
                                <PlusOutlined />
                                添加资产属性
                            </Button>
                        }
                        onFinish={async (values: any) => {
                            const label: Type = {
                                key: values.info,
                                info: values.info,
                            };
                            if (values.info == "资产类别") {
                                message.warning("不能使用默认属性");
                                if (isSpinning2 == true) {
                                    setTimeout(() => {
                                        setSpnning2(false);
                                    }, 500);
                                }
                            }
                            else if (values.info == "资产描述") {
                                message.warning("不能使用默认属性");
                                if (isSpinning2 == true) {
                                    setTimeout(() => {
                                        setSpnning2(false);
                                    }, 500);
                                }
                            }
                            else if (values.info == "资产名称") {
                                message.warning("不能使用默认属性");
                                if (isSpinning2 == true) {
                                    setTimeout(() => {
                                        setSpnning2(false);
                                    }, 500);
                                }
                            }
                            else if (values.info == "上级资产名称") {
                                message.warning("不能使用默认属性");
                                if (isSpinning2 == true) {
                                    setTimeout(() => {
                                        setSpnning2(false);
                                    }, 500);
                                }
                            }
                            else if (values.info == "资产数量") {
                                message.warning("不能使用默认属性");
                                if (isSpinning2 == true) {
                                    setTimeout(() => {
                                        setSpnning2(false);
                                    }, 500);
                                }
                            }
                            else if (values.info == "资产价值") {
                                message.warning("不能使用默认属性");
                                if (isSpinning2 == true) {
                                    setTimeout(() => {
                                        setSpnning2(false);
                                    }, 500);
                                }
                            }
                            else if (values.info == "挂账人") {
                                message.warning("不能使用默认属性");
                                if (isSpinning2 == true) {
                                    setTimeout(() => {
                                        setSpnning2(false);
                                    }, 500);
                                }
                            }
                            else if (!(values.info).trim() || (values.info).length == 0) {
                                message.warning("请输入自定义属性");
                                if (isSpinning2 == true) {
                                    setTimeout(() => {
                                        setSpnning2(false);
                                    }, 500);
                                }
                            }
                            else if ((values.info).includes(" ") || (values.info).includes(",") || (values.info).includes("，")) {
                                message.warning("非法字符，请重新输入");
                                if (isSpinning2 == true) {
                                    setTimeout(() => {
                                        setSpnning2(false);
                                    }, 500);
                                }
                            }
                            else {
                                //与后端实现添加属性
                                setSpnning2(true);
                                request("/api/asset/createattributes", "POST", {
                                    name: values.info
                                })
                                    .then((res) => {
                                        setTimeout(() => {
                                            setSpnning2(false);
                                        }, 500);
                                        setType([...types, label]);
                                        message.success("创建成功");
                                    })
                                    .catch((err) => {
                                        setTimeout(() => {
                                            setSpnning2(false);
                                        }, 500);

                                        message.warning(err.message);
                                    });
                                return true;
                            }
                        }}
                    >
                        <ProForm.Group>
                            <ProFormText
                                width="md"
                                name="info"
                                label="属性名称"
                                placeholder="请输入名称"
                                required
                            />
                        </ProForm.Group>
                    </ModalForm>
                </div>
                <div style={{ marginBottom: 24 }}>
                    <Spin spinning={isSpinning2}>
                        <Table columns={columns} dataSource={types} bordered={true} />
                    </Spin>
                </div>
            </div>
        </div>
    );
};
export default ACtree;