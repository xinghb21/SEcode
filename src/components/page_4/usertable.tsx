import React from "react";
import { useState } from "react";
import { Table } from "antd";
import { useEffect } from "react";
import { request } from "../../utils/network";
import type { ColumnsType } from "antd/es/table";

type Depuser = {
    key: React.Key;
    username: string;
    department: string;
    identity: string;
}
type Props = {
    departs: String[];
};
const columns: ColumnsType<Depuser> = [
    {
        title: "用户名",
        dataIndex: "username",
    },
    {
        title: "部门",
        dataIndex: "department",
    },
    {
        title: "职位",
        dataIndex: "identity",
    }

];

const DUserTable = (({ departs }: Props) => {
    const [Depusers, setUser] = useState<Depuser[]>([]);
    useEffect((() => {
        request("/api/user/es/checkall", "GET")
            .then((res) => {
                setUser(res.data.map((val) => ({
                    key: val.username,
                    username: val.username,
                    department: val.department,
                    identity: (val.identity==3)?"资产管理员":"员工"
                })));
                let newUser: Depuser[] = [];
                let len = res.length;
                for (let index = 0; index < len; index++) {
                    if (departs.includes(Depusers[index].department)) {
                        newUser.push(Depusers[index]);
                    }
                }
                setUser(newUser);
            })
            .catch((err) => {
                alert(err);
            });
    }), []);
    return (
        <div >
             <Table columns={columns} dataSource={Depusers} style={{marginLeft:20, minHeight:500,minWidth:600}}/>
        </div>
    );
}
);

export default DUserTable;
