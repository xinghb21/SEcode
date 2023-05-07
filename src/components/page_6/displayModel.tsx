import { EditableProTable, ProCard, ProColumns, ProDescriptions, ProList } from "@ant-design/pro-components";
import { Button,Col,Descriptions,Divider,Drawer,Form,Input,message, Modal, QRCode, Row, Space, Table, Tag } from "antd";
import { request } from "../../utils/network";
import { useEffect, useState } from "react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import moment from "moment";

interface History {
    key: React.Key;
    id: number;
    content: string;
    time: number;
    type: number;
}

interface ModelProps {
    isOpen: boolean;
    onClose: () => void;
    content: AssetDisplayType;
}

type AdditionalDataType = {
    id: string;
    label: string;
    value: string;
}

const columns: ProColumns<AdditionalDataType>[] = [
    {
        title: "属性名",
        dataIndex: "label",
        width: "30%",
        editable: false,
    },
    {
        title: "属性值",
        dataIndex: "value",
        width: "70%",
        valueType: "text",
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: "此项为必填项",
                },
            ],
        },
    },
];

type Userlist = {
    key: React.Key;
    name: string;
    number: number;
}

type AssetDisplayType = {
    //table数据的格式
    key: React.Key;//资产的编号
    parent?: string;//父资产的名称
    department: string;//资产所属部门
    entity: string;//资产所属实体
    category: string;//资产的类型
    name: string;//资产的名称
    type: boolean;//条目型或数量型
    description: string;//资产描述
    create_time: number;//创建时间
    price: number;//资产原始价值
    life: number;//资产使用年限
    belonging: string;//挂账人
    number_idle?: number;//闲置数量
    additional: Record<string, string>;//附加信息
    user?: string;//条目型当前使用人
    usage?: Object[];//数量型当前使用情况
    status?: number;//条目型资产状态
    mantain?: string;//数量型维保情况
    number_expire?: number;//数量型过期数量
    number?: number;//总数数量
    haspic: boolean;//是否有图片
    userlist: Userlist[]; //使用人列表
    additionalinfo: string;//附加信息
    imageurl?: string;//图片url
}


