import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Divider, Space, Modal, message, Card, Row, Col } from "antd";
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
    const [applistlist,setlistlist]=useState<app[][]>([]);
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
                let j=0;
                let r=size%4;
                let j4=(size-r)/4;
                console.log(j4);
                j4=(4*j4===size)?j4:(j4+1);
                let tempp:app[][]=[];
                i=0;
                console.log(j4);
                for(j;j<j4;j++){
                    let temp:app[]=[];
                    for(i=0;i<4;i++){
                        if(j*4+i < size){
                            temp.push(tempapplist[j*4+i]);
                        }
                    }
                    tempp.push(temp);
                }
                setlistlist(tempp);
                console.log(tempp);
            })
            .catch((err)=>{
                message.warning(err.message);
            });
    }),[]);
    const gridStyle: React.CSSProperties = {
        textAlign: "center",
        width:"100",
        height:"80"
    };
    return (
        <div>
            {  (applists.length === 0)?
                (<p>暂无可用应用</p>)
                :
                (<Col span={4} >
                    {applistlist.map((val,index)=>{
                        return (
                            <Row gutter={16} key={index}>
                                {
                                    val.map((value)=>{
                                        return(
                                            <a href={value.urlvalue} key={value.name}>
                                                <Card style={gridStyle} key={value.name}>{value.name}</Card>
                                            </a>
                                        );   
                                    })
                                }
                            </Row>
                        );
                    })}
                </Col>)        
            }
        </div>
    );
};

export default Applists;