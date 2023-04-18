import {
    LockOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    LoginForm,
    ProFormText,
    ProConfigProvider,
} from "@ant-design/pro-components";
import { request } from "../../utils/network";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Skeleton } from "antd";
import { Md5 } from "ts-md5";


const Feishu = () => {

    const router = useRouter();
    const query = router.query;
    const [load, setLoad] = useState(true);

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        let url = "/api/feishu/code?code=" + query.code + "&redirect=http://localhost:3000/feishu";
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
                                    alert(err);
                                    router.push("/");
                                });
                        } 
                    })
                    .catch((err) => {
                        alert(err);
                    });
            })
            .catch((err) => {
                alert(err);
            });
        setTimeout(() => {
            setLoad(false);
        }, 2000);
    }, [router, query]);

    return (
        <Skeleton loading={load} active round paragraph={{ rows: 5 }}>
            <ProConfigProvider hashed={false}>
                <div style={{ backgroundColor: "white" }}>
                    <LoginForm
                        title="绑定系统帐号"
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
                                            alert(err);
                                            router.push("/");
                                        });
                                }) 
                                .catch((err) => {
                                    alert(err);
                                });
                        
                        }}
                    >
                        <ProFormText
                            name="username"
                            fieldProps={{
                                size: "large",
                                prefix: <UserOutlined className={"prefixIcon"} />,
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: "请输入用户名!",
                                },
                            ]}
                        />
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: "large",
                                prefix: <LockOutlined className={"prefixIcon"} />,
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: "请输入密码！",
                                },
                            ]}
                        />
                    </LoginForm>
                </div>
            </ProConfigProvider>
        </Skeleton>
    
    );
};

export default Feishu;