import React, { useState } from "react";
import { useEffect } from "react";
import type { MenuProps, RadioChangeEvent } from "antd";
import { Button, Input, Menu, Space, Tag, message, Table, List, Modal } from 'antd';
import { request } from "../../utils/network";
import { ProList } from "@ant-design/pro-components";
import { time } from "console";
import { Radio } from "antd"

interface checkprops{
    index:number,
    onover:(value:number,index:number)=>void;
}

const Checkboxhqf=(props:checkprops)=>{
    const [value,setvalue] = useState<number>(-1);
    return (
        <div>
            <Radio.Group onChange={(e:RadioChangeEvent)=>{setvalue(e.target.value);props.onover(e.target.value,props.index);}} value={value}>
                <Radio value={1}>维保成功</Radio>
                <Radio value={0}>维保失败</Radio>
            </Radio.Group>
        </div>
    );  
}

export default Checkboxhqf;