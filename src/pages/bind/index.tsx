// cyh
// 用来绑定飞书用户的页面
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import SITE_CONFIG from "../../settings";
import { request } from "../../utils/network";
import { Skeleton, Spin, message } from "antd";

const Feishu = () => {

    const router = useRouter();
    const query = router.query;
    const [load, setLoad] = useState(true);

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        let url = "/api/feishu/bind?code=" + query.code + "&redirect=" + SITE_CONFIG.BACKEND + "/bind";
        request(url, "POST")
            .then((res) => {
                router.push("/user");
                setLoad(false);
            })
            .catch((err) => {
                message.warning(err.message);
                router.push("/user");
            });
        setTimeout(() => {
            setLoad(false);
        }, 2000);
    }, [router, query]);

    return (
        <Spin tip="Loading..."></Spin>
    );
};

export default Feishu;
