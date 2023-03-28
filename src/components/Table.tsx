interface User{
    id:number;
    username:string;
    password:string;
    entity:string;
  }

interface UserTableProps {
    users: User[];
    width:number;
    height:number;
  }
  
const UserTable=(props: UserTableProps) =>{
    const style = {
        display: "flex",
        flexDirection: "column",
        width: `${props.width}px`,
        height: `${props.height}px`,
    };
    return (
        <table>
            <thead>
                <tr>
                    <th>用户名</th>
                    <th>密码</th>
                    <th>业务实体</th>
                </tr>
            </thead>
            <tbody>
                {props.users.map((user) => (
                    <tr key={user.username}>
                        <td>{user.username}</td>
                        <td>{user.password}</td>
                        <td>{user.entity}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
export default UserTable;