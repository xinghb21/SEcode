import React, { useState, useEffect } from "react";
import {
    HomeOutlined,
    DesktopOutlined,
    PieChartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { MenuProps, Skeleton } from "antd";
import { useRouter } from "next/router";
import { Breadcrumb, Layout, Menu, theme, Input } from "antd";
import { request } from "../../utils/network";
import EStable from "../../components/EStable";


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

const { Search } = Input;

const AppList: any[] = [
    "业务实体管理", "系统人员管理", "企业人员管理", "操作日志查询", "企业部门管理", "资产查询", "资产操作", "资产统计", "资产申请",
];

//这里的item应该从后端获取数据后形成？
const items: MenuItem[] = [
    // getItem("业务首页", "user/home", <HomeOutlined />),
    // getItem("企业管理", "/cor", <DesktopOutlined />, [
    //     getItem("业务实体管理", "user/cor/entity"),
    //     getItem("系统人员管理", "user/asset/crew"),
    // ]),
    // getItem("资产管理", "/asset", <PieChartOutlined />, [
    //     getItem("资产查询", "user/asset/query"),
    //     getItem("资产操作", "user/asset/op"),
    //     getItem("资产统计", "user/asset/stata"),
    // ]),
    // getItem("用户", "/User", <UserOutlined />, [
    //     getItem("信息", "user/User/info"),
    //     getItem("设置", "user/User/set"),
    //     getItem("登出", "logout"),
    // ]),
    //这里的item应该从后端获取数据后形成？
];


const User: React.FC = () => {
    const router = useRouter();
    const query = router.query;
    let name: string = "";
    let identity:number;

    const [collapsed, setCollapsed] = useState(false);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        if (query.username?.toString()) {
            name = query.username?.toString();
        }
        fetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, query]);

    //通过后端获取的funlist以及用户对应的identity实现侧边栏应用
    //具体的key还需要完善
    const fetchList = () => {
        request(`/api/user/${name}`, "GET")
            .then((res) => {
                let funclist=res.funclist.toString()
                identity=res.indentity;
                items.push(getItem("业务首页", "user/home", <HomeOutlined />));
                if(identity==1){
                    const child:MenuItem[]=[];
                    for (let index = 0; index < 2; index++) {
                        const element = funclist[index];
                        if(element){
                            child.push(getItem(AppList[index],"user"));
                        }
                    }
                    items.push(getItem("实体管理", "user/entity", <DesktopOutlined />,child));
                }
                else if(identity==2){
                    const child:MenuItem[]=[];
                    for (let index = 2; index < 5; index++) {
                        const element = funclist[index];
                        if(element){
                            child.push(getItem(AppList[index],"user"));
                        }
                    }
                    items.push(getItem("企业管理", "user/corp", <HomeOutlined />,child));
                }
                else if(identity==3){
                    const child:MenuItem[]=[];
                    for (let index = 5; index < 8; index++) {
                        const element = funclist[index];
                        if(element){
                            child.push(getItem(AppList[index],"user"));
                        }
                    }
                    items.push(getItem("资产管理", "user/asset", <PieChartOutlined />,child));
                }
                else{
                    if(funclist[8]){
                        items.push(getItem("员工操作", "user/oper", <PieChartOutlined />,[
                            getItem("资产申请","user"),
                        ]));
                    }
                    else items.push(getItem("员工操作", "user/oper", <PieChartOutlined />));
                }
                items.push(getItem("用户", "/User", <UserOutlined />,[
                        getItem("信息", "user/User/info"),
                        getItem("设置", "user/User/set"),
                        getItem("登出", "logout"),
                    ]));
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    useEffect(() => {
        setTimeout(() => {
            setLoad(false);
        }, 1500);
    }, []);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    //对于点击每个应用相应跳转
    const handleClick = (menuItem: any) => {
        if (menuItem.key != "logout") {
            router.push(menuItem.key);
        }
        else {
            //实现登出
            request(
                "/api/user/logout",
                "POST",
                {
                    name: name
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

    //搜索栏还未实现
    const onSearch = (value: string) => {
    };
    //搜索栏还未实现

    return (
        <Skeleton loading={load} active round paragraph={{ rows: 5 }}>
            <Layout style={{ minHeight: "100vh" }}>
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16 }}>
                        <Search placeholder="请输入查询内容" onSearch={onSearch} enterButton />
                    </div>
                    <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items}
                        onClick={handleClick} />
                </Sider>
                <Layout className="site-layout">
                    <Content style={{ margin: "0 16px" }}>
                        <Breadcrumb style={{ margin: "16px 0" }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>Aplus</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, minHeight: 600, background: colorBgContainer }}>
                            {/* 实现系统管理员的增添删减 */}
                            <EStable />
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