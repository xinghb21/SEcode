import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Divider, Space, Modal, message, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { request } from "../../utils/network";
import { Md5 } from "ts-md5";
import { Url } from "url";
import Page_info from "../page_info";

interface app{
    key:React.Key;
    name:string;
    urlvalue:string;
}

const Applists=()=>{
    const [applists,setapplists]=useState<app[]>([]);
    useEffect((()=>{
        request("api/user/getapplists","GET")
            .then((res)=>{
                let tempapplist:app[]=[];
                let i=0;
                let size=res.info.length;
                for (i;i<size;i++){
                    tempapplist.push({key:res.info[i].name,name:res.info[i].name,urlvalue:res.info[i].urlvalue});
                }
                setapplists(tempapplist);
            })
            .catch((err)=>{
                message.warning(err.message);
            });
    }),[]);
    const gridStyle: React.CSSProperties = {
        width: "25%",
        textAlign: "center",
    };
    return (
        <div>
            {  (applists.length === 0)?
                (<p>暂无可用应用</p>)
                :
                (<Card>
                    {applists.map((val)=>{
                        return (
                            <a key={val.urlvalue} href={val.urlvalue}>
                                <Card.Grid key={val.key} style={gridStyle}  >{val.name}</Card.Grid>;
                            </a>
                        );
                    })}
                </Card>)        
            }
        </div>
    );
};

export default Applists;