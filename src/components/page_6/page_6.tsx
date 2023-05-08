import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import AddAsset from "./addAsset";
import DelAsset from "./delAsset";
import ClearAsset from "./clearAsset";
import MatainAssets from "./matianAsset"

const items: MenuProps["items"] = [
    {
        label: "资产录入",
        key: 0,
    },
    {
        label: "资产变更",
        key: 1,
    },
    {
        label: "资产清退",
        key: 2,
    },
    {
        label:"资产维保",
        key:3,
    }
];

const PageList: any[] = [
    <div key={0}> <AddAsset /></div>, <div key={1}><DelAsset /></div>, <div key={2}><ClearAsset/></div>, <div key={3}><MatainAssets/></div>
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