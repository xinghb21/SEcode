import { Button, Modal, Input, Select, InputNumber, Space, message, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { request } from "../../utils/network";

type WarningType = {
    //详细table数据的格式
    key: React.Key;//策略编号
    assetname: string;//资产名称
    warning: number,//告警的策略，0为资产过旧，1为资产数量不足
    condition: number;//策略条件，即需要设定的年限或者数量
}


const AssetWarn = () => {

    const [isMopen, setIsModalOpen] = useState(false);//增加model
    const [inputAN, setAN] = useState<string>("");//输入的资产名称
    const [choseV, setCV] = useState(0);//选中的策略类型
    const [inputWC, setWC] = useState<number>(0);//输入的告警条件
    const [allwarning, setwarning] = useState<WarningType[]>([]);//所有的告警策略
    const [changeV, setCGV] = useState(0);//要修改的策略的类型
    const [choseK, setCK] = useState<React.Key>();//要修改的策略的编号
    const [isMCopen, setIsMCOpen] = useState(false);//修改model
    const [inputCGWC, setCGWC] = useState<number>(0);//更改后的告警条件
    const [input_status, setIS] = useState<boolean>(true);//NumberInput的状态

    //表格的规范
    const Assetcolumns: ColumnsType<WarningType> = [
        {
            title: "资产名称",
            dataIndex: "assetname",
        },
        {
            title: "策略类型",
            dataIndex: "warning",
            render: (text) => {
                if (text === 0) {
                    return (<Tag color="volcano">
                        年限告警
                    </Tag>
                    );
                }
                else {
                    <Tag color="yellow">
                        数量告警
                    </Tag>;
                }
            },
        },
        {
            title: "告警条件",
            render: (record) => (
                <>
                    {
                        record.warning == 0 ? "资产使用超过" : "资产数量少于"
                    }
                    {record.condition}
                    {
                        record.warning == 0 ? "年，则开始告警" : "，则开始告警"
                    }
                </>),
        },
        {
            title: "操作",
            render: (record) => (
                <>
                    <Button danger onClick={() => {
                        request("/api/user/ep/aw/deleteaw", "DELETE", {
                            key: record.key
                        }).then(() => {
                            message.success("成功删除该资产告警策略");
                            fetchWarning();
                        }).catch((err) => {
                            message.warning(err.message);
                        });
                    }}>删除</Button>
                    <Button onClick={() => {
                        setCK(record.key);
                        setCGV(record.warning);
                        setIsMCOpen(true);
                    }}
                        style={{ marginLeft: 10 }}>修改条件</Button>
                </>
            ),

        }
    ];

    useEffect((() => {
        fetchWarning();
    }), []);

    //获得当下部门所有的告警策略
    const fetchWarning = () => {
        request("/api/user/ep/aw/getw", "GET")
            .then((res) => {
                setwarning(res.info);
            })
            .catch((err) => {
                message.warning(err.message);
            });
    };
    //确定增加
    const handleOk = () => {
        request("/api/user/ep/aw/newaw", "POST", {
            assetname: inputAN,
            warning: choseV,
            condition: inputWC
        })
            .then(() => {
                message.success("成功创建新的资产告警策略");
                fetchWarning();
                setCV(0);
                setAN("");
                setWC(0);
                setIsModalOpen(false);
            })
            .catch((err) => {
                message.warning(err.message);
            });
        //清空
        setCV(0);
        setAN("");
        setWC(0);
    };


    const handleCancel = () => {
        setIS(true);
        setCV(0);
        setAN("");
        setWC(0);
        setIsModalOpen(false);
    };
    //确定修改
    const handleMCOk = () => {
        request("/api/user/ep/aw/cgcondition", "POST", {
            key: choseK,
            newcondition: inputCGWC
        })
            .then(() => {
                message.success("成功修改资产告警策略");
                fetchWarning();
                setIsMCOpen(false);
            })
            .catch((err) => {
                message.warning(err.warning);
            });
        setCGWC(0);
    };

    const handleMCCancel = () => {
        setIsMCOpen(false);
    };

    const handleSChange = (value: number) => {
        setCV(value);
    };
    return (
        <>
            <div style={{ marginTop: 10, marginBottom: 20 }}>
                <Button type="primary" onClick={() => { setIsModalOpen(true); }}>
                    <PlusOutlined />
                    添加告警策略
                </Button>
                <Modal title={
                    <text>
                        <WarningOutlined />
                        告警策略
                    </text>
                } open={isMopen} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ disabled: (input_status ? false : true) }}>
                    <div>
                        <label>资产实例名称</label>
                        <div style={{ marginTop: 5 }}>
                            <Space.Compact>
                                <Input value={inputAN} onChange={(e) => setAN(e.target.value)} ></Input>
                            </Space.Compact>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
                        <div>
                            <label>
                                资产告警策略</label>
                            <div style={{ marginTop: 5 }}>
                                <Select
                                    style={{ width: 120 }}
                                    defaultValue={0}
                                    value={choseV}
                                    onChange={handleSChange}
                                    options={[
                                        { value: 0, label: "年限告警" },
                                        { value: 1, label: "数量告警" },
                                    ]}
                                />
                            </div>
                        </div>
                        <div style={{ marginLeft: 50 }}>
                            <label>资产告警条件</label>
                            {choseV === 0
                                ?
                                <div style={{ marginTop: 5 }}>
                                    <label>资产使用超过 </label>
                                    <InputNumber min={0}
                                        status={input_status ? "" : "error"}
                                        value={inputWC}
                                        onChange={(value) => {
                                            if (value == null) {
                                                setIS(false);
                                                message.warning("请输入数值");
                                            }
                                            else if (typeof (value) != "number") {
                                                setIS(false);
                                                message.warning("请输入数值");
                                            }
                                            else {
                                                setIS(true);
                                                setWC(value);
                                            }
                                        }}
                                    />
                                    <label> 年，则开始告警</label>
                                </div>
                                :
                                <div style={{ marginTop: 5 }}>
                                    <label>资产数量少于 </label>
                                    <InputNumber min={0}
                                        status={input_status ? "" : "error"}
                                        value={inputWC}
                                        onChange={(value) => {
                                            if (value == null) {
                                                setIS(false);
                                                message.warning("请输入数值");
                                            }
                                            else if (typeof (value) != "number") {
                                                setIS(false);
                                                message.warning("请输入数值");
                                            } else {
                                                setIS(true);
                                                setWC(value);
                                            }
                                        }}
                                    />
                                    <label> ，则开始告警</label>
                                </div>
                            }
                        </div>
                    </div>
                </Modal>
                <Modal title={
                    <text>
                        <WarningOutlined />
                        修改告警策略条件
                    </text>
                }
                    open={isMCopen} onOk={handleMCOk} onCancel={handleMCCancel} okButtonProps={{ disabled: (input_status ? false : true) }}>
                    <div>
                        <label>新条件为</label>
                        {changeV == 0 ?
                            <>
                                <label>
                                    新的告警年限为
                                </label>
                                <div>
                                    <InputNumber min={0}
                                        style={{ marginTop: 10 }}
                                        value={inputCGWC}
                                        status={input_status ? "" : "error"}
                                        onChange={(value) => {
                                            if (value == null) {
                                                setIS(false);
                                                message.warning("请输入数值");
                                            }
                                            else if (typeof (value) != "number") {
                                                setIS(false);
                                                message.warning("请输入数值");
                                            }
                                            else {
                                                setIS(true);
                                                setCGWC(value);
                                            }
                                        }}
                                    />
                                </div>
                            </>
                            :
                            <>
                                <label>
                                    新的告警数量为
                                </label>
                                <div style={{ marginTop: 10, marginBottom: 10 }}>
                                    <InputNumber min={0}
                                        style={{ marginTop: 10 }}
                                        value={inputCGWC}
                                        status={input_status ? "" : "error"}
                                        onChange={(value) => {
                                            if (value == null) {
                                                setIS(false);
                                                message.warning("请输入数值");
                                            }
                                            else if (typeof (value) != "number") {
                                                setIS(false);
                                                message.warning("请输入数值");
                                            }
                                            else {
                                                setIS(true);
                                                setCGWC(value);
                                            }
                                        }}
                                    />
                                </div>
                            </>
                        }
                    </div>
                </Modal>
            </div>
            <div style={{ margin: 5 }}>
                <Table columns={Assetcolumns} dataSource={allwarning} bordered={true}></Table>
            </div>
        </>
    );
};
export default AssetWarn;
