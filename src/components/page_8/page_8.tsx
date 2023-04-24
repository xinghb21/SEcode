import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import Applyasset from "./Applyasset";
import Returnasset from "./Returnasset";

const items: MenuProps["items"] = [
    {
        label: "资产领用",
        key: 0,
    },
    {
        label: "资产退库",
        key: 1,
    },
];

const PageList: any[] = [
    <div key={0}> <Applyasset /></div>, <div key={1}><Returnasset /></div>, 
];

const Page_8:React.FC = () => {

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

export default Page_8;