import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Divider, Space, Modal, message, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { request } from "../utils/network";
import { Md5 } from "ts-md5";
import Circle from "./background";
import Head from "next/head";
import Head from "next/head";
import SITE_CONFIG from "../settings";
import ReactCanvasNest from "react-canvas-nest"; 
const { Title } = Typography;

interface LoginFormProps {
    username: string,
    password: string,
}

const LoginForm = (props: LoginFormProps) => {
    const [correct, setPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const router = useRouter();

    const handleSubmit = (values: any) => {
        setLoading(true);
        request(
            "/api/user/login",
            "POST",
            {
                name: values.username,
                password: Md5.hashStr(values.password)
            }
        ).then(() => {
            localStorage.setItem("username",values.username);
            router.push("/user");
        })
            .catch((err) => {
                message.warning(err.message);
                router.push("/");
                setLoading(false);
            });
    };

    return (
        <div>
            <Head>
                <title>Aplus</title>
            </Head>
            <div className="login-background" />
            <div className="login-box"> 
                <div style={{
                    position: "absolute", left: "50%", top: "50%",
                    transform: "translate(-50%, -50%)"
                }}>
                    <Title level={1} className="login-title" style={{marginBottom: "24%"}}>Login</Title>
                    <Form onFinish={handleSubmit}
                        name="basic"
                        initialValues={{ remember: true }}>

                        <Space direction="vertical" size="middle">

                            <Form.Item name="username" rules={[{ required: true, message: "请输入用户名" }]}>
                                <div className="group">
                                    <input type="text" className="input"/>
                                    <span className="highlight"></span>
                                    <span className="bar"></span>
                                    <label>Username</label>
                                </div>
                            </Form.Item>

                            <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
                                <div className="group">
                                    <input type="password" className="input"/>
                                    <span className="highlight"></span>
                                    <span className="bar"></span>
                                    <label>Password</label>
                                </div>
                            </Form.Item>

                        </Space>

                        <Modal open={!correct} onOk={() => setPassword(true)} onCancel={() => setPassword(true)} centered>
                            {error}
                        </Modal>

                        <Form.Item>
                            <button className="cssbuttons-io-button" style={{paddingLeft: "40%"}}> 
                                    登录
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
                                    </svg>
                                </div>
                            </button>
                        </Form.Item>
                    </Form>
                    <Divider >Or</Divider>
                    <button className="cssbuttons-io-button" onClick={() => {
                        window.location.href = "https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=cli_a4b17e84d0f8900e&redirect_uri="+SITE_CONFIG.FRONTEND+"/feishu"+"&response_type=code";
                        return null;
                    }}> 
                            飞书登录
                        <div className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
            <div>
                <Circle />
            </div>
        </div>
    );
};

export default LoginForm;
