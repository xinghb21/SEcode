import { Button , Table} from "antd";
import { useRouter } from "next/router";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";

interface Entity {
    key: React.Key;
    id: number;
    name: string;
    admin: number;
}

const Page_0 = () => {

    const [entity, setEntity] = useState<Entity[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
            <Button onClick={() => setIsDialogOpen(true)} type="primary">创建业务实体</Button>
        </>
    );
};

export default Page_0;
