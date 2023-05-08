import React, { useState } from "react";
import { useEffect } from "react";
import type { MenuProps } from "antd";
import { Button, Input, Menu, Space, Tag, message, Table, List, Modal } from 'antd';
import { request } from "../../utils/network";
import { ProList } from "@ant-design/pro-components";
import { time } from "console";

interface Asset{
    id:number,
    name:string,
    state:number,
}
interface Assetsimple{
    id:number,
    name:string,
}

interface Apply{
    id:number,
    assets:Assetsimple[],
}

const MatainAssets = ()=>{
    const [applylist,setapplylist]=useState<Apply[]>([]);
    const [applyid,setapplyid] = useState<number>(-1);
    const [nowassetslist,setnowassetslist] = useState<Asset[]>([]);
    const fetchapplylist=()=>{
        request('/api/user/ep/getallmatain',"GET")
        .then((res)=>{
            setapplylist(res.info);
        })
        .catch((err)=>{
            message.warning(err.message);
        })
    }
    const fetchassetlist=(id:number)=>{
        let newsassets = applylist.find((obj)=>{return obj.id==id})?.assets.map((val)=>{return {id:val.id,name:val.name,state:2}});
        if(newsassets){
            setnowassetslist(newsassets);
            setapplyid(id);
        }else{
            setnowassetslist([]);
            setapplyid(-1);
        }
    }
    useEffect((()=>{
        fetchapplylist();
    }),[])
    const handlesubmit=()=>{
        let size = nowassetslist.length;
        for(let i=0;i<size;i++){
            if((nowassetslist[i].state!==0)&&(nowassetslist[i].state!==1)){
                message.warning("有资产的状态没有更新");
                return;
            }
        }
        request('/api/user/ep/matianover',"POST",{id:applyid,assets:nowassetslist})
        .then((res)=>{
            fetchapplylist();
            setnowassetslist([]);
            setapplyid(-1);
            message.success("处理成功");
        })
        .catch((err)=>{
            message.warning(err.message);
        });
    }
    return (
        <div style={{display:"flex",flexDirection:"row",width:"100%",height:"100%"}} >
            <div style={{ width: "40%" , marginRight: 20, padding: 10, borderRadius: 10, minWidth: "30%", maxWidth: "50%", height: "100%" }} >
                <List
                    pagination={{
                    pageSize: 10,
                    }}
                    dataSource={applylist}
                    renderItem={(item) => (
                    <List.Item
                        
                        key={item.id}
                        extra={
                        <Button onClick={()=>{fetchassetlist(item.id)}}> 处理 </Button>
                        }
                    >
                        <List.Item.Meta
                        title={<p>{item.id}</p>}
                        description={<p>此维保申请的id为{item.id}</p>}
                        />
                    </List.Item>
                    )}
                />
            </div>
            <div style={{ width: "40%" , marginRight: 20, padding: 10, borderRadius: 10, minWidth: "30%", maxWidth: "50%", height: "100%" }} >
                <List
                    pagination={{
                    pageSize: 10,
                    }}
                    footer = {
                        <Button onClick={handlesubmit} > 完成 </Button>
                    }
                    dataSource={nowassetslist}
                    renderItem={(item,index) => (
                    <List.Item
                        key={item.id}
                        extra={
                            <div>   
                                <Button key={1} onClick={()=>{let assetlist = nowassetslist;assetlist[index].state=1;setnowassetslist(assetlist)}} color = { item.state==1?"yellow":"white"} >  {"维保成功"} </Button>
                                <Button key={0} onClick={()=>{let assetlist = nowassetslist;assetlist[index].state=0;setnowassetslist(assetlist)}} color = {item.state==0?"red":"white"} > {"维保失败"}    </Button>
                            </div>
                        }
                    >
                        <List.Item.Meta
                            title={<p>{item.name}</p>}
                            description={<p>此资产的id为{item.id}</p>}
                        />
                    </List.Item>
                    )}
                   />
            </div>
        </div>
    );
}


export default MatainAssets;