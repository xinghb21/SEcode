import React from "react";
import { Typography } from "antd";
import {
    BarsOutlined
} from "@ant-design/icons";
import ACtree from "./assetClassTree";


const Page_5 = () => {
    const { Title } = Typography;
    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "row", flexWrap: "wrap" }}>
                <BarsOutlined style={{ marginTop: 20, marginRight: 10 }} />
                <Title level={4}>
                    {localStorage.getItem("department") + "资产类别管理"}
                </Title>
            </div>
            < ACtree />
        </div>
    );
};

export default Page_5;