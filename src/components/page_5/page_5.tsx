import React, { useState } from "react";
import { Menu, MenuProps, Typography } from "antd";
import {
    BarsOutlined
} from "@ant-design/icons";
import ACtree from "./assetClassTree";
import AddType from "../page_6/addType";
import Label from "./label";

const items: MenuProps["items"] = [
    {
        label: "类别定义",
        key: 0,
    },
    {
        label: "属性定义",
        key: 1,
    },
    {
        label: "标签定义",
        key: 2,
    },
];

const PageList: any[] = [
     <div key={0}><ACtree /></div>,<div key={1}><AddType /></div>,<div key={2}> <Label/></div>
];

const Page_5 = () => {

    const [current, setCurrent] = useState("0");
    const [page, setPage] = useState(0);

    const onClick: MenuProps["onClick"] = (e) => {
        setCurrent(e.key);
        setPage(Number(e.key));
    };

    return( 
        <>
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            <div style={{ paddingLeft: 10, paddingRight: 24, paddingTop: 15, paddingBottom: 5, minHeight: 600}}>
                {PageList[page]}
            </div>
        </>
    );
};

export default Page_5;