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
    }), []);

    const showModal = () => {
        setOpen(true);
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
            fetchtbdData();
            fetchtbd();
            setIsDialogOpenSR(false);
        }).catch((err) => {
            message.warning(err.detail);
        });
        setIsDialogOpenSR(false);
    };
    //处理资产调拨时需要选择资产类别
    const handleChooseD = (depart: string) => {
        request("/api/user/ep/setcat", "POST", {
            id: cdID,
            label: depart
        })
            .then(() => {
                request("/user/ep/reapply", "POST", {
                    id: cdID,
                    status: 0,
                    reason: "Success!"
                })
                    .then(() => {
                        fetchtbdData();
                        fetchtbd();
                    })
                    .catch((err) => {
                        message.warning(err.detail);
                    });
            })
            .catch((err) => {
                message.warning(err.detail);
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
    const ChooseD = (props: DialogProps) => {
        const [depart, setDepart] = useState("");
        const handleChooseD = () => {
            props.onSendR(depart);
            setDepart("");
        };
        return (
            <Modal title={props.title} open={props.isOpen} onOk={handleChooseD} onCancel={props.onClose} >
                <div>
                    <label>{props.subtitle}</label>
                    <Select
                        style={{ width: 120 }}
                        onChange={(e) => setDepart(e.value)}
                        options={assetclasslist} />
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
                            message.warning(err.detail);
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
                                fetchtbdData();
                                fetchtbd();
                            }).catch((err) => {
                                message.warning(err.detail);
                            });
                        }
                        else {
                            setCDID(record.key);
                            setIsDialogOpenCD(true);
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
                <Button type="text" size="large" style={{ margin: 5 }} onClick={showDrawer}>
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
                    title="该员工所申请资产详细"
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
                <ChooseD title={"请为调拨的资产选择类别"} subtitle={"选择资产类别为:"} isOpen={isDialogOpenCD} onClose={() => setIsDialogOpenCD(false)} onSendR={handleChooseD} />
            </Drawer>
        </>
    );
};
export default TbdDrawer;
