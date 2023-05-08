import { Button, Modal, Input, Select, InputNumber, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { request } from "../../utils/network";

const AssetWarn = () => {
    const [isMopen, setIsModalOpen] = useState(false);
    const [choseV, setCV] = useState(0);
    const [inputAN, setAN] = useState<string>();
    const [inputWC, setWC] = useState<number>();

    const handleOk = () => {
        request("/api/user/ep/aw/newaw","POST",{
            assetname:inputAN,
            warning:choseV,
            condition:inputWC
        })
            .then(()=>{
            
            })
            .catch((err)=>{
                message.warning(err.message);
            });
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSChange = (value: number) => {
        setCV(value);
    };
    return (
        <>
            <div style={{ marginTop: 10 }}>
                <Button type="primary" onClick={() => { setIsModalOpen(true); }}>
                    <PlusOutlined />
                    添加告警策略
                </Button>
                <Modal title={
                    <text>
                        <WarningOutlined />
                        告警策略
                    </text>
                } open={isMopen} onOk={handleOk} onCancel={handleCancel}>
                    <div>
                        <label>资产实例名称</label>
                        <div style={{ marginTop: 5 }}>
                            <Space.Compact>
                                <Input onChange={(e) => setAN(e.target.value)} ></Input>
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
                            {choseV === 0 ? <div style={{ marginTop: 5 }}>
                                <label>资产使用超过 </label>
                                <InputNumber min={0}
                                    onChange={(value) => {
                                        if (value == null) {
                                        } else { setWC(value); }
                                    }}
                                />
                                <label> 年，则开始告警</label>
                            </div> : <div style={{ marginTop: 5 }}>
                                <label>资产数量少于 </label>
                                <InputNumber min={0}
                                    onChange={(value) => {
                                        if (value == null) {
                                        } else { setWC(value); }
                                    }}
                                />
                                <label> ，则开始告警</label>
                            </div>}
                        </div>
                    </div>
                </Modal>
            </div>
            <div>

            </div>
        </>
    );
};
export default AssetWarn;