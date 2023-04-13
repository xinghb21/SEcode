import React, { useState } from "react";
import { Drawer, Space, Button, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
}
interface DataType {
    key: React.Key;
    name: string;
    assetClass: string,
    assetID: string,
    number: number,
    oper: number,
}
const columns: ColumnsType<DataType> = [
    {
        title: "申请人",
        dataIndex: "name",
    },
    {
        title: "请求",
        dataIndex: "oper",
        render: (text) => {
            if (text == 0) {
                return (<Tag color="blue">
                    资产领用
                </Tag>
                );
            }
            else {
                return (
                    <Tag color="volcano">
                        资产退库
                    </Tag>
                );
            }
        },
    },
    {
        title: "资产类别",
        dataIndex: "assetClass",
    },
    {
        title: "资产编号",
        dataIndex: "assetID",
    },
    {
        title: "资产总数量",
        dataIndex: "number",
    },
    {
        title: "操作",
        dataIndex: "assetID",
        render: () => (
            <Space size="middle">
                <Button danger={true}>
                    拒绝
                </Button>
                <Button type="primary">
                    同意
                </Button>
            </Space>
        ),
    }
];
const data = [{
    key: 1,
    name: "cjt",
    assetClass: "电脑",
    assetID: "1,2",
    number: 2,
    oper: 0,

}, {
    key: 2,
    name: "hqf",
    assetClass: "电脑",
    assetID: "3",
    number: 1,
    oper: 1,
}];

const TbdDrawer = (props: DrawerProps) => {
    return (
        <Drawer
            title="待办任务列表"
            width={"70%"}
            onClose={props.onClose}
            open={props.isOpen}
        >
            <Table columns={columns} dataSource={data} />
        </Drawer>
    );
};
export default TbdDrawer;