const DisplayModel = (props: ModelProps) => {

    const [editRowKeys, seteditRowKeys] = useState<React.Key[]>([]);
    const [used, setUsed] = useState<string[]>([]);
    // const [showlabels, setShowlabels] = useState<[]>([]);
    const [text, setText] = useState<string>("");
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(()=>{
        return Object.entries(props.content.additional).map((item) => {
            return (item[0]);
        });
    });
    const [dataSource, setDataSource] = useState<readonly AdditionalDataType[]>(() =>
        Object.entries(props.content.additional).map((item) => {
            return {
                id: item[0],
                label: item[0],
                value: item[1],
            };
        }));
    
    const [historylist,sethistorylist] = useState<History[]>([]);    
    const [pagenation,setpagenation] = useState({
        current: 1, // 当前页码
        pageSize: 5, // 每页显示条数
        total: 0, // 总记录数
    });

    let assetDisplay: AssetDisplayType = props.content;

    useEffect(() => {
        setDataSource(Object.entries(props.content.additional).map((item) => {
            return {
                id: item[0],
                label: item[0],
                value: item[1],
            };
        }));
        setEditableRowKeys(Object.entries(props.content.additional).map((item) => {
            return (item[0]);
        }));
        // alert(JSON.stringify(props.content.labels));
        // setShowlabels(props.content.labels);
        request(`/api/asset/history?id=${props.content.key}&page=1`, "GET")
            .then((res) => {
            // 更新表格数据源和分页器状态
                sethistorylist(res.info.map((val) => {
                    return {
                        key: val.id,
                        id: val.id,
                        content: val.content,
                        type: val.type,
                        time: val.time,
                    };
                }));
                setpagenation({
                    current: 1,
                    pageSize: 5,
                    total: res.count,
                });
            })
            .catch((error) => {
                message.warning(error.message);
            });
        setText("http://Aplus-backend-Aplus.app.secoder.net/asset/fulldetail" + props.content.key.toString());
        setText("http://127.0.0.1:8000/asset/fulldetail" + props.content.key.toString());
        request("/api/asset/usedlabel", "GET")
            .then((res) => {
                setUsed(res.info);
            })
            .catch((err) => {
                message.warning(err.message);
            });
    }, [props.content]);


    const handleFetch = (page:number, pageSize:number) => {
        // 构造请求参数
        // 发送请求获取数据
        request("/api/asset/history","GET", {page: page})
            .then((res) => {
            // 更新表格数据源和分页器状态
                sethistorylist(res.info.map((val)=>{
                    return {
                        key: val.id,
                        id: val.id,
                        content: val.content,
                        type: val.type,
                        time: val.time,
                    };
                }));
                setpagenation({
                    current: page,
                    pageSize: 5,
                    total: res.count,
                });
            })
            .catch((error) => {
                message.warning(error.message);
            });
    };

    const handleOk = () => {
        
        if(editRowKeys == null || editRowKeys.length == 0) {
            let addition = {};
            dataSource.forEach((item) => {
                addition[item.label] = item.value;
            });
            if(assetDisplay.parent == null || assetDisplay.parent == "暂无上级资产") {
                request("/api/user/ep/modifyasset", "POST", 
                    {
                        name: assetDisplay.name,
                        number: assetDisplay.number_idle,
                        description: assetDisplay.description,
                        additional: addition,
                    })
                    .then((res) => {
                        message.success("修改成功");
                        props.onClose();
                    }).catch((err) => {
                        message.error(err.message);
                    });
            } else {
                request("/api/user/ep/modifyasset", "POST",
                    {
                        name: assetDisplay.name,
                        number: assetDisplay.number_idle,
                        description: assetDisplay.description,
                        additional: addition,
                        parent: assetDisplay.parent,
                    })
                    .then((res) => {
                        message.success("修改成功");
                        props.onClose();
                    }).catch((err) => {
                        message.error(err.message);
                    });
            }
        } else {
            message.warning("请确认修改");
        }
    };

    return (
        <Drawer
            open={props.isOpen}
            onClose={props.onClose}
            width="70%"
            footer={[
                <Button key="back" type="primary" onClick={handleOk}>
                    确认
                </Button>
            ]}
        >
            <ProDescriptions<AssetDisplayType>
                column={2}
                title={props.content.name}
                dataSource={assetDisplay}
                
                editable={{

                    onChange(editableKeys, editableRows) {
                        seteditRowKeys(editableKeys);
                    },

                    onSave: async (key, row) => {

                        assetDisplay.parent = row.parent;
                        assetDisplay.number_idle = row.number_idle;
                        assetDisplay.description = row.description;
                        assetDisplay.additional = row.additional;
                    
                    }
                }}
                columns={[
                    {
                        title: "资产编号",
                        dataIndex: "key",
                        key: "key",
                        valueType: "text",
                        editable: false,
                    },
                    {
                        title: "资产名称",
                        dataIndex: "name",
                        key: "name",
                        valueType: "text",
                        editable: false,
                    },
                    {
                        title: "父资产",
                        dataIndex: "parent",
                        key: "parent",
                        valueType: "text",
                    },
                    {
                        title: "挂账人",
                        dataIndex: "belonging",
                        key: "belonging",
                        valueType: "text",
                        editable: false,
                    },
                    {
                        title: "资产使用年限",
                        dataIndex: "life",
                        key: "life",
                        valueType: "digit",
                        editable: false,
                    },
                    {
                        title: "资产类型",
                        dataIndex: "category",
                        key: "category",
                        valueType: "text",
                        editable: false,
                    },
                    {
                        title: "可用资产数量",
                        dataIndex: "number_idle",
                        key: "number_idle",
                        valueType: "digit",
                        editable: () => {if(assetDisplay.type == false) {return false;} else {return true;}},
                    },
                    {
                        title: "资产描述",
                        dataIndex: "description",
                        key: "description",
                        valueType: "text",
                    },
                    {
                        title: "创建时间",
                        dataIndex: "create_time",
                        key: "create_time",
                        valueType: "dateTime",
                        editable: false,
                    },
                    {
                        title: "资产原始价值",
                        dataIndex: "price",
                        key: "price",
                        valueType: "money",
                        editable: false,
                    },
                ]}
            />
            {(assetDisplay.additionalinfo == "" || assetDisplay.additionalinfo == undefined)? <></> : 
                <>
                    <Descriptions>
                        <Descriptions.Item label="资产附加信息">
                            <div dangerouslySetInnerHTML={{__html: assetDisplay.additionalinfo}}></div>
                        </Descriptions.Item>
                    </Descriptions>                
                </>
            }
            <Divider></Divider>
            <ProCard title="资产自定义属性" headerBordered>
                <EditableProTable<AdditionalDataType>
                    columns={columns}
                    rowKey="id"
                    value={dataSource}
                    onChange={setDataSource}
                    recordCreatorProps={false}
                    editable={{
                        type: "multiple",
                        editableKeys,
                        actionRender: (row, config, defaultDoms) => {
                            return [defaultDoms.delete];
                        },
                        onValuesChange: (record, recordList) => {
                            setDataSource(recordList);
                        },
                        onChange: setEditableRowKeys,
                    }}
                />
            </ProCard>
            <Divider></Divider>
            {assetDisplay.haspic == false ? null : 
                <ProCard title="资产图片" headerBordered>
                    <img src={assetDisplay.imageurl} width="50%" ></img>
                </ProCard>   
            }
            <ProCard title="资产使用情况" headerBordered>
                <Table 
                    dataSource={assetDisplay.userlist}
                >
                    <Table.Column title="使用人" dataIndex="name" key="name"></Table.Column>
                    <Table.Column title="使用数量" dataIndex="number" key="number"></Table.Column>
                </Table>
            </ProCard>
            <Divider></Divider>
            <ProCard title="资产历史记录" headerBordered>
                <ProList<History, Params>
                    //切换页面的实现在于pagination的配置，如下
                    pagination={{
                        current: pagenation.current,
                        pageSize: pagenation.pageSize,
                        onChange: handleFetch,
                        total: pagenation.total
                    }}
                    metas={{
                        title: { dataIndex:"key" },
                        description: {
                            render: (_,row) => {
                                return (
                                    <div>
                                        {row.content}
                                    </div>
                                );
                            },
                        },
                        subTitle: {
                            render: (_, row) => {
                                return (
                                    <Space size={0}>
                                        {(row.type === 1) ? <Tag color="blue" key={row.id}>资产创建</Tag> :
                                            ((row.type===2) ? <Tag color="green" key={row.id}>资产领用</Tag> :  
                                                ((row.type===3) ? <Tag color="orange" key={row.id}>资产转移</Tag> :
                                                    ((row.type===4) ? <Tag color="red" key={row.id}>资产维保</Tag> :
                                                        ((row.type===5) ? <Tag color="purple" key={row.id}>资产退库</Tag> :
                                                            <Tag color="cyan" key={row.id}>资产数量变动</Tag>))))
                                        }
                                    </Space>
                                );
                            },
                            search: false,
                        },
                        extra: {
                            render: (_,row) =>{
                                return(
                                    <div style={{display:"flex",flexDirection:"column"}}>
                                        <p>时间：{moment(row.time,"X").format("YYYY-MM-DD-HH:mm:ss")}</p>
                                    </div>
                                );
                            },
                        },
                    }}
                    rowKey="key"
                    dataSource={historylist}
                />
            </ProCard>
            <ProCard title="资产标签" headerBordered>
                <div
                    style={{
                        margin: 24,
                        padding: 20,
                        borderWidth: 1,
                        borderColor: "lightgray",
                        borderStyle: "solid",
                        borderRadius: 20
                    }}
                >
                    <Row>
                        <Col span={20}>
                            <Descriptions title={assetDisplay.name}>
                                <Descriptions.Item label="业务实体">{assetDisplay.entity}</Descriptions.Item>
                                <Descriptions.Item label="部门">{assetDisplay.department}</Descriptions.Item>
                                {used.map((val,i)=><Descriptions.Item key={i} label={val}>
                                    {val == "挂账人" ? assetDisplay.belonging : 
                                        (val == "资产类别" ? assetDisplay.category : 
                                            val == "上级资产" ? assetDisplay.parent : 
                                                val == "价格" ? assetDisplay.price :
                                                    val == "使用年限" ? assetDisplay.life :
                                                        val == "创建时间" ? moment(assetDisplay.create_time).format("YYYY-MM-DD-HH-mm-ss") :
                                                            val == "描述" ? assetDisplay.description : assetDisplay.additional[val])}
                                </Descriptions.Item>)}
                            </Descriptions>
                        </Col>
                        <Col>
                            <Space direction="vertical" align="center">
                                <QRCode value={text} style={{ marginBottom: 16}}/>
                            </Space>
                        </Col>
                    </Row>
                </div>
                <Button style={{marginLeft: "90%"}}>打印标签</Button>
            </ProCard>
        </Drawer>
    );
};
export default DisplayModel;