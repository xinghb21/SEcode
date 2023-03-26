import React, { useState } from 'react';
import { useRouter } from "next/router";
import { Form, Input, Button, Divider, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { request } from "../utils/network";
import {LOGIN_FAILURE, LOGIN_SUCCESS} from "../constants/string"
import md5 from "md5"

interface LoginFormProps {
    username: string,
    password: string,
}

const LoginForm = (props: LoginFormProps) => {
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = (values: any) => {
        setLoading(true);
        request(
            `/api/user/login`,
            "POST",
            {
                name: values.username,
                password: values.password
            }
        )
            .then(() => {
                router.push("/user")
            })
            .catch((err) => {
                alert(LOGIN_FAILURE + err);
                setLoading(false)
            })
    };

    return (
        <div>
        <div className="login-background" />
        <div className="login-box">
            <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)'}}>
                <h1 className="login-title">Login</h1>
                <Form onFinish={handleSubmit}
                name="basic"
                initialValues={{ remember: true }}>

                    <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                        <Input prefix={<UserOutlined />} placeholder="用户名"/>
                    </Form.Item>

                    <Space size={"large"} direction="vertical">
                         
                    <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                        <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block shape='round'>
                        登录
                        </Button>
                    </Form.Item>

                    </Space>
                    
                </Form>
                <Divider >Or</Divider>
                <Button block shape='round'>使用飞书登录</Button>
            </div>
        </div>
        </div>
    );
};

export default LoginForm;
