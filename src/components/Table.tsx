import { Button, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useState } from "react";

interface User{
    key: React.Key;
    username:string;
    password:string;
    entity:string;
  }

const columns: ColumnsType<User> = [
    {
        title: "Username",
        dataIndex: "username",
    },
    {
        title: "Password",
        dataIndex: "password",
    },
    {
        title: "Entity",
        dataIndex: "entity",
    },
];

interface UserTableProps {
    users: User[];
}

  
const UserTable=(props: UserTableProps) =>{

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);

    const start = () => {
        setLoading(true);
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };
    
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    
    return (
        <div>
            <div style={{ marginBottom: 16}}>
                <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading} style={{marginLeft : 1300}}>
              Reload
                </Button>
            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={props.users} />
        </div>
    );
};
    
export default UserTable;