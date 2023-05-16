import React, { useEffect, useState } from "react";
import { Drawer, Space, Button, Table, Tag, message, Modal, Input, Select, Typography, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { request } from "../../../utils/network";
import {
    CarryOutTwoTone,
} from "@ant-design/icons";

import { useRouter } from "next/router";

const {Text, Paragraph} = Typography;

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSendR: (reason: string) => void;
    title: string;
    subtitle: string;
}

interface ChooseProps {
    isOpen: boolean;
    onClose: () => void;
    onSendR: (reason: assetType[]) => void;
    title: string;
    subtitle: string;
}


type DataType = {
    //table数据的格式
    key: React.Key;//id
    name: string;//申请人的名字
    oper: number,//对该资产进行什么操作：1领用，2转移，3维保，4退库
    reason: string;//申请原因
}

type AssetDisplayType = {
    //详细table数据的格式
    key: React.Key;//id
    assetname: string;//资产名称
    assetclass: string,//资产类别
    assetcount: number;//申请资产的数量
}

type assetType = {
    id: React.Key;
    label: string;
    number: number;
}

const Assetcolumns: ColumnsType<AssetDisplayType> = [
    {
        title: "资产编号",
        dataIndex: "key",
    },
    {
        title: "资产名称",
        dataIndex: "assetname",
    },
    {
        title: "资产类别",
        dataIndex: "assetclass",
    },
    {
        title: "资产数量",
        dataIndex: "assetcount",
    }
];


