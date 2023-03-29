import { useState } from "react";
import CreateES from "./createES";
import UserTable from "./Table";
import React from "react";
import { Button } from "antd";

interface User{
    key: React.Key;
    username:string;
    password:string;
    entity:string;
}

const EStable=()=> {
    const [users, setUsers] = useState<User[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreateUser = (user: User) => {
        setUsers([...users, user]);
        setIsDialogOpen(false);
    };

    return (
        <div key={1}>
            <Button onClick={() => setIsDialogOpen(true)} type="primary">创建企业系统管理员</Button>
            <UserTable users={users}/>
            <CreateES isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onCreateUser={handleCreateUser} />
        </div>
    );
};
export default EStable;