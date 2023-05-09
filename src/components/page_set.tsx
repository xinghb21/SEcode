import React, { useEffect, useState } from "react";
import { request } from "../utils/network";
import { Space, message } from "antd";
import { Typography } from "antd";

const { Title } = Typography;
const { Text, Link } = Typography;

type user = {
    identity: string;
    username: string;
    entity: string;
    department: string;
}
const Page_set = () => {
    const [username, setUN] = useState<string>();
    const [user, setU] = useState<user>();
    useEffect((() => {
        request("/api/user/username", "GET")
            .then((res) => {
                setUN(res.name);
            })
            .catch((err) => {
                message.warning(err.message);
            });
        if (username != undefined) {
            request("/api/user/home/" + username, "GET")
                .then((res) => {
                    if (res.identity == 1) {
                        setU({
                            identity: "超级系统管理员",
                            username: res.username,
                            entity: res.entity,
                            department: res.department
                        });
                    }
                    else if (res.identity == 2) {
                        setU({
                            identity: "业务系统管理员",
                            username: res.username,
                            entity: res.entity,
                            department: res.department
                        });
                    }
                    else if (res.identity == 3) {
                        setU({
                            identity: "业务资产管理员",
                            username: res.username,
                            entity: res.entity,
                            department: res.department
                        });
                    }
                    else {
                        setU({
                            identity: "员工",
                            username: res.username,
                            entity: res.entity,
                            department: res.department
                        });
                    }

                })
                .catch((err) => {
                    message.warning(err.message);
                });
        }
    }), [username]);
    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Title style={{ marginTop: 130 }}>{user?.username}</Title>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ marginRight: 40 }}>业务实体：{user?.entity == "" ? "暂无" : user?.entity}</Text>
                <Text>部门：{user?.department == "" ? "暂无" : user?.department}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ marginTop: 10 }}>职位：{user?.identity}</Text>
            </div>
        </>
    );
};

export default Page_set;