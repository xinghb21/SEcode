import React, { useState, useEffect } from "react";
import {
    HomeOutlined,
    DesktopOutlined,
    PieChartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Button, MenuProps, Skeleton, Space, Avatar } from "antd";
import { useRouter } from "next/router";
import { Layout, Menu, theme } from "antd";
import { request } from "../../utils/network";
import Page_0 from "../../components/page_0/page_0";
import EStable from "../../components/page_1/page_1";
import Page_2 from "../../components/page_2/page_2";
import Page_3 from "../../components/page_3/page_3";
import Page_4 from "../../components/page_4/page_4";
import Page_5 from "../../components/page_5/page_5";
import App from "../../components/page_6/page_6";
import Page_7 from "../../components/page_7/page_7";
import Page_8 from "../../components/page_8/page_8";
import Page_home from "../../components/page_home/page_home";
import Page_set from "../../components/page_set";
import Page_info from "../../components/page_info";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";


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
    "业务实体管理", "系统人员管理", "企业人员管理", "操作日志查询", "企业部门管理", "资产查看", "资产修改", "资产标签" , "资产申请",
];

//xhb_begin
const PageList: any[] = [
    <div key={0}><Page_0 /></div>, <div key={1}><EStable /></div>, <div key={2}><Page_2 /></div>,
    <div key={3}><Page_3 /></div>, <div key={4}><Page_4 /></div>, <div key={5}><Page_5/></div>,
    <div key={6}><App /></div>, <div key={7}><Page_7 /></div>, <div key={8}><Page_8 /></div>, 
    <div key={9}><Page_home /></div>,<div key={10}><Page_info /></div>, <div key={11}><Page_set /></div>
];
//xhb_end

//这里的item应该从后端获取数据后形成？
const items: MenuItem[] = [];
const dropitems: ItemType[] = [];

const User: React.FC = () => {
    const router = useRouter();
    let identity: number;

    const [collapsed, setCollapsed] = useState(false);
    const [load, setLoad] = useState(true);
    const [page, setPage] = useState(9);
    const [name, setName] = useState("");
    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        fetchList();
        request("/api/user/username", "GET")
            .then((res) => {
                setName(res.name);
            });
    }, [router]);

    //通过后端获取的funlist以及用户对应的identity实现侧边栏应用
    //具体的key还需要完善
    const fetchList = () => {
        
        request(`/api/user/home/${localStorage.getItem('username')}`, "GET")
            .then((res) => {
                items.splice(0);
                let funclist = res.funclist.toString();
                if (res.entity != "0") {
                    localStorage.setItem("entity", res.entity);
                }
                identity = res.identity;
                items.push(getItem("业务首页", 9, <HomeOutlined />));
                if(identity===1){
                }else{
                    localStorage.setItem("entityname",res.entity);
                }
                if (identity === 1) {
                    const child: MenuItem[] = [];
                    for (let index = 0; index < 2; index++) {
                        const element = funclist[index];
                        if (element) {
                            child.push(getItem(AppList[index], index));
                        }
                    }
                    items.push(getItem("实体管理", "entity", <DesktopOutlined />, child));
                }
                else if (identity === 2) {
                    const child: MenuItem[] = [];
                    for (let index = 2; index < 5; index++) {
                        const element = funclist[index];
                        if (element) {
                            child.push(getItem(AppList[index], index));
                        }
                    }
                    items.push(getItem("企业管理", "corp", <HomeOutlined />, child));
                }
                else if (identity === 3) {
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
                alert(err);
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
                    router.push("/");
                })
                .catch((err) => {
                    alert(err.message);
                });
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
                        <Space style={{ margin: 5, display: "flex", justifyContent: "flex-end", alignItems: "center" }} >
                            <Button style={{ margin: 2 }} block={true}>
                                Backlog
                            </Button>
                            <Button style={{ margin: 2 }} block={true}>
                                Message
                            </Button>
                            <Space>
                                <Avatar size="small" icon={<UserOutlined />} />
                                <text fontWeight='bold'>
                                    {name}
                                </text>
                            </Space>
                        </Space>
                        <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 5, paddingBottom: 5, minHeight: 600, background: colorBgContainer }}>
                            {PageList[page]}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: "center" }}>EAM ©2023 Created by Aplus </Footer>
                </Layout>
            </Layout>
        </Skeleton>
    );
};

export default User;