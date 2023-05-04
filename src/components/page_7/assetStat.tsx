import React, { useEffect, useState } from "react";
import { Button, Col, Row, Statistic, message } from "antd";
import { request } from "../../utils/network";
import ReactECharts from "echarts-for-react";
import { Typography } from "antd";
import moment from "moment";

const { Title } = Typography;



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

    useEffect((() => {
        fetchtData();
    }), []);

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
            setDS(res.info.map((item)=>{
                return {value:item.number, name: item.name};
            }));
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
                    <Title level={4}>资产部门分布</Title>
                    <ReactECharts option={optionforDN} />
                </div>
            </div>
            <div style={{ width: "100%", height: "40%" }}>
                <Title level={4}>资产净值统计</Title>
                <Statistic title="当前资产总净值 单位：元" value={totalNV} />
                <ReactECharts option={optionforNV} />
            </div>
        </>
    );
};

export default AssetStat;