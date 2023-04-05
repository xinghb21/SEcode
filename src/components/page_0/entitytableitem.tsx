import UserTable from "../Table";
import { Button, Table } from "antd";
import { request } from '../../utils/network';
import { Md5 } from "ts-md5";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import User from '../page_1/createES';

interface Entity{
    key:React.Key;
    entityname:string;
    admingname:string|undefined;
}

const entitytableitem=(props:Entity)=>{
    return (
        <div>
            
        
        </div>
    );

}