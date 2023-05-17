import React, { useEffect, useState } from "react";
import { Drawer, Space, Button, Table, Tag, message, Modal, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { request } from "../../utils/network";
import {
    CarryOutTwoTone,
} from "@ant-design/icons";

import { Badge, Tooltip } from "antd";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSendR: (reason: string) => void;
    title: string;
    subtitle: string;
}

interface ChooseProps {
    isOpen: boolean;
    onClose: () => void;
    onSendR: (reason: assetType[]) => void;
    title: string;
    subtitle: string;
}


type DataType = {
    //table数据的格式
    key: React.Key;//id
    name: string;//申请人的名字
    oper: number,//对该资产进行什么操作：1领用，2转移，3维保，4退库
    reason: string;//申请原因
}

type AssetDisplayType = {
    //详细table数据的格式
    key: React.Key;//id
    assetname: string;//资产名称
    assetclass: string,//资产类别
    assetcount: number;//申请资产的数量
}

type assetType = {
    id: React.Key;
    label: string;
    number: number;
}

const Assetcolumns: ColumnsType<AssetDisplayType> = [
    {
        title: "资产编号",
        dataIndex: "key",
    },
    {
        title: "资产名称",
        dataIndex: "assetname",
    },
    {
        title: "资产类别",
        dataIndex: "assetclass",
    },
    {
        title: "资产数量",
        dataIndex: "assetcount",
    }
];


