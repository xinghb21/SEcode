import React, { useEffect, useState } from "react";
import { Drawer, Space, Button, Table, Tag, message, Modal, Input } from "antd";
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
    //table数据的格式
    key: React.Key;//id
    assetname: string;//申请人的名字
    assetclass: string,//对该资产进行什么操作：1领用，2转移，3维保，4退库
    assetcount: number;//申请数量
}

// const data = [{
//     key: 1,
//     name: "cjt",
//     reason: "电脑",
//     oper: 1,

// }, {
//     key: 2,
//     name: "hqf",
//     reason: "电脑",
//     oper: 4,
// }];

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
    const [isTBD, setTBD] = useState(false);//true即有待办任务，false相反
    const [dopen, setDOpen] = useState(false);
    const showDrawer = () => {
        setDOpen(true);
    };
    const onClose = () => {
        setDOpen(false);
    };
    useEffect((() => {
        fetchtbdData();
        fetchtbd();
    }), []);

    const showModal = () => {
        setOpen(true);
    };

    const fetchtbd=()=>{
        //资产管理员界面需要设置tbd的状态
        request("/api/user/ep/istbd", "GET").then((res) => {
            setTBD(res.info);
        }).catch((err) => {
            message.warning(err.message);
        });
    };
    const handleOk = () => {
        setTimeout(() => {
            setOpen(false);
        }, 3000);
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

    const handleCancel = () => {
        setOpen(false);
    };

    

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
                else {
                    return (
                        <Tag color="volcano">
                            资产退库
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
                    onOk={handleOk}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                        Return
                        </Button>,
                    ]}
                >
                    <Table columns={Assetcolumns} dataSource={assetdisdata} />
                </Modal>
                <SendR title={"请输入拒绝原因"} subtitle={"具体原因为："} isOpen={isDialogOpenSR} onClose={() => setIsDialogOpenSR(false)} onSendR={handleSendR} />
            </Drawer>
        </>
    );
};
export default TbdDrawer;
