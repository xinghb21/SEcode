import { useState } from "react";
import { useEffect } from "react";
import { request } from "../../utils/network";
import { Button, message} from "antd";
import {  ProList } from "@ant-design/pro-components";

interface AssetDisplayType {
    //table数据的格式
    key: React.Key;//资产的编号
    assetname: string;//资产的名称
    assetclass: string;//资产的类型
    department: string;//资产所属部门
    number: number;//资产数量
}

const ClearAsset = (() => {
    const [assetList, setAlist] = useState<AssetDisplayType[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    useEffect(() => {
        request("/api/user/ep/assetstbc", "GET")
            .then((res) => {
                setAlist(res.info.map((item) => {
                    return {
                        key: item.id,
                        assetname: item.assetname,
                        assetclass: item.assetclass,
                        department: item.department,
                        number: item.number,
                    };
                }));
            })
            .catch((err) => {
                message.warning(err.message);
            });
    }, []);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };
    //给后端发请求清退对应的asset
    const clear_asset = (() => {

        const newAssets = assetList.filter(item => !selectedRowKeys.includes(item.key));

        const selectedNames = selectedRowKeys.map(key => {
            const item = assetList.find(data => data.key === key);
            return item ? item.assetname : "";
        });

        request("/api/user/ep/assetclear", "POST", 
            { 
                name: selectedNames 
            })
            .then(() => {
                setAlist(newAssets);
                message.success("成功清退");
                setSelectedRowKeys([]);
            })
            .catch((err) => {
                message.warning(err.message);
            });
    });

    const hasSelected = selectedRowKeys.length > 0;

    return (
        <>
            <ProList<AssetDisplayType>

                pagination={{ pageSize: 10 }}
                metas={{
                    title: { dataIndex: "assetname" },
                    description: {
                        render: (_, row) => {
                            return (
                                <>
                                    <div>
                                        资产类型{row.assetclass}
                                    </div>
                                    <div>
                                        资产编号{row.key}
                                    </div>
                                    <div>
                                        所属部门{row.department}
                                    </div>
                                    <div>
                                        资产数量{row.number}
                                    </div>

                                </>
                            );
                        }
                    },
                    avatar: {},
                    extra: {},
                    actions: {},
                }}
                rowKey="key"
                headerTitle="需清退资产"
                rowSelection={rowSelection}
                dataSource={assetList}
                toolBarRender={() => {
                    return [
                        <Button key="2" type="default" danger={true} onClick={clear_asset} disabled={!hasSelected}>
                            清退选中资产
                        </Button>
                    ];
                }}
            />
        </>);
});

export default ClearAsset;