import React, { useState, useEffect } from "react";
import {
    HomeOutlined,
    DesktopOutlined,
    PieChartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Button, MenuProps, Skeleton, Space } from "antd";
import { useRouter } from "next/router";
import { Layout, Menu, theme } from "antd";
import { request } from "../../utils/network";
import Page_0 from "../../components/page_0";
import EStable from "../../components/page_1";
import Page_2 from "../../components/page_2";
import Page_3 from "../../components/page_3";
import Page_4 from "../../components/page_4";
import Page_5 from "../../components/page_5";
import Page_6 from "../../components/page_6";
import Page_7 from "../../components/page_7";
import Page_8 from "../../components/page_8";
import Page_home from "../../components/page_home";
import Page_set from "../../components/page_set";
import Page_info from "../../components/page_info";


const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}


const AppList: any[] = [
    "业务实体管理", "系统人员管理", "企业人员管理", "操作日志查询", "企业部门管理", "资产查询", "资产操作", "资产统计", "资产申请",
];

//xhb_begin
const PageList: any[] = [
    <div key={0}><Page_0 /></div>, <div key={1}><EStable /></div>, <div key={2}><Page_2 /></div>,
    <div key={3}><Page_3 /></div>, <div key={4}><Page_4 /></div>, <div key={5}><Page_5 /></div>,
    <div key={6}><Page_6 /></div>, <div key={7}><Page_7 /></div>, <div key={8}><Page_8 /></div>,
    <div key={9}><Page_home /></div>, <div key={10}><Page_set /></div>, <div key={11}><Page_info /></div>
];
//xhb_end

//这里的item应该从后端获取数据后形成？
const items: MenuItem[] = [];

const User: React.FC = () => {
    const router = useRouter();
    const query = router.query;
    let identity: number;
    const [collapsed, setCollapsed] = useState(false);
    const [load, setLoad] = useState(true);
    const [page, setPage] = useState(9);

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        fetchList();
    }, [router]);

    //通过后端获取的funlist以及用户对应的identity实现侧边栏应用
    //具体的key还需要完善
    const fetchList = () => {
        request(`/api/user/home/${localStorage.getItem("username")}`, "GET")
            .then((res) => {
                items.splice(0);
                let funclist = res.funclist.toString();
                identity = res.identity;
                items.push(getItem("业务首页", 9, <HomeOutlined />));
                if (identity == 1) {
                    const child: MenuItem[] = [];
                    for (let index = 0; index < 2; index++) {
                        const element = funclist[index];
                        if (element) {
                            child.push(getItem(AppList[index], index));
                        }
                    }
                    items.push(getItem("实体管理", "entity", <DesktopOutlined />, child));
                }
                else if (identity == 2) {
                    const child: MenuItem[] = [];
                    for (let index = 2; index < 5; index++) {
                        const element = funclist[index];
                        if (element) {
                            child.push(getItem(AppList[index], index));
                        }
                    }
                    items.push(getItem("企业管理", "corp", <HomeOutlined />, child));
                }
                else if (identity == 3) {
                    const child: MenuItem[] = [];
                    for (let index = 5; index < 8; index++) {
                        const element = funclist[index];
                        if (element) {
                            child.push(getItem(AppList[index], index));
                        }
                    }
                    items.push(getItem("资产管理", "asset", <PieChartOutlined />, child));
                }
                else {
                    if (funclist[8]) {
                        items.push(getItem("员工操作", "oper", <PieChartOutlined />, [
                            getItem("资产申请", "user"),
                        ]));
                    }
                    else items.push(getItem("员工操作", "oper", <PieChartOutlined />));
                }
                items.push(getItem("用户", "/User", <UserOutlined />, [
                    getItem("信息", 10),
                    getItem("设置", 11),
                    getItem("登出", "logout"),
                ]));
            })
            .catch((err) => {
                alert(err.message);
                router.push("/");
            });
    };

    useEffect(() => {
        setTimeout(() => {
            setLoad(false);
        }, 2000);
    }, []);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    //对于点击每个应用相应跳转
    const handleClick = (menuItem: any) => {
        if (menuItem.key != "logout")
            setPage(Number(menuItem.key));
        else {
            //实现登出
            request(
                "/api/user/logout",
                "POST",
                {
                    name: localStorage.getItem("username")
                }
            )
                .then(() => {
                    //感觉登出实现得很草率，需要完善
                    router.push("/");
                })
                .catch((err) => {
                    alert(err.message);
                });
            //感觉登出实现得很草率，需要完善
        }
    };


    return (
        <Skeleton loading={load} active round paragraph={{ rows: 5 }}>
            <Layout style={{ minHeight: "100vh" }}>
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <Menu theme="dark" mode="inline" items={items}
                        onClick={handleClick} />
                </Sider>
                <Layout className="site-layout">
                    <Content style={{ margin: "0 16px" }}>
                        <Space  style={{ margin: 5, display:"flex",justifyContent:"flex-end",alignItems:"center"}} >
                            <Button color="white" type="primary" style={{ margin: 2 }} block={true}>
                                Backlog
                            </Button>
                            <Button color="white" type="primary" style={{ margin: 2 }} block={true}>
                                Message
                            </Button>
                        </Space>
                        <div style={{ padding: 24, minHeight: 600, background: colorBgContainer }}>
                            {/* 实现系统管理员的增添删减 */}
                            {PageList[page]}
                            {/* 实现系统管理员的增添删减 */}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: "center" }}>Ant Design ©2023 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        </Skeleton>
    );
};

export default User;