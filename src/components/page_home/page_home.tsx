import React, { useEffect } from "react";
import { Avatar, Descriptions, Divider, Space, Typography, message } from "antd";
import { request } from "../../utils/network";
import { UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface Props {
    identity: string;
    username: string;
    department: string;
    entity: string;
}

const Page_home = () => {

    const [user, setUser] = React.useState<Props>({
        identity: "",
        username: "",
        department: "",
        entity: "",
    });

    useEffect(() => {
        request("/api/user/home/" + localStorage.getItem("username"), "GET")
            .then((res) => {
                if(res.identity === 1) res.identity = "超级系统管理员";
                else if(res.identity === 2) res.identity = "系统管理员";
                else if(res.identity === 3) res.identity = "资产管理员";
                else res.identity = "员工";
                setUser(res);
            })
            .catch((err) => {
                message.error(err.message);
            });
    }, []);

    return (
        <>
            <Space direction="horizontal">
                <div>
                    <Title>☕️Welcome Back, {localStorage.getItem("username")} !</Title>
                    <Descriptions title="User Info" bordered column={2}>
                        <Descriptions.Item label="Identity">{user.identity}</Descriptions.Item>
                        <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
                        <Descriptions.Item label="Department">{user.department}</Descriptions.Item>
                        <Descriptions.Item label="Entity">{user.entity}</Descriptions.Item>
                    </Descriptions>
                </div>
                <Avatar icon={<UserOutlined/>} />
            </Space>
            <Divider></Divider>
        </>
        
    );
};

export default Page_home;
