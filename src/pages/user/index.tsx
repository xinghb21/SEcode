import React, { useState, useEffect, useRef } from "react";
import {
    HomeOutlined,
    UserOutlined,
    AppstoreAddOutlined,
    DollarCircleOutlined,
    AreaChartOutlined,
    ControlOutlined,
    TeamOutlined,
    DeploymentUnitOutlined,
    FileSearchOutlined,
    ForkOutlined,
    ShareAltOutlined,
    SearchOutlined,
    AuditOutlined,
    InteractionOutlined,
    ToolOutlined,
    ExceptionOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { MenuProps, Skeleton, Space, Avatar, message } from "antd";
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
import Applists from "../../components/applists/Applist";
import MenuItem from "antd/es/menu/MenuItem";
import TbdDrawer from "./tbd";
import { Typography } from "antd";
import Ep_Message from "./ep_mg";
import NSTbdDrawer from "./ns_tbd";
import Asyncbd from "./asyncdeal/async";
import Tasklist from "../../components/page_9/Tasklist";
import Applyasset from "../../components/page_8/Applyasset";
import Lookup from "../../components/page_8/assetslookup/Lookup";
import Mentainasset from "../../components/page_8/assetsmentain/Mentain";
import Returnasset from "../../components/page_8/assetsreturn/Returnasset";
import Exchangeasset from "../../components/page_8/exchange/Exchangeasset";
import ReactCanvasNest from "react-canvas-nest"; 
import Head from "next/head";
import Head from "next/head";

const { Text } = Typography;

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

interface app{
    key:React.Key;
    name:string;
    urlvalue:string;
}
const AppList: any[] = [
    "系统人员管理", "业务实体管理", "企业人员管理", "操作日志查询", "企业部门管理", "资产定义", "资产管理", "资产分析", "资产申请", "应用列表","异步任务管理"
];


//这里的item从后端获取数据后形成
const items: MenuItem[] = [];

const User: React.FC = () => {
    const router = useRouter();
    const query = router.query;


    const [collapsed, setCollapsed] = useState(false);
    const [load, setLoad] = useState(true);
    const [page, setPage] = useState(9);
    const [name, setName] = useState("");
    const [applist,setapplist] =useState<app[]>([]);

    const [identity, setID] = useState<number>(4);


    useEffect(() => {
        if (!router.isReady) {
            console.log("router isn't ready");
            return;
        }
        request("/api/user/username", "GET")
            .then((res) => {
                setName(res.name);
                fetchList(res.name);
            }).catch((err) => {
                message.error(err.message);
                router.push("/");
            });
    }, [router]);

    const onChange = (key: number) => {
        setPage(key);
    };

    const PageList: any[] = [
        <div key={0}><Page_0 /></div>, <div key={1}><EStable /></div>, <div key={2}><Page_2 /></div>,
        <div key={3}><Page_3 /></div>, <div key={4}><Page_4 /></div>, <div key={5}><Page_5 /></div>,
        <div key={6}><App /></div>, <div key={7}><Page_7 /></div>, <div key={8}><Page_8 /></div>,
        <div key={9}><Page_home onChange={onChange}/></div>, <div key={10}><Page_set /></div>, 
        <div key={11}><Page_info /></div>, <div key={12}><Applists /> </div>,<div key={13}><Tasklist/></div>,
        <div key={14}><Lookup/></div>,<div key={15}> <Applyasset /></div>, <div key={16}><Exchangeasset/></div>,<div key={17}><Mentainasset/></div>,<div key={18}><Returnasset /></div> 
    ];

    //通过后端获取的funlist以及用户对应的identity实现侧边栏应用
    //具体的key还需要完善
    const fetchList = (name: string) => {

        request(`/api/user/home/${name}`, "GET")
            .then((res) => {
                items.splice(0);
                let funclist = res.funclist.toString();
                if (res.entity != "") {
                    localStorage.setItem("entity", res.entity);
                }
                if (res.department != "") {
                    localStorage.setItem("department", res.department);
                }
                setID(res.identity);
                items.push(getItem("首页", 9, <HomeOutlined />));
                if (res.identity === 1) {
                }
                else {
                    localStorage.setItem("entityname", res.entity);
                }
                if (res.identity === 1) {
                    const child: MenuItem[] = [];
                    for (let index = 0; index < 2; index++) {
                        const element = funclist[index];
                        if (element) {
                            child.push(getItem(AppList[index], index));
                        }
                    }
                    // items.push(getItem(AppList[0], 0, <ShareAltOutlined />));
                    items.push(getItem(AppList[1], 1, <TeamOutlined />));
                    items.push(getItem("登出", "logout", <LogoutOutlined />));

                }
                else if (res.identity === 2) {
                    items.push(getItem(AppList[4], 4, <TeamOutlined />));
                    items.push(getItem(AppList[2], 2, <DeploymentUnitOutlined />));
                    items.push(getItem(AppList[3], 3, <FileSearchOutlined />));
                    items.push(getItem(AppList[10],13, <ForkOutlined />));
                    items.push(getItem("登出", "logout", <LogoutOutlined />));
                }
                else if (res.identity === 3) {
                    items.push(getItem(AppList[5], 5, <DollarCircleOutlined />));
                    items.push(getItem(AppList[6], 6, <ControlOutlined />));
                    items.push(getItem(AppList[7], 7, <AreaChartOutlined />));
                    let appsingle: MenuItem[] = [];
                    request("api/user/getapplists","GET")
                        .then((res)=>{
                            let tempapplist:app[]=[];
                            let i=0;
                            let size=res.info.length;
                            for (i;i<size;i++){
                                tempapplist.push({key:res.info[i].name,name:res.info[i].name,urlvalue:res.info[i].urlvalue});
                                appsingle.push(getItem(tempapplist[i].name,"url"+tempapplist[i].urlvalue));    
                            }
                            setapplist(tempapplist);
                            items.push(getItem("应用列表", "apps", <AppstoreAddOutlined />, appsingle));
                            items.push(getItem("登出", "logout", <LogoutOutlined />));
                        })
                        .catch((err)=>{
                            message.warning(err.message);
                            items.push(getItem("登出", "logout", <LogoutOutlined />));
                        });
                }
                else {
                    items.push(getItem("资产查看", 14, <SearchOutlined />));
                    items.push(getItem("资产领用", 15, <AuditOutlined />));
                    items.push(getItem("资产转移", 16, <InteractionOutlined />));
                    items.push(getItem("资产维保", 17, <ToolOutlined />));
                    items.push(getItem("资产退库", 18, <ExceptionOutlined />));
                    let appsingle: MenuItem[] = [];
                    request("api/user/getapplists","GET")
                        .then((res)=>{
                            let tempapplist:app[]=[];
                            let i=0;
                            let size=res.info.length;
                            for (i;i<size;i++){
                                tempapplist.push({key:res.info[i].name,name:res.info[i].name,urlvalue:res.info[i].urlvalue});
                                appsingle.push(getItem(tempapplist[i].name,"url"+tempapplist[i].urlvalue));    
                            }
                            setapplist(tempapplist);
                            items.push(getItem("应用列表", "apps", <AppstoreAddOutlined />, appsingle));
                            items.push(getItem("登出", "logout", <LogoutOutlined />));

                        })
                        .catch((err)=>{
                            message.warning(err.message);
                            items.push(getItem("登出", "logout", <LogoutOutlined />));
                        });
                }
            })
            .catch((err) => {
                message.warning(err.message);
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
        if (menuItem.key != "logout"){
            console.log(typeof menuItem.key);
            if((typeof menuItem.key) === "number"  ){
                setPage(Number(menuItem.key));
            }else{
                if((typeof menuItem.key) === "string"){
                    if((menuItem.key as string).startsWith("url")){
                        const w = window.open("_black"); //这里是打开新窗口
                        let url = (menuItem.key as string).substring(3,(menuItem.key as string).length);
                        if(w){
                            w.location.href=url;
                        }else{
                            message.warning("url有误");
                        }
                    }else{
                        setPage(Number(menuItem.key));
                    }
                }else{
                    setPage(Number(menuItem.key));
                }
            }
        }
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
                    message.warning(err.message);
                });
        }
    };
    if (identity === 3 || identity == 4) {
        return (
            <>
                <Head>
                    <title>Aplus</title>
                </Head>
                <Skeleton loading={load} active round paragraph={{ rows: 5 }}>
                    <Layout style={{ minHeight: "100vh" }}>
                        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{zIndex: 2}}>
                            <Menu theme="dark" mode="inline" items={items} 
                                onClick={handleClick} />
                        </Sider>
                        <div style={{width: "100%"}}>
                            <Layout className="site-layout">
                                <Content style={{ margin: "0 16px", zIndex: 2, opacity: 0.85 }}>
                                    <Space style={{ margin: 5, display: "flex", justifyContent: "flex-end", alignItems: "center" }} >
                                        
                                        {identity == 3 ? <><Ep_Message /><TbdDrawer /><Asyncbd/></> : <NSTbdDrawer />}
                                        
                                        <Space align="center">
                                            <Avatar icon={<UserOutlined />} />
                                            <Text strong>
                                                {name}
                                            </Text>
                                        </Space>
                                    </Space>
                                    <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 5, paddingBottom: 5, height:"100%", background: colorBgContainer, borderRadius: 10}}>
                                        {PageList[page]}
                                    </div>
                                </Content>
                            </Layout>
                            <Footer style={{zIndex: 0, textAlign: "center" }}>EAM ©2023 Created by Aplus </Footer>
                        </div>
                        <ReactCanvasNest
                            className='canvasNest'
                            config={{
                                pointColor: "38, 138, 255",
                                lineColor: "22, 44, 154",
                                lineWidth: 2,
                                pointR: 1.5
                            }}
                            style={{ zIndex: 1, height: "100%", width: "100%"}}
                        />     
                    </Layout>
                </Skeleton>
            </>
        );
    }
    else {
        if(identity==2){
            return (
                <>
                    <Head>
                        <title>Aplus</title>
                    </Head>
                    <Skeleton loading={load} active round paragraph={{ rows: 5 }}>
                        <Layout style={{ minHeight: "100vh" }}>
                            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{zIndex: 2}}>
                                <Menu theme="dark" mode="inline" items={items} 
                                    onClick={handleClick} />
                            </Sider>
                            <div style={{width: "100%"}}>
                                <Layout className="site-layout">
                                    <Content style={{ margin: "0 16px", zIndex: 2, opacity: 0.85 }}>
                                        <Space style={{ margin: 5, display: "flex", justifyContent: "flex-end", alignItems: "center" }} >
                                        
                                            <Asyncbd/>
                                        
                                            <Space align="center">
                                                <Avatar icon={<UserOutlined />} />
                                                <Text strong>
                                                    {name}
                                                </Text>
                                            </Space>
                                        </Space>
                                        <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 5, paddingBottom: 5, height:"100%", background: colorBgContainer, borderRadius: 10}}>
                                            {PageList[page]}
                                        </div>
                                    </Content>
                                </Layout>
                                <Footer style={{zIndex: 0, textAlign: "center" }}>EAM ©2023 Created by Aplus </Footer>
                            </div>
                            <ReactCanvasNest
                                className='canvasNest'
                                config={{
                                    pointColor: "38, 138, 255",
                                    lineColor: "22, 44, 154",
                                    lineWidth: 2,
                                    pointR: 1.5
                                }}
                                style={{ zIndex: 1, height: "100%", width: "100%"}}
                            />     
                        </Layout>
                    </Skeleton>
                </>
            );
        }
        return (
            <>
                <Head>
                    <title>Aplus</title>
                </Head>
                <Skeleton loading={load} active round paragraph={{ rows: 5 }}>
                    <Layout style={{ minHeight: "100vh" }}>
                        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{zIndex: 2}}>
                            <Menu theme="dark" mode="inline" items={items} 
                                onClick={handleClick} />
                        </Sider>
                        <div style={{width: "100%"}}>
                            <Layout className="site-layout">
                                <Content style={{ margin: "0 16px", zIndex: 2, opacity: 0.85 }}>
                                    <Space style={{ margin: 5, display: "flex", justifyContent: "flex-end", alignItems: "center" }} >
                                        <Space align="center">
                                            <Avatar icon={<UserOutlined />} />
                                            <Text strong>
                                                {name}
                                            </Text>
                                        </Space>
                                    </Space>
                                    <div style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 5, paddingBottom: 5, height:"100%", background: colorBgContainer, borderRadius: 10}}>
                                        {PageList[page]}
                                    </div>
                                </Content>
                            </Layout>
                            <Footer style={{zIndex: 0, textAlign: "center" }}>EAM ©2023 Created by Aplus </Footer>
                        </div>
                        <ReactCanvasNest
                            className='canvasNest'
                            config={{
                                pointColor: "38, 138, 255",
                                lineColor: "22, 44, 154",
                                lineWidth: 2,
                                pointR: 1.5
                            }}
                            style={{ zIndex: 1, height: "100%", width: "100%"}}
                        />     
                    </Layout>
                </Skeleton>
            </>
            
        );
    }

};

export default User;
