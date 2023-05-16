import { Button,message} from "antd";
import React from "react";
import { ProFormDateRangePicker, ProFormDigitRange, ProList } from "@ant-design/pro-components";
import { useState } from "react";
import { useEffect } from "react";
import { request } from "../../utils/network";
import {
    ProForm,
    ProFormSelect,
    ProFormText,
    QueryFilter,
} from "@ant-design/pro-components";
import DisplayModel from "./displayModel";
import MoveAsset from "./moveAsset";
import OSS from "ali-oss";
import CryptoJS from "crypto-js";
import Base64 from "base-64";

interface Asset {

    key: React.Key;
    name: string;
    person?: string;
    department?: string;
    parent?: string;
    child?: string;
    assetclass: string;
    description?: string;
    number?: Number;
    addtion?: Object;
    status?: Number;
    type?: boolean;

}

type AssetMoveType = {
    key: React.Key;//资产的编号
    assetname: string;//资产的名称
}

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
    new_price?: number;//资产现价值
}

type AssetQueryType = {
    //查询资产的格式
    name?: string;//资产的名称
    parent?: string;//父资产的名称
    assetclass?: string;//资产的类型
    belonging?: string;//挂账人
    from?: number;//资产创建时间的起始时间
    to?: number;//资产创建时间的结束时间
    user?: string;//条目型资产的使用人
    status?: number;//条目型资产的状态
    pricefrom?: number;//资产原始价值的起始值
    priceto?: number;//资产原始价值的结束值
    custom?: string;//自定义属性的名称
    content?: string;//自定义属性的内容
}

const ddata: AssetDisplayType = {
    key: 0, name: "", category: "", number_idle: 0, description: "", create_time: 0, price: 0,
    life: 0, additional: {}, number: 0, haspic: false, userlist: [], additionalinfo: "",
    belonging: "", department: "", entity: "", parent: "", type: false, user: "", usage: [], status: 0,
};

const emptyquery: AssetQueryType = {
    name: "", parent: "", assetclass: "", belonging: "", from: 0, to: 0, user: "", status: 0,
    pricefrom: 0, priceto: 0, custom: "", content: "",
};

const accessKeyId = "LTAI5t7ktfdDQPrsaDua9HaG";
const accessSecret = "z6KJp2mQNXioRZYF0jkIvNKL5w8fIz";
const policyText = {
    "expiration": "2028-01-01T12:00:00.000Z", // 设置该Policy的失效时间，
    "conditions": [
        ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
    ]
};
const policyBase64 = Base64.encode(JSON.stringify(policyText));
const bytes = CryptoJS.HmacSHA1(policyBase64, accessSecret, { asBytes: true });
const signature = bytes.toString(CryptoJS.enc.Base64);
const client = new OSS({
    region: "oss-cn-beijing",
    accessKeyId: accessKeyId,
    accessKeySecret: accessSecret,
    bucket: "aplus-secoder",
});


