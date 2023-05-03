import React, { useEffect, useState } from "react";
import { Button, Col, Row, Statistic, message } from "antd";
import { request } from "../../utils/network";
import ReactECharts from "echarts-for-react";
import { Typography } from "antd";

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
    };

    let option = {
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

    return (
        <>
            <div style={{ width: "100%", height: "40%" }}>
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
            <div style={{ width: "100%", height: "30%" }}>
                <Title level={4}>资产状态分布</Title>
                <ReactECharts option={option} />
            </div>
            <div style={{ width: "100%", height: "30%" }}>
                <Title level={4}>资产净值统计</Title>
            </div>
        </>
    );
};

export default AssetStat;