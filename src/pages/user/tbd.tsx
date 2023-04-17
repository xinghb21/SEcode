import React, { useEffect, useState } from "react";
import { Drawer, Space, Button, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { request } from "../../utils/network";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
}
type DataType ={
    //table数据的格式
    key: React.Key;//id
    name: string;//申请人的名字
    oper: number,//对该资产进行什么操作：1领用，2转移，3维保，4退库
    reason: string;//申请原因
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

const TbdDrawer = (props: DrawerProps) => {
    const [tbdData, settbdData] = useState<DataType[]>([]);
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
            render: (record) => (
                <Space size="middle">
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
                            message.warning(err.message);
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
        </Drawer>
    );
};
export default TbdDrawer;
