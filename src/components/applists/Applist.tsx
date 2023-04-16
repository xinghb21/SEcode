import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Divider, Space, Modal, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { request } from "../../utils/network";
import { Md5 } from "ts-md5";
import { Url } from "url";
import Page_info from '../page_info';

interface app{
    key:React.Key;
    name:string;
    urlvalue:Url;
}

const Applists=()=>{
    const [applists,setapplists]=useState<app[]>([]);
    useEffect((()=>{
        request(`api/user/getapplists`,"GET")
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
    return (
        <div>
            
        </div>        
    );
}

export default Applists;