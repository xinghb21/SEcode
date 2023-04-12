import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import AddAsset from "./addAsset";
import DelAsset from "./delAsset";
import AddType from "./addType";


const items: MenuProps["items"] = [
    {
        label: "添加资产",
        key: 0,
    },
    {
        label: "删除资产",
        key: 1,
    },
    {
        label: "添加资产属性",
        key: 2,
    },
];

const PageList: any[] = [
    <div key={0}> <AddAsset /></div>, <div key={1}><DelAsset /></div>, <div key={2}><AddType /></div>,
];

const App: React.FC = () => {

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

export default App;