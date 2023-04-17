import React, { useEffect, useState } from "react";
import { Drawer, Space, Button, Table, Tag, message, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { request } from "../../utils/network";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
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
    assetcount: number;//申请原因
}

const data = [{
    key: 1,
    name: "cjt",
    reason: "电脑",
    oper: 1,

}, {
    key: 2,
    name: "hqf",
    reason: "电脑",
    oper: 4,
}];

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
]

const TbdDrawer = (props: DrawerProps) => {
    const [tbdData, settbdData] = useState<DataType[]>([]);
    const [open, setOpen] = useState(false);
    const [assetdisdata, setassetdisData] = useState<AssetDisplayType[]>([]);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setTimeout(() => {
            setOpen(false);
        }, 3000);
    };

    const handleCancel = () => {
        setOpen(false);
    };
    useEffect((() => {
        fetchtbdData();
    }), []);
    const fetchtbdData = () => {
        request("/api/user/ep/getallapply", "GET")
            .then((res) => {
                settbdData(res.info.map(([id, name, reason, oper]) => {
                    return {
                        key: id,
                        name: name,
                        reason: reason,
                        oper: oper
                    }
                }));
            })
            .catch((err) => {
                message.warning(err);
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
            render: () => (
                <Space size="middle">
                    <Button type="link" onClick={(record) => {
                        request("/api/user/ep/assetsinapply", "GET", {
                            id: record.id
                        }).then((res) => {
                            setassetdisData(res.info.map(([id, assetname, assetclass, assetcount]) => {
                                return {
                                    key: id,
                                    assetname: assetname,
                                    assetclass: assetclass,
                                    assetcount: assetcount
                                }
                            }));
                            setOpen(true);
                        }).catch((err) => {
                            message.warning(err.detail);
                        });
                    }}>详细</Button>
                    <Button danger={true} onClick={(record) => {

                    }}>
                        拒绝
                    </Button>
                    <Button type="primary" onClick={(record) => {
                        request("/api/user/ep/reapply", "POST", {
                            id: record.key,
                            status: 0,
                            reason: "Success!"
                        }).then(() => {
                            fetchtbdData();
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
        <Drawer
            title="待办任务列表"
            width={"70%"}
            onClose={props.onClose}
            open={props.isOpen}
        >
            <Table columns={columns} dataSource={tbdData} />
            <Modal
                open={open}
                title="所申请资产详细"
                onOk={handleOk}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Return
                    </Button>,
                ]}
            >
                <Table columns={Assetcolumns} dataSource={assetdisdata} />
            </Modal>
        </Drawer>
    );
};
export default TbdDrawer;
