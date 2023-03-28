import { useState } from "react";
import CreateES from "./createES";
import UserTable from "./Table";
import React from "react";
import { Button } from "antd";

interface User{
  id:number;
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
        <>
            <Button onClick={() => setIsDialogOpen(true)}>创建企业系统管理员</Button>
            <UserTable users={users} width={100} height={100}/>
            <CreateES isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onCreateUser={handleCreateUser} />
        </>
    );
};
export default EStable;