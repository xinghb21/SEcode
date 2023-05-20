import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Select, Statistic, message } from "antd";
import { request } from "../../utils/network";
import ReactECharts from "echarts-for-react";
import { Typography } from "antd";
import moment from "moment";

const { Title } = Typography;
const { Text } = Typography;



const AssetStat = () => {
    //资产总计
    const [entrytotal, setET] = useState(0);
    const [quantTypetotal, setQTT] = useState(0);
    const [quantNumtotal, setQNT] = useState(0);
    //资产状态分布统计
    const [freeNumber, setFN] = useState(0);
    const [totccupyNumber, setTON] = useState(0);
    const [partccupyNumber, setPON] = useState(0);
    const [totfixNumber, setTFN] = useState(0);
    const [partfixNumber, setPFN] = useState(0);
    const [tbfixNumber, setTBF] = useState(0);
    //资产部门分布统计
    const [departStata, setDS] = useState([]);
    //资产净值统计
    const [totalNV, setTNV] = useState(0);
    const [NVCdate, setNVD] = useState<string[]>([]);
    const [NVCvalue, setNVV] = useState([]);
    //资产部门详细
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [departeList, setDL] = useState<string[]>([]);
    const [depart, setD] = useState<string>("");
    //资产总计
    const [entryDeptotal, setDET] = useState(0);
    const [quantDepTypetotal, setDQTT] = useState(0);
    const [quantDepNumtotal, setDQNT] = useState(0);
    //资产状态分布统计
    const [freeDepNumber, setDFN] = useState(0);
    const [totDepccupyNumber, seDTON] = useState(0);
    const [partDepccupyNumber, setDPON] = useState(0);
    const [totDepfixNumber, setDTFN] = useState(0);
    const [partDepfixNumber, setDPFN] = useState(0);
    const [tbDepfixNumber, setDTBF] = useState(0);
    //资产部门分布统计
    const [departDepStata, setDDS] = useState([]);
    //资产净值统计
    const [totalDepNV, setTDNV] = useState(0);
    //资产部门详细

    useEffect((() => {
        fetchtData();
    }), []);
    useEffect((() => {
        if (depart == "") {
            return;
        }
        else {
            fetchDepData();
        }
    }), [depart]);

    const fetchtData = () => {
        request("/api/user/ep/as/atotal", "GET").then((res) => {
            setET(res.info.entryNumber);
            setQTT(res.info.quantTypeNumber);
            setQNT(res.info.quantTotalNumber);
        }).catch((err) => {
            message.warning(err.message);
        });
        request("/api/user/ep/as/astatotal", "GET").then((res) => {
            setFN(res.info.freeNumber);
            setTON(res.info.totccupyNumber);
            setPON(res.info.partccupyNumber);
            setTFN(res.info.totfixNumber);
            setPFN(res.info.partfixNumber);
            setTBF(res.info.tbfixNumber);
        }).catch((err) => {
            message.warning(err.message);
        });
        request("/api/user/ep/as/totalnvalue", "GET").then((res) => {
            setTNV(res.info.totalnetvalue);
        }).catch((err) => {
            message.warning(err.message);
        });
        request("/api/user/ep/as/nvcurve", "GET").then((res) => {
            setNVD(res.info.map((item) => {
                if (item.netvalue == -1) {
                }
                else {
                    return moment((item.date) * 1000).format("YYYY-MM-DD");
                }
            }));
            setNVV(res.info.map((item) => {
                if (item.netvalue == -1) {
                }
                else {
                    return item.netvalue;
                }
            }));
        }).catch((err) => {
            message.warning(err.message);
        });
        request("/api/user/ep/as/departasset", "GET").then((res) => {
            setDS(res.info.map((item) => {
                return { value: item.number, name: item.name };
            }));
            setDL(res.info.map((item) => {
                return item.name;
            }));
        }).catch((err) => {
            message.warning(err.message);
        });
    };
    const fetchDepData = () => {
        request("/api/user/ep/as/subas", "GET", {
            department: depart
        }).then((res) => {
            setDET(res.info.number.entryNumber);
            setDQTT(res.info.number.quantTypeNumber);
            setDQNT(res.info.number.quantTotalNumber);
            //
            setDFN(res.info.status.freeNumber);
            seDTON(res.info.status.totccupyNumber);
            setDPON(res.info.status.partccupyNumber);
            setDTFN(res.info.status.totfixNumber);
            setDPFN(res.info.status.partfixNumber);
            setDTBF(res.info.status.tbfixNumber);
            //资产部门分布统计
            setDDS(res.info.seperate.map((item) => {
                return { value: item.number, name: item.name };
            }));
            //资产净值统计
            setTDNV(res.info.totalnetvalue.totalnetvalue);
        }).catch((err) => {
            message.warning(err.message);
        });
    };
    //资产状态统计
    let optionforSN = {
        tooltip: {
            trigger: "item"
        },
        legend: {
            top: "5%",
            left: "center"
        },
        series: [
            {
                name: "Access From",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: "center"
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: "bold"
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: freeNumber, name: "闲置" },
                    { value: totccupyNumber, name: "完全占用" },
                    { value: partccupyNumber, name: "部分占用" },
                    { value: totfixNumber, name: "完全维保" },
                    { value: partfixNumber, name: "部分维保" },
                    { value: tbfixNumber, name: "需要清退" }
                ]
            }
        ]
    };
    //资产部门统计
    let optionforDN = {
        tooltip: {
            trigger: "item"
        },
        legend: {
            top: "5%",
            left: "center"
        },
        series: [
            {
                name: "Access From",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: "center"
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: "bold"
                    }
                },
                labelLine: {
                    show: false
                },
                data: departStata
            }
        ]
    };
    //资产净值变化曲线
    let optionforNV = {
        tooltip: {// 提示框组件。// trigger:'item' 默认的鼠标移动到色块上触发
            trigger: "axis", // 鼠标只要在轴上就会触发
        },
        xAxis: {
            name: "日期",
            type: "category",
            data: NVCdate,
            nameTextStyle: {
                fontWeight: 600,
                fontSize: 15
            }
        },
        yAxis: {
            name: "单位：元",
            type: "value",
            axisLine: {
                show: true
            },
            nameTextStyle: {
                fontWeight: 600,
                fontSize: 15
            }

        },
        series: [
            {
                data: NVCvalue,
                type: "line",
                smooth: true
            }
        ]

    };

    //详细资产状态统计
    let optionforDSN = {
        tooltip: {
            trigger: "item"
        },
        legend: {
            top: "5%",
            left: "center"
        },
        series: [
            {
                name: "Access From",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: "center"
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: "bold"
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: freeDepNumber, name: "闲置" },
                    { value: totDepccupyNumber, name: "完全占用" },
                    { value: partDepccupyNumber, name: "部分占用" },
                    { value: totDepfixNumber, name: "完全维保" },
                    { value: partDepfixNumber, name: "部分维保" },
                    { value: tbDepfixNumber, name: "需要清退" }
                ]
            }
        ]
    };
    //详细资产部门统计
    let optionforDDN = {
        tooltip: {
            trigger: "item"
        },
        legend: {
            top: "5%",
            left: "center"
        },
        series: [
            {
                name: "Access From",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: "center"
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: "bold"
                    }
                },
                labelLine: {
                    show: false
                },
                data: departDepStata
            }
        ]
    };
    return (
        <>
            <div style={{ width: "100%", height: "20%" }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic title="数量型资产类别数量" value={quantTypetotal} />
                    </Col>
                    <Col span={12}>
                        <Statistic title="条目型资产总数量" value={entrytotal} />
                    </Col>
                    <Col span={12}>
                        <Statistic title="数量型资产总数量" value={quantNumtotal} />
                    </Col>
                </Row>
            </div>
            <div style={{ width: "100%", height: "40%", display: "flex", flexDirection: "row" }}>
                <div style={{ width: "50%" }}>
                    <Title level={4}>资产状态分布</Title>
                    <ReactECharts option={optionforSN} />
                </div>
                <div style={{ width: "50%" }}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "end" }}>
                        <Title level={4}>资产部门分布</Title>
                        <Button type="link" size="small" onClick={() => { setIsOpen(true); }}>查看详细</Button>
                    </div>
                    <ReactECharts option={optionforDN} />
                </div>
            </div>
            <div style={{ width: "100%", height: "40%" }}>
                <Title level={4}>资产净值统计</Title>
                <Statistic title="当前资产总净值 单位：元" value={totalNV} />
                <Text type="secondary">{"更新时间：" + moment(Date.parse(new Date().toString())).format("YYYY-MM-DD HH:mm:ss") + " GMT+0800 (中国标准时间)"}</Text>
                <ReactECharts option={optionforNV} />
            </div>
            <Modal
                style={{
                    minHeight: "700px",
                    minWidth: "800px",
                    margin: "0 auto",
                }}
                open={isOpen}
                onOk={() => { setIsOpen(false); }}
                onCancel={() => { setIsOpen(false); }}
                title="资产部门分布详细">
                <div>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "end" }}>
                        <Title level={5} style={{ marginTop: 5, marginRight: 20 }}>选择下属部门</Title>
                        <Select
                            value={depart}
                            options={departeList.map((item) => {
                                return {
                                    value: item,
                                    label: item,
                                };
                            })}
                            style={{ minWidth: "30%" }}
                            onChange={(value) => { setD(value); }}></Select>
                    </div>
                    <div style={{ width: "100%", height: "40%" }}>
                        <Title level={4}>资产净值统计</Title>
                        <Statistic title="当前资产总净值 单位：元" value={totalDepNV} />
                        <Text type="secondary">{"更新时间：" + moment(Date.parse(new Date().toString())).format("YYYY-MM-DD HH:mm:ss") + " GMT+0800 (中国标准时间)"}</Text>
                    </div>
                    <div style={{ width: "100%", height: "20%" }}>
                        <Title level={4}>资产数量统计</Title>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Statistic title="数量型资产类别数量" value={quantDepTypetotal} />
                            </Col>
                            <Col span={12}>
                                <Statistic title="条目型资产总数量" value={entryDeptotal} />
                            </Col>
                            <Col span={12}>
                                <Statistic title="数量型资产总数量" value={quantDepNumtotal} />
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <div>
                            <Title level={4}>资产状态分布</Title>
                            <ReactECharts style={{
                                height: "300px",
                                width: "600px",
                                margin: "0 auto",
                            }} option={optionforDSN} />
                        </div>
                        <div >
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "end" }}>
                                <Title level={4}>资产部门分布</Title>
                            </div>
                            <ReactECharts style={{
                                height: "300px",
                                width: "400px",
                                margin: "0 auto",
                            }} option={optionforDDN} />
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AssetStat;