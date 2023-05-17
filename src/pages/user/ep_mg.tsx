import React, { useEffect, useState } from "react";
import { Drawer,  Button, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { request } from "../../utils/network";
import {
    MessageTwoTone,
} from "@ant-design/icons";

import { Badge, Tooltip } from "antd";


type Message = {
    key: React.Key;
    type: number;
    message: string;
}


const Ep_Message = () => {

    const [messages, setMessage] = useState<Message[]>([]);
    const [isTBD, setTBD] = useState(false);//true即有待办任务，false相反
    const [dopen, setDOpen] = useState(false);

    useEffect((() => {
        fetchmessge();
        fetchtbd();
    }), []);

    const showDrawer = () => {
        setDOpen(true);
    };

    const onClose = () => {
        fetchtbd();
        setDOpen(false);
    };

    const fetchmessge = () => {
        request("/api/user/ep/allmessage", "GET")
            .then((res) => {
                setMessage(res.info);
            })
            .catch((err) => {
                message.warning(err.message);
            });
    };

    const fetchtbd = () => {
        request("/api/user/ep/beinformed", "GET").then((res) => {
            setTBD(res.info);
        }).catch((err) => {
            message.warning(err.message);
        });
    };


    const columns: ColumnsType<Message> = [
        {
            title: "编号",
            dataIndex: "key",
        },
        {
            title: "类型",
            dataIndex: "type",
            render: (text) => {
                if (text === 0) {
                    return (
                        <Tag color="yellow">
                            资产告警
                        </Tag>
                    );
                }
                else if(text === 1){
                    return (
                        <Tag color="blue">
                            资产清退
                        </Tag>
                    );
                }
                else if(text === 2){
                    return (
                        <Tag color="green">
                            调拨成功
                        </Tag>
                    );
                }
                else{
                    return (
                        <Tag color="red">
                            调拨失败
                        </Tag>
                    );
                }
            },
        },
        {
            title: "内容",
            dataIndex: "message",
        },
        {
            title: "操作",
            render: (record) => {
                if (record.type == 0) {
                    return (
                        <Button danger disabled>
                            删除
                        </Button>
                    );
                }
                else {
                    return (
                        <Button danger onClick={() => {
                            request("/api/user/ep/dclearmg", "DELETE", {
                                key: record.key
                            })
                                .then(() => { 
                                    fetchmessge(); 
                                    fetchtbd(); 
                                })
                                .catch((err) => {
                                    message.warning(err.message);
                                });
                        }}> 删除</Button>
                    );
                }
            },
        },
    ];

    return (
        <>
            <Tooltip placement="bottomLeft" title={<span>通知消息</span>}>
                <Button type="text" size="large" style={{ marginTop: 5, marginBottom: 5 }} onClick={showDrawer}>
                    <Badge dot style={{ visibility: (!isTBD) ? "hidden" : "visible" }}>
                        <MessageTwoTone twoToneColor={(!isTBD) ? "#a8a8a8" : "#f82212"} style={{ fontSize: "25px" }} />
                    </Badge>
                </Button>
            </Tooltip>
            <Drawer
                title="消息列表"
                width={"40%"}
                onClose={onClose}
                open={dopen}
            >
                <Table columns={columns} dataSource={messages} />
            </Drawer>
        </>
    );
};
export default Ep_Message;