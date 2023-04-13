import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const Page_home = () => {
    return (
        <div>
            <Title level={4}>Welcome Back, {localStorage.getItem("username")} !</Title>
        </div>
    );
};

export default Page_home;