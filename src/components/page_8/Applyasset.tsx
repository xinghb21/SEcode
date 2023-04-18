import React, { useState } from "react";
import { useEffect } from "react";
import type { MenuProps } from "antd";
import { Button, Input, Menu, Space, Tag, message } from 'antd';
import { request } from '../../utils/network';
import { ProList } from "@ant-design/pro-components";
import Applysubmit from "./applysubmit"

interface asset{
    key:React.Key;
    id:number;
    name:string;
    type:number;
    count:number;
    applycount:number;
}

const Applyasset=()=>{
    const [useable_assetslist,setuseable_assetlist]=useState<asset[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [IsDialogOpen1,setIsDialogOpen1]=useState<boolean>(false);
    const [assetselected,setassetselected]= useState<asset[]>([]);
    
    useEffect((()=>{
        fetchlist();
    }),[]);
    const fetchlist=()=>{
        request('api/user/ns/getassets',"GET")
        .then((res)=>{
            let tem=res.info.map((val)=>{
                return({
                    key:val.id,
                    id:val.id,
                    name:val.name,
                    type:val.type,
                    count:val.count,
                    applycount:1
                });
            });
            setuseable_assetlist(tem);
        })
        .catch((err)=>{
            message.warning(err.message);
        })
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };
    const onChange = (inputvalue:string,name:string)=>{
        let index=useable_assetslist.findIndex((obj)=>{return obj.name === name});
        if( (+inputvalue) > useable_assetslist[index].count){
            message.warning("数量超额，请重新输入");
        }else{
            useable_assetslist[index].applycount=+ inputvalue;
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>,name:string) => {
        const { value: inputValue } = e.target;
        const reg = /^\d*(\d*)?$/;
        if (reg.test(inputValue)) {
          onChange(inputValue,name);
        }else{
            message.warning("数量必须是一个数字");
        }
      };
    const hasSelected = selectedRowKeys.length > 0;
    const handlesubmitsuccess=()=>{
        //在员工成功申请之后，重新刷新页面
        setSelectedRowKeys([]);
        setassetselected([]);
        fetchlist();
    }  

    return (
        <div>
            <Applysubmit isOpen={IsDialogOpen1} onClose={()=>{}} children="fuckse" proassetlist={assetselected} onSuccess={handlesubmitsuccess} ></Applysubmit>
            <ProList<asset>
                    toolBarRender={() => {
                        return [
                            <Button key="1" type="primary" disabled={hasSelected} onClick={()=>{setIsDialogOpen1(true);setassetselected(useable_assetslist.filter((obj)=>{return selectedRowKeys.find((key)=>{return key==obj.key}) != null }))}}>
                                申请资产领用
                            </Button>,                      
                        ];
                    }}
                    pagination={{
                        pageSize: 10,
                    }}
                    metas={{
                        title: {dataIndex:"name",},
                        description: {
                            render: (_,row) => {
                                return (
                                <div>
                                        <div>
                                            {"现有数量: "+row.count}
                                        </div>
                                        <div>
                                            {"资产编号："+row.id}
                                        </div>
                                </div>
                                );
                            },
                        },
                        subTitle: {
                            render: (_, row) => {
                                return (
                                    <Space size={0}>
                                        {(row.type===1)?<Tag color="blue" key={row.name}>{"数量型"}</Tag>
                                            :<Tag color="blue" key={row.name}>{"条目型"}</Tag>  
                                        }
                                    </Space>
                                );
                            },
                            search: false,
                        },
                        actions: {
                            render: (_,row) => {
                                return (
                                    <div >
                                        <Input
                                            onChange={(e)=>{handleChange(e,row.name)}}
                                            placeholder="Input a number"
                                            maxLength={16}
                                            disabled = { !(selectedRowKeys.find((obj)=>{obj===row.key})!= null) }
                                            />
                                    </div>
                                );
                            },
                        },
                    }}
                    rowKey="key"
                    headerTitle="部门内可领用资产列表"
                    rowSelection={rowSelection}
                    dataSource={useable_assetslist}
                />
            </div>
    );
}

export default Applyasset;