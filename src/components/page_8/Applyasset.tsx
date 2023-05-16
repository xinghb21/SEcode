import React, { useState } from "react";
import { useEffect } from "react";
import type { MenuProps } from "antd";
import { Button, Input, Menu, Space, Tag, message, Table, Descriptions, Select } from "antd";
import { request } from "../../utils/network";
import { ProColumns, ProList, ProTable } from "@ant-design/pro-components";
import Applysubmit from "./applysubmit";
import { ColumnsType } from "antd/es/table";
import Applydetail from "./Applydetail";
import { Typography } from "antd";

const { Title } = Typography;
interface asset{
    key:React.Key;
    id:number;
    name:string;
    type:number;
    count:number;
    applycount:number;
}
interface applys{
    key : React.Key;
    id:number;
    reason:string;
    message:string;
    state:number;
}




const Applyasset=()=>{
    const [useable_assetslist,setuseable_assetlist]=useState<asset[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [IsDialogOpen1,setIsDialogOpen1]=useState<boolean>(false);
    const [assetselected,setassetselected]= useState<asset[]>([]);
    const [selectids,setSelectedids] = useState<Map<number,React.Key[]>>(new Map());
    const [selectassets,setselectassets] = useState<Map<number,asset[]>>(new Map());
    const [applylist,setapplylsit]=useState<applys[]>([]);
    const [isdetalopen,setisdetailopen]=useState<boolean>(false);
    const [detailreason,setdetailreason] =useState<string>("");
    const [datailmessage,setdetailmessage] = useState<string>("");
    const [datailid,setdetailid] =useState<number>(-1);
    const [pagenation,setpagenation] = useState({
        current: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总记录数
    });

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
        request("api/user/ns/getallapply","GET")
            .then((res)=>{
                let tmp = res.info.filter(item => (item.type == 1));
                setapplylsit(tmp.map((val)=>{return{
                    id:val.id,
                    reason:val.reason,
                    state:val.status,
                    message:val.message
                };}));
            })
            .catch((err)=>{
                message.warning(err.message);
            });
    };
    const fetchlist=()=>{
        request("/api/user/ns/getassets","GET",{page:1})
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
                setpagenation({
                    current: 1,
                    pageSize: 10,
                    total: res.count,
                });})
            .catch((err)=>{
                message.warning(err.message);
            });
    };

    const handleFetch = (page:number,pageSize:number) => {
        // 构造请求参数
        // 发送请求获取数据
        request("/api/user/ns/getassets","GET",{page:page})
            .then((res) => {
            // 更新表格数据源和分页器状态
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
                setpagenation({
                    current: page,
                    pageSize: 10,
                    total: res.count,
                });
                // if(!( page in selectids?.keys()) ){
                //     let tempmap = selectids;
                //     tempmap.set(page,[]);
                // }
            })
            .catch((error) => {
                message.warning(error.message);
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
            setassetselected(useable_assetslist.filter((obj)=>{return selectedRowKeys.find((key)=>{return key==obj.key;}) != null; }));
        }else{
            message.warning("申请的资产数量超额或为0");
        }
    };

    return (
        <div style={{height:"100%"}}>
            
            <Applysubmit isOpen={IsDialogOpen1} onClose={()=>{setIsDialogOpen1(false);}} proassetlist={assetselected} onSuccess={handlesubmitsuccess} ></Applysubmit>
            <Applydetail isOpen={isdetalopen} onClose={()=>{setisdetailopen(false);}} id={datailid} reason={detailreason} message={datailmessage} > </Applydetail>
            <Title  level={3} style={{marginLeft:"2%"}} >
            资产领用
            </Title >
            
            <div  style={{
                height: "80%",
                overflow: "auto",
                padding: "0 16px",
            }} >
                <div 
                    style={{
                        height: "600px",
                        overflow: "scroll",
                        padding: "0 16px",
                        border: "1px solid rgba(140, 140, 140, 0.35)",
                    }}
                >
                    <ProTable<asset>
                        toolBarRender={() => {
                            return [
                                <Button key="1" type="primary" disabled={!hasSelected} onClick={()=>{handlesubclick();}}>
                                    申请资产领用
                                </Button>,                      
                            ];
                        }}
                        pagination={{current:pagenation.current,pageSize:pagenation.pageSize,onChange:handleFetch,total:pagenation.total}}
                        columns={columns}
                        search={false}
                        options={false}
                        rowKey="key"
                        headerTitle="部门内可领用资产列表"
                        rowSelection={rowSelection}
                        dataSource={useable_assetslist}
                    />
                </div>
                <div 
                    style={{
                        height: "50%",
                        overflow: "auto",
                        padding: "0 16px",
                        border: "1px solid rgba(140, 140, 140, 0.35)",
                    }}
                >
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
                        headerTitle="你的申请列表"
                        dataSource={applylist}
                    />
                </div>
            </div>
        </div>
    );
};

export default Applyasset;