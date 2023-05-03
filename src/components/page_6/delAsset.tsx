import { Button, message } from "antd";
import React from "react";
import { ProFormDateRangePicker, ProFormDigitRange, ProList} from "@ant-design/pro-components";
import { useState } from "react";
import {useEffect} from "react";
import { request } from "../../utils/network";
import {
    ProForm,
    ProFormSelect,
    ProFormText,
    QueryFilter,
} from "@ant-design/pro-components";
import DetailInfo from "./detailInfo";
import { set } from "js-cookie";

interface Asset{

    key: React.Key;
    name: string;
    person?: string;
    department?: string;
    parent?: string;
    child?: string;
    category: string;
    description?: string;
    number?: Number;
    addtion?: Object;
    status?: Number;
    type?: boolean;

}

const DelAsset = ( () => {

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [assetname, setName] = useState<string>("");

    useEffect(() => {
        request("/api/asset/get", "GET")
            .then((res) => {
                setAssets(res.data);
            })
            .catch((err) => {
                message.warning(err.message);
            });
    }, []);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };


    //给后端发请求删除对应的asset
    const delete_asset = (() => {

        const newAssets = assets.filter(item => !selectedRowKeys.includes(item.key));
        
        const selectedNames = selectedRowKeys.map(key => {
            const item = assets.find(data => data.key === key);
            return item ? item.name : "";
        });
        
        request("/api/asset/delete", "DELETE", selectedNames)
            .then(() => {
                setAssets(newAssets);
                message.success("删除成功");
                setSelectedRowKeys([]);
            })
            .catch((err) => {
                message.warning(err.message);
            });
    });

    const hasSelected = selectedRowKeys.length > 0;

    return (
        <div> 
            <DetailInfo isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} name={assetname} />
            <ProList<Asset>
                pagination = {{pageSize: 10}}
                metas = {{
                    title: {dataIndex:"name"},
                    description: {
                        render: (_,row) => {
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
                        render: (_,row) => {
                            return (
                                <Button type="link" onClick={() => {setIsDetailOpen(true); setName(row.name);}}>
                                    修改信息
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
                        <Button key="2" type="default" danger={true} onClick = {delete_asset} disabled = {!hasSelected}> 
                            删除选中资产
                        </Button>
                    ];
                }}
            />
        </div>
    );
}
);

export default DelAsset;