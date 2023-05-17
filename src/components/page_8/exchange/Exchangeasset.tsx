import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Input, Menu, Space, Tag, message, Table, Spin } from "antd";
import { request } from "../../../utils/network";
import { ProColumns, ProList, ProTable } from "@ant-design/pro-components";
import Exchangesubmit from "./Exchangesubmit";
import Exchangedetail from "./Exchangedetail";
import { Typography } from "antd";

const { Title } = Typography;

interface asset{
    key: React.Key;
    id:number;
    name: string;
    type: number;
    count: number;
    applycount: number;
    state:string;
}

interface applys{
    key: React.Key;
    id:number;
    reason: string;
    message: string;
    state: number;
}

const Exchangeasset=()=>{

    const [useable_assetslist,setuseable_assetlist]=useState<asset[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [IsDialogOpen1,setIsDialogOpen1]=useState<boolean>(false);
    const [assetselected,setassetselected]= useState<asset[]>([]);
    const [applylist,setapplylist]=useState<applys[]>([]);
    const [isdetalopen,setisdetailopen]=useState<boolean>(false);
    const [detailreason,setdetailreason] = useState<string>("");
    const [datailmessage,setdetailmessage] = useState<string>("");
    const [datailid,setdetailid] = useState<number>(-1);
    const [spinloading,setspinloading] = useState<boolean>(false);
    const columns: ProColumns<asset> []= [
        {        
            title: "资产名称",
            dataIndex: "name",
        },
        {
            title:"资产编号",
            dataIndex:"id",
        },
        {
            title: "资产类别",
            dataIndex: "type",
            render: (_, row) => {
                return (
                    <Space size={0}>
                        {(row.type===1)?<Tag color="blue" key={row.name}>{"数量型"}</Tag>
                            :<Tag color="blue" key={row.name}>{"条目型"}</Tag>  
                        }
                    </Space>
                );
            },
        },
        {
            title: "资产数量",
            dataIndex: "count",
        },
        {
            title: "申请数量",
            key:"number input",
            render:(_,row)=>{
                return (
                    row.type==1?
                        <Input
                            onChange={(e)=>{handleChange(e,row.name);}}
                            placeholder="请输入一个数字"
                            maxLength={16}
                        />
                        :
                        <a>1</a>
                );
            }
        }
    ];

    useEffect((()=>{
        fetchlist();
        fetchapply();
    }),[]);

    const fetchapply=()=>{
        request("api/user/ns/getallapply", "GET")
            .then((res)=>{
                let tmp = res.info.filter(item => (item.type == 2));
                setapplylist(tmp.map((val) => {
                    return{
                        id:val.id,
                        reason:val.reason,
                        state:val.status,
                        message:val.message
                    };
                }));
            })
            .catch((err)=>{
                message.warning(err.message);
            });
    };

    const fetchlist=()=>{
        setspinloading(true);
        request("/api/user/ns/possess","GET")
            .then((res)=>{
                let size = res.assets.length;
                let tem :asset[]=[];
                for (let i=0;i<size;i++){
                    let state :object = res.assets[i].state;
                    let statenum="";
                    Object.entries(state).forEach(([k, v]) => {
                        if(v!==0){
                            tem.push({
                                key:res.assets[i].name+" "+k,
                                id:res.assets[i].id,
                                name:res.assets[i].name,
                                type:res.assets[i].type,
                                count:v,
                                applycount:v,
                                state:k,
                            });
                        }
                    });
                }
                let useable :asset[] = tem.filter(item =>(item.state==="1"));
                setuseable_assetlist(useable);
                setspinloading(false);
            })
            .catch((err)=>{
                message.warning(err.message);
                setspinloading(false);
            });
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };
    const onChange = (inputvalue:string,name:string)=>{
        let index=useable_assetslist.findIndex((obj)=>{return obj.name === name;});
        if( (+inputvalue) > useable_assetslist[index].count){
            message.warning("数量超额，请重新输入");
        }
        useable_assetslist[index].applycount= + inputvalue;
        
    };
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
        fetchapply();
    };  
    const handledelete=(rowid:number)=>{
        request("/api/user/ns/deleteapplys","DELETE",{id:rowid})
            .then((res)=>{
                fetchapply();
                message.success("删除成功");
            })
            .catch((err)=>{
                message.warning(err.message);
            }
            );
    };
    //检查一遍申请的资产数量
    const checksubmit=()=>{
        let selectasset=useable_assetslist.filter((obj)=>{return selectedRowKeys.find((key)=>{return key==obj.key;}) != null; });
        let i = 0;
        if(selectasset != null){
            let size=selectasset.length;
            let ans = true;
            for(i;i<size;i++){
                if(selectasset[i].applycount<=0 || selectasset[i].applycount>selectasset[i].count){
                    ans=false;
                    break;
                }
            }
            return ans;
        }else{
            return false;
        }
    };
    const handlesubclick=()=>{
        if(checksubmit()){
            setIsDialogOpen1(true);
            setassetselected(useable_assetslist.filter((obj)=>{return selectedRowKeys.find((key)=>{return key == obj.key;}) != null; }));
        }else{
            message.warning("转移的资产数量超额或为0");
        }
    };

    return (
        <div>
            <Spin spinning={spinloading} size="large"  >  
                <Exchangesubmit isOpen={IsDialogOpen1} onClose={()=>{setIsDialogOpen1(false);}} proassetlist={assetselected} onSuccess={handlesubmitsuccess} ></Exchangesubmit>
                <Exchangedetail isOpen={isdetalopen} onClose={()=>{setisdetailopen(false);}} id={datailid} reason={detailreason} message={datailmessage} > </Exchangedetail>
                <Title  level={3} style={{marginLeft:"2%"}} >
            资产转移
                </Title >
                <ProTable<asset>
                    toolBarRender={() => {
                        return [
                            <Button key="1" type="primary" disabled={!hasSelected} onClick={()=>{handlesubclick();}}>
                                申请资产转移
                            </Button>,                      
                        ];
                    }}
                    pagination={{
                        pageSize: 5,
                    }}
                    columns={columns}
                    search={false}
                    options={false}
                    rowKey="key"
                    headerTitle="正在使用的资产列表"
                    rowSelection={rowSelection}
                    dataSource={useable_assetslist}
                />
                <ProList<applys>
                    pagination={{
                        pageSize: 5,
                    }}
                    metas={{
                        title: {dataIndex:"id"},
                        description: {
                            render: (_,row) => {
                                return (
                                    <div>
                                        <div>
                                            {"申请原因: "+row.reason}
                                        </div>
                                    </div>
                                );
                            },
                        },
                        subTitle: {
                            render: (_, row) => {
                                return (
                                    <Space size={0}>
                                        {(row.state===2)?<Tag color="red" key={row.id}>{"拒绝"}</Tag>
                                            :((row.state===0)?<Tag color="blue" key={row.id} >{"处理中"}</Tag>:<Tag color="green" key={row.id}>{"通过"}</Tag>)  
                                        }
                                    </Space>
                                );
                            },
                            search: false,
                        },
                        actions: {
                            render: (_,row) => {
                                return (
                                    <div>
                                        <Button onClick={()=>{setdetailid(row.id);setdetailmessage(row.message);setdetailreason(row.reason);setisdetailopen(true);}}>查看详情</Button>
                                        <Button onClick={()=>{handledelete(row.id);}}disabled={(row.state === 0)} > 删除 </Button>
                                    </div>
                                );
                            },
                        },
                    }}
                    rowKey="key"
                    headerTitle="你的转移列表"
                    dataSource={applylist}
                />
            </Spin>
        </div>
    );
};

export default Exchangeasset;