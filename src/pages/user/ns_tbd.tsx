import React, { useEffect, useState } from "react";
import { Drawer, Space, Button, Table, Tag, message, Modal, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { request } from "../../utils/network";
import {
    MessageOutlined,
} from "@ant-design/icons";

import { Badge, Tooltip } from "antd";

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSendR: (reason: string) => void;
    title: string;
    subtitle: string;
}

type Asset = {
    key: React.Key;
    assetname: string;
    number: number;
}

type Message = {
    key: React.Key;
    id: number;
    message: string;
    type: number;
    status: number;
    assets: Asset[];
}


const Assetcolumns: ColumnsType<Asset> = [
    {
        title: "资产名称",
        dataIndex: "assetname",
    },
    {
        title: "资产数量",
        dataIndex: "number",
    }
];

const columns: ColumnsType<Message> = [
    {
        title: "资产名称",
        dataIndex: "assetname",
    },
    {
        title: "资产数量",
        dataIndex: "number",
    },
    {
        title: "指定类别",
        dataIndex: "operation",
        render: (_, record) => {
            return (
                <Space>
                    <Button type="primary" onClick={() => { }}>指定</Button>
                </Space>
            );
        },
    },
];

const NSTbdDrawer = () => {

    const [messages, setMessage] = useState<Message[]>([]);
    const [open, setOpen] = useState(false);
    const [assetdisdata, setassetdisData] = useState<Message>();

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
        request("/api/user/ns/hasmessage", "GET").then((res) => {
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

    const handleCancel = () => {
        setOpen(false);
    };

    const fetchtbdData = () => {
        request("/api/user/ns/getmessage", "GET")
            .then((res) => {
                let data: Message[] = res.info;
                if(data.length != 0){
                    data.forEach((item) => {
                        item.key = item.id; 
                        if(item.assets != null){
                            item.assets.forEach((item) => {
                                item.key = item.assetname;
                                return item;
                            });
                        }
                        return item;
                    });
                }
                setMessage(data);
            })
            .catch((err) => {
                message.warning(err.message);
            });
    };
    const columns: ColumnsType<Message> = [
        {
            title: "消息编号",
            dataIndex: "id",
        },
        {
            title: "操作类型",
            dataIndex: "type",
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
                else if (text === 4){
                    return (
                        <Tag color="volcano">
                            资产退库
                        </Tag>
                    );
                } else {
                    return (
                        <Tag color="purple">
                            待确认资产
                        </Tag>
                    );
                }
            },
        },
        {
            title: "审批结果",
            dataIndex: "status",
            render: (text) => {
                return (
                    text == 1 ? <Tag color="green">通过</Tag> : <Tag color="red">未通过</Tag>
                );
            },
        },
        {
            title: "操作",
            render: (record) => {
                return (
                    <Button type="primary" onClick={() => {
                        request("/api/user/ns/read", "POST", {
                            id: record.id
                        }).then(() => {
                            setassetdisData(messages.filter((item) => item.id === record.id)[0]);
                            showModal();
                        }).catch((err) => {
                            message.warning(err.detail);
                        });
                    }}> 查看</Button> 
                );
            },
        },
    ];

    return (
        <>
            <Tooltip placement="bottomLeft" title={<span>通知消息</span>}>
                <Button type="text" size="large" style={{ margin: 5 }} onClick={showDrawer}>
                    <Badge dot style={{ visibility: (!isTBD) ? "hidden" : "visible" }}>
                        <MessageOutlined twoToneColor={(!isTBD) ? "#a8a8a8" : "#f82212"} style={{ fontSize: "25px" }} />
                    </Badge>
                </Button>
            </Tooltip>
            <Drawer
                title="消息列表"
                width={"60%"}
                onClose={onClose}
                open={dopen}
            >
                <Table columns={columns} dataSource={messages} />
                <Modal
                    open={open}
                    title="详细信息"
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Return
                        </Button>,
                    ]}
                >   
                    <p>消息编号：{assetdisdata?.id}</p>
                    <p>操作类型：{assetdisdata?.type === 1 ? "资产领用" : assetdisdata?.type === 2 ? "资产转移" : assetdisdata?.type === 3 ? "资产维保" : assetdisdata?.type === 4 ? "资产退库" : "待确认资产"}</p>
                    <p>审批结果：{assetdisdata?.status === 1 ? "通过" : "未通过"}</p>
                    <p>审批意见：{assetdisdata?.message}</p>
                    {assetdisdata?.type != 5 ? <Table columns={Assetcolumns} dataSource={assetdisdata?.assets} /> : 
                        <Table columns={Assetcolumns} dataSource={assetdisdata?.assets} />
                    }
                </Modal>
            </Drawer>
        </>
    );
};
export default NSTbdDrawer;