import { useState } from "react";
import { Modal, Input, List, Skeleton, Avatar, message } from "antd";
import React from "react";
import {useEffect} from "react";
import { request } from "../../utils/network";

interface DialogProps{
    identity:number;
    applist:string;
    isOpen: boolean;
    onClose: () => void;
    Onok:()=>void;
    username:string;
  }

const Manageapp=(props: DialogProps) =>{
    const [remained, setremained] = useState<string[]>([]);
    const [exclude,setexclude]=useState<string[]>([]);
    useEffect((()=>{
        let userappr:string[]=[];
        let userappe:string[]=[];
        if(props.identity===3){

            if(props.applist.at(5)==="1"){
                userappr.push("资产定义");
            }else{
                userappe.push("资产定义");
            }
            if(props.applist.at(6)==="1"){
                userappr.push("资产管理");
            }else{
                userappe.push("资产管理");
            }   
            if(props.applist.at(7)==="1"){
                userappr.push("资产统计");
            }else{
                userappe.push("资产统计");
            }
            setremained(userappr);
            setexclude(userappe);
        }else{
            if(props.applist.at(8)==="1"){
                userappr.push("资产使用");
            }else{
                userappe.push("资产使用");
            }
            setremained(userappr);
            setexclude(userappe);
        }
    }),[props]);
    const handleCreateUser = () => {
        let newapp:string[]=["0","0","0","0","0","0","0","0","0"];
        if(props.identity===3){
            let dic={"资产定义":5,"资产管理":6,"资产统计":7};
            let i=0;
            let size=remained.length;
            for (i ;i<size;i++){
                newapp[dic[remained[i]]]="1";
            }
            let newapplist:string="";
            for (i=0;i<newapp.length;i++){
                newapplist=newapplist+newapp[i];
            }
            request("api/user/es/apps","POST",{name:props.username,newapp:newapplist})
                .then((res)=>{
                    message.success("修改成功");
                    props.Onok();
                })
                .catch((err)=>{
                    alert(err);
                    props.Onok();
                });
        }else{
            let dic={"资产使用":8};
            let i=0;
            let size=remained.length;
            for (i ;i<size;i++){
                newapp[dic[remained[i]]]="1";
            }
            let newapplist:string="";
            for (i=0;i<newapp.length;i++){
                newapplist=newapplist+newapp[i];
            }
            request("api/user/es/apps","POST",{name:props.username,newapp:newapplist})
                .then((res)=>{
                    message.success("修改成功");
                    props.Onok();
                })
                .catch((err)=>{
                    alert(err);
                    props.Onok();
                });
        }

    };
    const addapp=(name:string)=>{
        setremained([...remained,name]);
        setexclude(exclude.filter((obj)=>{return obj !== name;}));
    };
    const deleteappp=(name:string)=>{
        setexclude([...exclude,name]);
        setremained(remained.filter((obj)=>{return obj!== name;}));
    };
    return (
        <Modal  title="管理员工应用" open={props.isOpen} onOk={handleCreateUser} onCancel={props.onClose} >
            <div>
                <label>员工 {props.username} 已有应用:</label>
                <List
                    itemLayout="horizontal"
                    dataSource={remained}
                    renderItem={(item) => (
                        <List.Item
                            actions={[<a key="delete" onClick={()=>{deleteappp(item);}}>删除</a>]}
                        >
                            <div>{item}</div>
                        </List.Item>)}/>
            </div>
            <div>
                <label>员工 {props.username} 被禁止的应用：</label>
                <List
                    itemLayout="horizontal"
                    dataSource={exclude}
                    renderItem={(item) => (
                        <List.Item
                            actions={[<a key="add" onClick={()=>{addapp(item);}}>添加</a>]}
                        >
                            <div>{item}</div>
                        </List.Item>)}/>                
            </div>
        </Modal>
    );
};
export default Manageapp;