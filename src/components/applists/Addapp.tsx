import { useState } from "react";
import { Modal, Input, message } from "antd";
import React from "react";
import { request } from "../../utils/network";

interface app{
    key: React.Key;
    name:string;
    urlvalue:string;
  }

interface DialogProps{
    isOpen: boolean;
    username:string;
    onClose: () => void;
  }

const Addapp=(props:DialogProps)=>{
    const [appname,setappname]=useState<string>("");
    const [appurl,setappurl]=useState<string>("");
    const add_app =()=>{
        if(appname!== "" && appurl !== ""){
            request("api/user/es/addapp","POST",{username:props.username,appadded:[{name:appname,urlvalue:appurl}]})
                .then((res)=>{
                    message.success("添加成功");
                    props.onClose();
                })
                .catch((err)=>{
                    message.warning(err.message);
                    props.onClose();
                });
        }else{
            message.warning("应用名称或URL不能为空");
        }
    };
    return (
        <Modal title={"添加应用"} open={props.isOpen} onOk={()=>{add_app();props.onClose();}} onCancel={()=>{props.onClose();}} >
            <label>应用名称:</label>
            <Input type="text" value={appname} onChange={(e) => setappname(e.target.value)} />
            <label>应用URL:</label>
            <Input type="URL" value={appurl} onChange={(e)=>{setappurl(e.target.value);}}></Input>
        </Modal>
    );
};
export default Addapp;