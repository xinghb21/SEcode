import { request } from "../../utils/network";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { Form, Skeleton, Spin, Typography, message } from "antd";
import { Md5 } from "ts-md5";

import SITE_CONFIG from "../../settings";
import Head from "next/head";
import Circle from "../background";
const { Title } = Typography;

const Feishu = () => {

    const router = useRouter();
    const query = router.query;
    const [load, setLoad] = useState(true);

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        let url = "/api/feishu/code?code=" + query.code + "&redirect=" + SITE_CONFIG.FRONTEND + "/feishu";
        request(url, "GET")
            .then((res) => {
                request("/api/feishu/isbound", "GET")
                    .then((res) => {
                        if(res.isbound) {
                            request("/api/feishu/login", "POST", {
                                name: res.name,
                            })
                                .then(() => {
                                    localStorage.setItem("username",res.name);
                                    router.push("/user");
                                })
                                .catch((err) => {
                                    message.warning(err.message);
                                    router.push("/");
                                });
                        } else {
                            setLoad(false);
                            message.warning("请绑定系统帐号");
                        }
                    })
                    .catch((err) => {
                        message.warning(err.message);
                        router.push("/");
                    });
            })
            .catch((err) => {
                message.warning(err.message);
                router.push("/");
            });
        setTimeout(() => {
            setLoad(false);
        }, 1000000);
    }, [router, query]);

    return (
        <Skeleton loading={load} active round paragraph={{ rows: 5 }}>
            <Head>
                <title>Aplus</title>
            </Head>
            <div className="login-background" />
            <div className="login-box"> 
                <div style={{
                    position: "absolute", left: "50%", top: "50%",
                    transform: "translate(-50%, -50%)"
                }}>
                    <Title level={1} className="login-title" style={{marginBottom: "24%"}}>绑定系统账号</Title>
                    <Form
                        onFinish={async (form) => {
                            request("/api/feishu/binduser", "POST", {
                                name: form.username,
                                password: Md5.hashStr(form.password),
                            })
                                .then(() => {
                                    request("/api/feishu/login", "POST", {
                                        name: form.username,
                                    })
                                        .then(() => {
                                            localStorage.setItem("username",form.username);
                                            router.push("/user");
                                        })
                                        .catch((err) => {
                                            message.warning(err.message);
                                            router.push("/");
                                        });
                                }) 
                                .catch((err) => {
                                    message.warning(err.message);
                                });
                        
                        }}
                    >
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

                        <Form.Item>
                            <button className="cssbuttons-io-button" style={{paddingLeft: "40%"}}> 
                                    确认
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
                                    </svg>
                                </div>
                            </button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div>
                <Circle />
            </div>
        </Skeleton>
    );
};

export default Feishu;