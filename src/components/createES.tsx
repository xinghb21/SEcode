import { useState } from "react";
import { Button } from 'antd';

interface User{
    id:number;
    username:string;
    password:string;
    entity:string;
  }

interface DialogProps{
    isOpen: boolean;
    onClose: () => void;
    onCreateUser: (user: User) => void;
  }

const CreateES=(props: DialogProps) =>{
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [entity, setEntity] = useState("");

  const handleCreateUser = () => {
    const user: User = {
      id: Date.now(),
      username,
      password,
      entity,
    };
    props.onCreateUser(user);
    setUsername("");
    setPassword("");
  };

  return (
    <div style={{ display: props.isOpen ? "block" : "none" }}>
      <div>
        <label>用户名:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>密码:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>所属业务实体:</label>
        <input type="entity" value={entity} onChange={(e) => setEntity(e.target.value)} />
      </div>
      <Button onClick={handleCreateUser}>创建</Button>
      <Button onClick={props.onClose}>取消</Button>
    </div>
  );
}
export default CreateES;
