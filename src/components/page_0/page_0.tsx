import { useRouter } from "next/router";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import Entitylist from "./entitylist";
interface Entity {
    key: React.Key;
    id: number;
    name: string;
    admin: string;
}
const columns: ColumnsType<Entity> = [
    {
        title: "entityname",
        dataIndex: "name",
    },
    {
        title: "adminname",
        dataIndex: "admin",
    },
];
interface EntityTableProps{
    entities:Entity[];
}

const Page_0 = () => {

    const [entity, setEntity] = useState<Entity[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const deleteentities =()=>{

    };
    const router = useRouter();
    const query = router.query;

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        fetchList();
    }, [router, query]);

    const fetchList = () => {
    };

    return (
        <>
            <Entitylist></Entitylist>
        </>
    );
};

export default Page_0;
