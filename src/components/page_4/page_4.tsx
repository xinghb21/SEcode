import React from "react";
import { Divider, Typography } from "antd";
import {
    BarsOutlined
} from "@ant-design/icons";
import Dtree from "./departTree";


const Page_4 = () => {
    const { Title } = Typography;
    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "row" ,flexWrap:"wrap"}}>
                {/* <BarsOutlined style={{ marginTop: 20, marginRight: 10 }} /> */}
                {/* <Title level={4}>
                    {"🏬 "+localStorage.getItem("entity") + "部门管理"}
                </Title> */}
                {/* <Divider /> */}
            </div>
            <Dtree />
        </div>
    );
};

export default Page_4;