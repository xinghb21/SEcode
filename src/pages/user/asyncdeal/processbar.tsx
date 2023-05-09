import React, { useEffect, useState } from "react";
import { Drawer, Space, Button, Table, Tag, message, Modal, Input, Select, Progress } from "antd";
import type { ColumnsType } from "antd/es/table";
import { request } from "../../../utils/network";
import {
    CarryOutTwoTone,
} from "@ant-design/icons";

import { Badge, Tooltip } from "antd";
import { ProList } from "@ant-design/pro-components";
import moment from "moment";
import { text } from "stream/consumers";

interface barprops{
    taskid:number,
    onover: ()=>void,
}

const Processbar = (props:barprops)=>{
    const [percent,setpercent] = useState<number>(10);
    var timer = setInterval(function(){
        request("/api/async/getprocess","POST",{taskid:props.taskid}).then(function(res){
            setpercent(res.process);
            if(res.process==100){
                clearInterval(timer);
                props.onover();
            }
        }).catch(function(e){
            message.warning(e.message);
            clearInterval(timer);
            props.onover();
        });
    },200);  
    return (
        <div>
            <Progress type="circle" percent={percent}/>
        </div>
    );
};

export default Processbar;