const TbdDrawer = () => {
    const [tbdData, settbdData] = useState<DataType[]>([]);
    const [open, setOpen] = useState(false);
    const [assetdisdata, setassetdisData] = useState<AssetDisplayType[]>([]);

    const [chosenkey, setck] = useState<React.Key>();
    const [isDialogOpenSR, setIsDialogOpenSR] = useState(false);
    const [isDialogOpenCD, setIsDialogOpenCD] = useState(false);
    const [isTBD, setTBD] = useState(false);//true即有待办任务，false相反
    const [dopen, setDOpen] = useState(false);
    const [assetTypeList, setATL] = useState<assetType[]>([]);
    //资产类别列表，用于资产调拨选择相应的类别
    const [assetclasslist, setac] = useState([]);
    //资产调拨处理的资产ID
    const [cdID, setCDID] = useState<React.Key>();

    const showDrawer = () => {
        setDOpen(true);
    };
    const onClose = () => {
        setDOpen(false);
    };
    useEffect((() => {
        fetchtbdData();
        fetchtbd();
        //获取部门下的资产类别
        fetchDepart();
    }), []);

    const showModal = () => {
        setOpen(true);
    };
    const fetchDepart = () => {
        request("/api/asset/assetclass", "GET")
            .then((res) => {
                setac(res.data.map((item) => {
                    return {
                        value: item, label: item
                    };
                }));
            }).catch((err) => {
                message.warning(err.message);
            });
    };
    const fetchtbd = () => {
        //资产管理员界面需要设置tbd的状态
        request("/api/user/ep/istbd", "GET").then((res) => {
            setTBD(res.info);
        }).catch((err) => {
            message.warning(err.message);
        });
    };

    //拒绝申请输入原因
    const handleSendR = (reason: string) => {
        //不允许空输入
        if (reason.match("\\s+") || reason.length == 0) {
            message.warning("请输入具体原因");
            return;
        }
        request("/api/user/ep/reapply", "POST", {
            id: chosenkey,
            status: 1,
            reason: reason
        }).then(() => {
            message.success("操作成功");
            fetchtbdData();
            fetchtbd();
            setIsDialogOpenSR(false);
        }).catch((err) => {
            message.warning(err.message);
        });
        setIsDialogOpenSR(false);
    };
    //处理资产调拨时需要选择资产类别
    const handleChooseD = (depart: assetType[]) => {
        if (depart.length != assetdisdata.length) {
            message.warning("请为所有资产指定类别");
            return false;
        }
        request("/api/user/ep/setcat", "POST", {
            asset: depart,
            id: cdID,
            status: 0,
            reason: "Success!"
        })
            .then(() => {
                message.success("操作成功");
                fetchtbdData();
                fetchtbd();
            })
            .catch((err) => {
                message.warning(err.message);
            });
        setIsDialogOpenCD(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    //拒绝时输入理由的弹窗
    const SendR = (props: DialogProps) => {
        const [reason, setR] = useState("");
        const handleSendR = () => {
            props.onSendR(reason);
            setR("");
        };
        return (
            <Modal title={props.title} open={props.isOpen} onOk={handleSendR} onCancel={props.onClose} >
                <div>
                    <label>{props.subtitle}</label>
                    <Input type="reason" value={reason} onChange={(e) => setR(e.target.value)} />
                </div>
            </Modal>
        );
    };
    //处理资产调拨时选择同意的弹窗
    const ChooseD = (props: ChooseProps) => {
        const handleChooseD = () => {
            props.onSendR(assetTypeList);
            setATL([]);
        };
        const ChooseColumns: ColumnsType<AssetDisplayType> = [
            {
                title: "资产编号",
                dataIndex: "key",
            },
            {
                title: "资产名称",
                dataIndex: "assetname",
            },
            {
                title: "选择新部门下的资产类别",
                render: (record) => (
                    <Select
                        style={{ width: 120 }}
                        onChange={(value) => {
                            let data = assetTypeList;
                            if (data.filter((item) => item.id === record.key).length > 0)
                                data.filter((item) => item.id === record.key)[0].label = value;
                            else
                                data.push({ id: record.key, label: value, number: record.assetcount });
                            setATL(data);
                        }}
                        placeholder="请选择"
                        options={assetclasslist} ></Select>
                )
            }];
        return (
            <Modal title={props.title} open={props.isOpen} onOk={handleChooseD} onCancel={props.onClose} >
                <div>
                    <label>{props.subtitle}</label>
                    <Table columns={ChooseColumns} dataSource={assetdisdata}></Table>
                </div>
            </Modal>
        );
    };
    const fetchtbdData = () => {
        request("/api/user/ep/getallapply", "GET")
            .then((res) => {
                settbdData(res.info.map((item) => {
                    return {
                        key: item.id,
                        name: item.name,
                        reason: item.reason,
                        oper: item.oper
                    };
                }));
            })
            .catch((err) => {
                message.warning(err.message);
            });
    };
    const columns: ColumnsType<DataType> = [
        {
            title: "申请人",
            dataIndex: "name",
        },
        {
            title: "请求",
            dataIndex: "oper",
            render: (text) => {
                if (text === 1) {
                    return (<Tag color="blue">
                        资产领用
                    </Tag>
                    );
                }
                else if (text === 2) {
                    return (<Tag color="green">
                        资产转移
                    </Tag>
                    );
                }
                else if (text === 3) {
                    return (<Tag color="yellow">
                        资产维保
                    </Tag>
                    );
                }
                else if (text === 4) {
                    return (
                        <Tag color="volcano">
                            资产退库
                        </Tag>
                    );
                }
                else if (text == 6) {
                    return (
                        <Tag color="cyan">
                            资产调拨
                        </Tag>
                    );
                }
            },
        },
        {
            title: "申请原因",
            dataIndex: "reason",
        },
        {
            title: "操作",
            render: (record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => {
                        request("/api/user/ep/assetsinapply", "GET", {
                            id: record.key
                        }).then((res) => {
                            setassetdisData(res.info.map((item) => {
                                return {
                                    key: item.id,
                                    assetname: item.assetname,
                                    assetclass: item.assetclass,
                                    assetcount: item.assetcount
                                };
                            }));
                            showModal();
                        }).catch((err) => {
                            message.warning(err.message);
                        });
                    }}>详细</Button>
                    <Button danger={true} onClick={() => {
                        setck(record.key);
                        setIsDialogOpenSR(true);
                    }}>
                        拒绝
                    </Button>
                    <Button type="primary" onClick={() => {
                        if (record.oper != 6) {
                            request("/api/user/ep/reapply", "POST", {
                                id: record.key,
                                status: 0,
                                reason: "Success!"
                            }).then(() => {
                                message.success("操作成功");
                                fetchtbdData();
                                fetchtbd();
                            }).catch((err) => {
                                message.warning(err.message);
                            });
                        }
                        else {
                            setCDID(record.key);
                            request("/api/user/ep/assetsinapply", "GET", {
                                id: record.key
                            }).then((res) => {
                                setassetdisData(res.info.map((item) => {
                                    return {
                                        key: item.id,
                                        assetname: item.assetname,
                                        assetclass: item.assetclass,
                                        assetcount: item.assetcount
                                    };
                                }));
                            }).catch((err) => {
                                message.warning(err.message);
                            });
                            setIsDialogOpenCD(true);
                            fetchDepart();
                        }
                    }}>
                        同意
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Tooltip placement="bottomLeft" title={<span>代办任务</span>}>
                <Button type="text" size="large" style={{ marginTop: 5, marginRight: 5, marginBottom: 5 }} onClick={showDrawer}>
                    <Badge dot style={{ visibility: (!isTBD) ? "hidden" : "visible" }}>
                        <CarryOutTwoTone twoToneColor={(!isTBD) ? "#a8a8a8" : "#f82212"} style={{ fontSize: "25px" }} />
                    </Badge>
                </Button>
            </Tooltip>
            <Drawer
                title="待办任务列表"
                width={"70%"}
                onClose={onClose}
                open={dopen}
            >
                <Table columns={columns} dataSource={tbdData} />
                <Modal
                    open={open}
                    title="该待办任务涉及的资产详细"
                    onOk={handleCancel}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            关闭
                        </Button>,
                    ]}
                >
                    <Table columns={Assetcolumns} dataSource={assetdisdata} />
                </Modal>
                <SendR title={"请输入拒绝原因"} subtitle={"具体原因为："} isOpen={isDialogOpenSR} onClose={() => setIsDialogOpenSR(false)} onSendR={handleSendR} />
                <ChooseD title={"请为调拨的资产选择类别"} subtitle={""} isOpen={isDialogOpenCD} onClose={() => setIsDialogOpenCD(false)} onSendR={handleChooseD} />
            </Drawer>
        </>
    );
};
export default TbdDrawer;