const DelAsset = (() => {
    //
    const [selectedRowKeysContainer, setSRKC] = useState<Map<number, React.Key[]>>(new Map());
    const [selectedRowAssetsContainer, setSRAC] = useState<Map<number, AssetMoveType[]>>(new Map());
    //
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [customfeatureList, setcustomFeature] = useState<string[]>();
    const [assetclasslist, setac] = useState<string[]>([]);
    const [displaydata, setDisplay] = useState<AssetDisplayType>(ddata);
    const [isMoveOpen, setIsMoveOpen] = useState(false);
    const [selectedAssets, setSelectedAssets] = useState<AssetMoveType[]>([]);
    const [outputloading, setoupputloading] = useState<boolean>(false);
    const [pagenation, setpagenation] = useState({
        current: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总记录数
    });
    const [check, setcheck] = useState<boolean>(false); //是否处于查询状态
    const [query, setquery] = useState<AssetQueryType>(emptyquery); //查询的内容

    useEffect(() => {
        //获取当下部门所有的资产
        request("/api/asset/get", "GET", { page: 1 })
            .then((res) => {
                setAssets(res.data);
                setpagenation({
                    current: 1,
                    pageSize: 10,
                    total: res.count,
                });
            })
            .catch((err) => {
                message.warning(err.message);
            });
        //获取部门下的自定义属性
        request("/api/asset/attributes", "GET")
            .then((res) => {
                setcustomFeature(res.info);
            }).catch((err) => {
                message.warning(err.message);
            });
        //获取部门下的资产类别
        request("/api/asset/assetclass", "GET")
            .then((res) => {
                setac(res.data);
            }).catch((err) => {
                message.warning(err.message);
            });
    }, []);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => {
            //设置keys
            setSelectedRowKeys(keys);
            let tmpkeysmap = selectedRowKeysContainer;
            tmpkeysmap.set(pagenation.current, keys);
            setSRKC(tmpkeysmap);
            let tmpassetsmap = selectedRowAssetsContainer;
            if (keys.length != 0) {
                tmpassetsmap.set(pagenation.current, keys.map(key => {
                    let tmpitem = assets.find(data => data.key === key);
                    if (tmpitem!=undefined) {
                        return { key: tmpitem.key, assetname: tmpitem.name };
                    }
                    else {
                        return { key: 0, assetname: "" };
                    }
                }));
            }
            else {
                tmpassetsmap.set(pagenation.current, []);
            }
            setSRAC(tmpassetsmap);
        },
    };

    //给后端发请求转移对应的asset
    const change_asset = (() => {
        let AssetsContainer = Array.from(selectedRowAssetsContainer.values());
        let tmpAssetsList: AssetMoveType[] = [];
        for (let index = 0; index < AssetsContainer.length; index++) {
            tmpAssetsList = tmpAssetsList.concat(AssetsContainer[index]);
        }
        setSelectedAssets(tmpAssetsList);

        setIsMoveOpen(true);

    });
    //判断是否有选中的
    function getHasSelected(): boolean {
        let KeysContainer = Array.from(selectedRowKeysContainer.values());
        let keysList: React.Key[] = [];
        for (let index = 0; index < KeysContainer.length; index++) {
            keysList = keysList.concat(KeysContainer[index]);
        }
        return keysList.length > 0;
    }

    const handleoutput = () => {
        setoupputloading(true);
        request("/api/async/newouttask", "POST")
            .then((res) => {
                setoupputloading(false);
                message.success("导出成功，请前往任务中心下载");
            })
            .catch((err) => {
                message.warning(err.message);
            });
        message.info("导出开始，请前往任务中心查看进度");
    };

    const handleFetch = (page: number, pageSize: number) => {
        // 构造请求参数
        // 发送请求获取数据
        //分页选取的复原
        if (check) {
            request("/api/user/ep/queryasset", "POST",
                {
                    //传递查询参数
                    parent: query?.parent,
                    assetclass: query?.assetclass,
                    name: query?.name,
                    belonging: query?.belonging,
                    from: query?.from,
                    to: query?.to,
                    user: query?.user,
                    status: query?.status,
                    pricefrom: query?.pricefrom,
                    priceto: query?.priceto,
                    custom: query?.custom,
                    content: query?.content,
                    page: page,
                })
                .then((res) => {
                    setAssets(res.data);
                    setpagenation({
                        current: page,
                        pageSize: 10,
                        total: res.count,
                    });
                })
                .catch((err) => {
                    message.warning(err.message);
                });
        }
        else {
            request("/api/asset/get", "GET", { page: page })
                .then((res) => {
                    setAssets(res.data);
                    setpagenation({
                        current: page,
                        pageSize: 10,
                        total: res.count,
                    });
                })
                .catch((err) => {
                    message.warning(err.message);
                });
        }
        let keysList=Array.from(selectedRowKeysContainer.keys());
        //如果不存在这个page
        if (!(keysList.includes(page))) {
            // console.log("不存在"+page);
            let tempmap = selectedRowKeysContainer;
            tempmap.set(page, []);
            let tempmap2 = selectedRowAssetsContainer;
            tempmap2.set(page, []);
            setSRKC(tempmap);
            setSelectedRowKeys([]);
        } //反之存在这个page
        else {
            // console.log("存在"+page);
            let templist = selectedRowKeysContainer.get(page);
            if (templist!=null) {
                setSelectedRowKeys(templist);
            }
            else {
                setSelectedRowKeys([]);
            }
        }
    };

    return (
        <>
            <div
                style={{
                    margin: 20,
                }}
            >
                <QueryFilter
                    labelWidth="auto"
                    onReset={() => {
                        setcheck(false);
                        setquery(emptyquery);
                    }}
                    onFinish={async (values) => {
                        setcheck(true);
                        //构造查询参数
                        let tmp_query: AssetQueryType = {};
                        tmp_query.parent = (values.parent != undefined) ? values.parent : "";
                        tmp_query.assetclass = (values.assetclass != undefined) ? values.assetclass : "";
                        tmp_query.name = (values.name != undefined) ? values.name : "";
                        tmp_query.belonging = (values.belonging != undefined) ? values.belonging : "";
                        tmp_query.from = (values.date != undefined) ? Date.parse(values.date[0]) / 1000 : 0;
                        tmp_query.to = (values.date != undefined) ? Date.parse(values.date[1]) / 1000 : 0;
                        tmp_query.user = (values.user != undefined) ? values.user : "";
                        tmp_query.status = (values.status != undefined) ? values.status : -1;
                        tmp_query.pricefrom = (values.price != undefined) ? values.price[0] : 0;
                        tmp_query.priceto = (values.price != undefined) ? values.price[1] : 0;
                        tmp_query.custom = (values.cusfeature != undefined) ? values.cusfeature : "";
                        tmp_query.content = (values.cuscontent != undefined) ? values.cuscontent : "";
                        setquery(tmp_query);
                        //发送查询请求，注意undefined的情况
                        request("/api/user/ep/queryasset", "POST",
                            {
                                parent: (values.parent != undefined) ? values.parent : "",
                                assetclass: (values.assetclass != undefined) ? values.assetclass : "",
                                name: (values.name != undefined) ? values.name : "",
                                belonging: (values.belonging != undefined) ? values.belonging : "",
                                from: (values.date != undefined) ? Date.parse(values.date[0]) / 1000 : 0,
                                to: (values.date != undefined) ? Date.parse(values.date[1]) / 1000 : 0,
                                user: (values.user != undefined) ? values.user : "",
                                status: (values.status != undefined) ? values.status : -1,
                                pricefrom: (values.price != undefined) ? values.price[0] : 0,
                                priceto: (values.price != undefined) ? values.price[1] : 0,
                                custom: (values.cusfeature != undefined) ? values.cusfeature : "",
                                content: (values.cuscontent != undefined) ? values.cuscontent : "",
                                page: 1,
                            })
                            .then((res) => {
                                setAssets(res.data);
                                setpagenation({
                                    current: 1,
                                    pageSize: 10,
                                    total: res.count,
                                });
                                message.success("查询成功");
                            }).catch((err) => {
                                message.warning(err.message);
                            });
                    }
                    }
                >
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="name"
                            label="资产名称"
                            placeholder="请输入名称"
                        />
                        <ProFormSelect
                            options={[
                                {
                                    value: 0,
                                    label: "全部闲置",
                                },
                                {
                                    value: 1,
                                    label: "被全部占用",
                                },
                                {
                                    value: 2,
                                    label: "全部维保中",
                                },
                                {
                                    value: 3,
                                    label: "需要清退",
                                },
                                {
                                    value: 4,
                                    label: "被部分占用",
                                },
                                {
                                    value: 5,
                                    label: "部分维保中",
                                },
                            ]}
                            width="xs"
                            name="status"
                            label="资产状态"
                        />
                        <ProFormDateRangePicker
                            width="md"
                            name="date"
                            label="资产创建时间"
                        />
                        <ProFormText
                            width="md"
                            name="parent"
                            label="上级资产名称"
                            initialValue={""}
                        />
                        <ProFormSelect
                            options={assetclasslist}
                            width="md"
                            name="assetclass"
                            label="资产类别"
                        />

                        <ProFormText
                            width="md"
                            name="belonging"
                            label="资产挂账人"
                        />
                        <ProFormText
                            width="md"
                            name="user"
                            label="当前使用者"
                        />
                        <ProFormDigitRange
                            width="xs"
                            name="price"
                            label="资产价值区间"
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <div>
                            <ProFormSelect
                                options={customfeatureList}
                                width="xs"
                                name="cusfeature"
                                label="自定义属性"
                            />
                            <ProFormText
                                width="md"
                                name="cuscontent"
                                placeholder="请输入属性详细"
                            />
                        </div>
                    </ProForm.Group>
                </QueryFilter>
            </div>
            <ProList<Asset>
                pagination={{
                    current: pagenation.current,
                    pageSize: pagenation.pageSize,
                    onChange: handleFetch,
                    total: pagenation.total
                }}
                metas={{
                    title: { dataIndex: "name" },
                    description: {
                        render: (_, row) => {
                            return (
                                <div>
                                    {row.description == "" ? "暂无描述" : row.description}
                                </div>
                            );
                        }
                    },
                    avatar: {},
                    extra: {},
                    actions: {
                        render: (_, row) => {
                            return (
                                <Button type="link" onClick={() => {
                                    request("/api/asset/getdetail", "GET", {
                                        id: row.key
                                    }).then((res) => {
                                        res.data.create_time *= 1000;
                                        res.data.key = row.key;
                                        if (res.data.type == false) {
                                            res.data.number_idle = res.data.status == 0 ? 1 : 0;
                                            if (res.data.user != null) res.data.userlist = [{ key: res.data.user, name: res.data.user, number: 1 }];
                                        } else {
                                            res.data.userlist = [];
                                            res.data.userlist = res.data.usage.map((item) => {
                                                return Object.entries(item).map(([key, value]) => {
                                                    return { key: key, name: key, number: value };
                                                })[0];
                                            });
                                        }
                                        if (res.data.haspic == true)
                                            res.data.imageurl = client.signatureUrl(res.data.entity + "/" + res.data.department + "/" + res.data.name);
                                        setDisplay(res.data);
                                        setIsDetailOpen(true);
                                    }).catch((err) => {
                                        message.warning(err.message);
                                    });
                                }}>
                                    查看及修改资产信息
                                </Button>
                            );
                        },
                    },
                }}
                rowKey="key"
                headerTitle="资产列表"
                rowSelection={rowSelection}
                dataSource={assets}
                toolBarRender={() => {
                    return [
                        <div key={"tool"}>
                            <Button key="2" type="primary" onClick={change_asset} disabled={!getHasSelected()}>
                                调拨选中资产
                            </Button>
                            <Button key="1" onClick={handleoutput} loading={outputloading} >
                                导出部门内所有资产
                            </Button>
                        </div>
                    ];
                }}
            />
            <DisplayModel isOpen={isDetailOpen} onClose={() => { setIsDetailOpen(false); }} content={displaydata} />
            <MoveAsset isOpen={isMoveOpen} onClose={() => { setIsMoveOpen(false); }} content={selectedAssets}></MoveAsset>
        </>
    );
}
);

export default DelAsset;