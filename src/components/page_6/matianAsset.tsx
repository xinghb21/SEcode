import React, { useState } from "react";
import { useEffect } from "react";
import { Button, message, List, Typography, Divider, Spin } from "antd";
import { request } from "../../utils/network";
import Checkboxhqf from "./checkbox";
interface Asset {
    id: number,
    name: string,
    state: number,
}
interface Assetsimple {
    id: number,
    name: string,
}

interface Apply {
    id: number,
    assets: Assetsimple[],
}

const { Title } = Typography;

const MatainAssets = () => {
    const [applylist, setapplylist] = useState<Apply[]>([]);
    const [applyid, setapplyid] = useState<number>(-1);
    const [nowassetslist, setnowassetslist] = useState<Asset[]>([]);
    const [isSpinning,setIsSpinning]=useState<boolean>(false);//Spin状态
    const [isSpinning2,setIsSpinning2]=useState<boolean>(false);//Spin状态
    const fetchapplylist = () => {
        setIsSpinning(true);
        request("/api/user/ep/getallmatain", "GET")
            .then((res) => {
                setapplylist(res.info);
            })
            .catch((err) => {
                message.warning(err.message);
            });
        setTimeout(() => {
            setIsSpinning(false);
        }, 500);
    };
    const fetchassetlist = (id: number) => {
        setIsSpinning2(true);
        let newsassets = applylist.find((obj) => { return obj.id == id; })?.assets.map((val) => { return { id: val.id, name: val.name, state: 2 }; });
        if (newsassets) {
            setnowassetslist(newsassets);
            setapplyid(id);
        } else {
            setnowassetslist([]);
            setapplyid(-1);
        }
        setTimeout(() => {
            setIsSpinning2(false);
        }, 500);
    };
    useEffect((() => {
        setIsSpinning2(true);
        fetchapplylist();
        setTimeout(() => {
            setIsSpinning2(false);
        }, 500);
    }), []);
    const handlesubmit = () => {
        setIsSpinning(true);
        setIsSpinning2(true);
        let size = nowassetslist.length;
        for (let i = 0; i < size; i++) {
            if ((nowassetslist[i].state !== 0) && (nowassetslist[i].state !== 1)) {
                message.warning("有资产的状态没有更新");
                return;
            }
        }
        request("/api/user/ep/matianover", "POST", { id: applyid, assets: nowassetslist })
            .then((res) => {
                fetchapplylist();
                setnowassetslist([]);
                setapplyid(-1);
                message.success("处理成功");
            })
            .catch((err) => {
                message.warning(err.message);
            });
        setTimeout(() => {
            setIsSpinning(false);
        }, 500);
        setTimeout(() => {
            setIsSpinning2(false);
        }, 500);
    };

    const onchangestate = (value: number, index: number) => {
        nowassetslist[index].state = value;
    };
    return (
        <div style={{ display: "flex", flexDirection: "row", width: "100%", height: "100%" }} >
            <div style={{ width: "50%", marginRight: 20, padding: 10, borderRadius: 10, height: "100%" }} >
                <Title level={4} style={{ marginTop: 0 }}>维保申请</Title>
                <Spin spinning={isSpinning}>
                    <List
                        pagination={{
                            pageSize: 10,
                        }}
                        bordered={true}
                        dataSource={applylist}
                        renderItem={(item) => (
                            <List.Item

                                key={item.id}
                                extra={
                                    <Button onClick={() => { fetchassetlist(item.id); }}> 处理 </Button>
                                }
                            >
                                <List.Item.Meta
                                    title={<p>{item.id}</p>}
                                    description={<p>此维保申请的id为{item.id}</p>}
                                />
                            </List.Item>
                        )}
                    />
                </Spin>
            </div>
            <div style={{ width: "50%", marginRight: 20, padding: 10, borderRadius: 10, height: "100%" }} >
                <Title level={4} style={{ marginTop: 0 }}>选中申请所涉及的资产</Title>
                <Spin spinning={isSpinning2}>
                    <List
                        pagination={{
                            pageSize: 10,
                        }}
                        footer={
                            <>
                                <Divider />
                                <Button onClick={handlesubmit} disabled={(nowassetslist.length == 0) ? true : false}> 完成 </Button>
                            </>
                        }
                        bordered={true}
                        dataSource={nowassetslist}
                        renderItem={(item, index) => (
                            <List.Item
                                key={item.id}
                                extra={
                                    <div>
                                        <Checkboxhqf key={item.id} onover={onchangestate} index={index} ></Checkboxhqf>
                                    </div>
                                }
                            >
                                <List.Item.Meta
                                    title={<p>{item.name}</p>}
                                    description={<p>此资产的id为{item.id}</p>}
                                />
                            </List.Item>
                        )}
                    />
                </Spin>
            </div>
        </div>
    );
};


export default MatainAssets;