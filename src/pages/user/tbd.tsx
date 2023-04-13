import React, { useState } from "react";
import { Drawer, Space, Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
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
];
const data = [];

const TbdDrawer = (props: DrawerProps) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);
    const start = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log("selectedRowKeys changed: ", newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <Drawer
            title="待办任务列表"
            width={"70%"}
            onClose={props.onClose}
            open={props.isOpen}
            extra={
                <Space>
                    <Button danger={true} onClick={props.onReject} style={{ marginRight: 6 }}>
                        拒绝
                    </Button>
                    <Button type="primary" onClick={props.onApprove}>
                        同意
                    </Button>
                </Space>
            }
        >
            <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
        </Drawer>
    );
};
export default TbdDrawer;