const TbdDrawer = () => {
    const router = useRouter();
    const query = router.query;
    const [tbdData, settbdData] = useState<DataType>();
    const [open, setOpen] = useState(false);
    const [assetdisdata, setassetdisData] = useState<AssetDisplayType[]>([]);

    const [chosenkey, setck] = useState<React.Key>();
    const [isDialogOpenSR, setIsDialogOpenSR] = useState(false);
    const [isDialogOpenCD, setIsDialogOpenCD] = useState(false);
    const [dopen, setDOpen] = useState(false);
    const [assetTypeList, setATL] = useState<assetType[]>([]);
    //资产类别列表，用于资产调拨选择相应的类别
    const [assetclasslist, setac] = useState([]);
    //资产调拨处理的资产ID
    const [cdID, setCDID] = useState<React.Key>();
    const [loading, setLoading] = useState<boolean>(true);//是否加载中
    
    const showDrawer = () => {
        setDOpen(true);
    };
    const onClose = () => {
        setDOpen(false);
    };

    let id: number = query.id as unknown as number;
    useEffect((() => {
        if(router.isReady === false) return;
        console.log(query)
        console.log(query.id);
        fetchtbdData();
        //获取部门下的资产类别
        fetchDepart();
        fetchAsset();
    }), [router, query]);

    const showModal = () => {
        setOpen(true);
    };
    const fetchDepart = () => {
        request("/api/asset/assetclass", "GET")
            .then((res) => {
                setac(res.data.map((item) => {
                    return {
                        value: item, label: item
                    };
                }));
            }).catch((err) => {
                message.warning(err.message);
            });
    };

    //拒绝申请输入原因
    const handleSendR = (reason: string) => {
        //不允许空输入
        if (reason.match("\\s+") || reason.length == 0) {
            message.warning("请输入具体原因");
            return;
        }
        request("/api/user/ep/reapply", "POST", {
            id: chosenkey,
            status: 1,
            reason: reason
        }).then(() => {
            message.success("操作成功");
            setIsDialogOpenSR(false);
        }).catch((err) => {
            message.warning(err.message);
        });
        setIsDialogOpenSR(false);
    };
    //处理资产调拨时需要选择资产类别
    const handleChooseD = (depart: assetType[]) => {
        if (depart.length != assetdisdata.length) {
            message.warning("请为所有资产指定类别");
            return false;
        }
        request("/api/user/ep/setcat", "POST", {
            asset: depart,
            id: cdID,
            status: 0,
            reason: "Success!"
        })
            .then(() => {
                message.success("操作成功");
            })
            .catch((err) => {
                message.warning(err.message);
            });
        setIsDialogOpenCD(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    //拒绝时输入理由的弹窗
    const SendR = (props: DialogProps) => {
        const [reason, setR] = useState("");
        const handleSendR = () => {
            props.onSendR(reason);
            setR("");
        };
        return (
            <Modal title={props.title} open={props.isOpen} onOk={handleSendR} onCancel={props.onClose} >
                <div>
                    <label>{props.subtitle}</label>
                    <Input type="reason" value={reason} onChange={(e) => setR(e.target.value)} />
                </div>
            </Modal>
        );
    };
    //处理资产调拨时选择同意的弹窗
    const ChooseD = (props: ChooseProps) => {
        const handleChooseD = () => {
            props.onSendR(assetTypeList);
            setATL([]);
        };
        const ChooseColumns: ColumnsType<AssetDisplayType> = [
            {
                title: "资产编号",
                dataIndex: "key",
            },
            {
                title: "资产名称",
                dataIndex: "assetname",
            },
            {
                title: "选择新部门下的资产类别",
                render: (record) => (
                    <Select
                        style={{ width: 120 }}
                        onChange={(value) => {
                            let data = assetTypeList;
                            if (data.filter((item) => item.id === record.key).length > 0)
                                data.filter((item) => item.id === record.key)[0].label = value;
                            else
                                data.push({ id: record.key, label: value, number: record.assetcount });
                            setATL(data);
                        }}
                        placeholder="请选择"
                        options={assetclasslist} ></Select>
                )
            }];
        return (
            <Modal title={props.title} open={props.isOpen} onOk={handleChooseD} onCancel={props.onClose} >
                <div>
                    <label>{props.subtitle}</label>
                    <Table columns={ChooseColumns} dataSource={assetdisdata}></Table>
                </div>
            </Modal>
        );
    };
    const fetchtbdData = () => {
        request("/api/user/ep/getoneapply", "GET", {id: id})
            .then((res) => {
                settbdData(res.info);
                setLoading(false);
            })
            .catch((err) => {
                message.warning(err.message);
            });
    };

    const fetchAsset = () => {
        request("/api/user/ep/assetsinapply", "GET", {
            id: id
        }).then((res) => {
            setassetdisData(res.info.map((item) => {
                return {
                    key: item.id,
                    assetname: item.assetname,
                    assetclass: item.assetclass,
                    assetcount: item.assetcount
                };
            }));

        }).catch((err) => {
            message.warning(err.message);
        });
    };
    
    const optag = (op) =>{
        if (op === 1) {
            return (<Tag color="blue">
                资产领用
            </Tag>
            );
        }
        else if (op === 2) {
            return (<Tag color="green">
                资产转移
            </Tag>
            );
        }
        else if (op === 3) {
            return (<Tag color="yellow">
                资产维保
            </Tag>
            );
        }
        else if (op === 4) {
            return (
                <Tag color="volcano">
                    资产退库
                </Tag>
            );
        }
        else if (op == 6) {
            return (
                <Tag color="cyan">
                    资产调拨
                </Tag>
            );
        }
    }
    return (
        loading ? <Spin tip="Loading..."></Spin> :<>
            <Paragraph>
                {"申请人姓名："+tbdData?.name+"\n"}
            </Paragraph>
            <Paragraph>
                {"申请理由："+tbdData?.reason+"\n"}
            </Paragraph>
            <Space>
            <Text>
                {"申请类型："}
            </Text>
            {optag(tbdData?.oper)}
            </Space>
            <Table bordered columns={Assetcolumns} dataSource={assetdisdata} />
            <Space size="middle">
                <Button danger={true} onClick={() => {
                    setck(id);
                    setIsDialogOpenSR(true);
                }}>
                    拒绝
                </Button>
                <Button type="primary" onClick={() => {
                    if (tbdData?.oper != 6) {
                        request("/api/user/ep/reapply", "POST", {
                            id: id,
                            status: 0,
                            reason: "Success!"
                        }).then(() => {
                            message.success("操作成功");
                        }).catch((err) => {
                            message.warning(err.message);
                        });
                    }
                    else {
                        setCDID(id);
                        request("/api/user/ep/assetsinapply", "GET", {
                            id: id
                        }).then((res) => {
                            setassetdisData(res.info);
                        }).catch((err) => {
                            message.warning(err.message);
                        });
                        setIsDialogOpenCD(true);
                        fetchDepart();
                    }
                }}>
                    同意
                </Button>
            </Space>
            <SendR title={"请输入拒绝原因"} subtitle={"具体原因为："} isOpen={isDialogOpenSR} onClose={() => setIsDialogOpenSR(false)} onSendR={handleSendR} />
            <ChooseD title={"请为调拨的资产选择类别"} subtitle={""} isOpen={isDialogOpenCD} onClose={() => setIsDialogOpenCD(false)} onSendR={handleChooseD} />
        </>
    );
};
export default TbdDrawer;
