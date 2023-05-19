import { useState } from "react";
import { useEffect } from "react";
import { request } from "../../utils/network";
import { Button, Spin, message} from "antd";
import {  ProColumns, ProList, ProTable } from "@ant-design/pro-components";

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
    const [isSpinning,setIsSpinning]=useState<boolean>(false);
    //初始化获取需要清退的资产
    useEffect(() => {
        setIsSpinning(true);
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
        setTimeout(() => {
            setIsSpinning(false);
        }, 500);
    }, []);

    //选择后的处理
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };

    //给后端发请求清退对应的asset
    const clear_asset = (() => {
        setIsSpinning(true);
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
        setTimeout(() => {
            setIsSpinning(false);
        }, 500);
    });

    const columns: ProColumns<AssetDisplayType>[] = [
        {
            title: "资产编号",
            width: 80,
            dataIndex: "key",
            ellipsis: true,
            hideInSearch: true,
        },
        {
            title: "资产名称",
            width: 80,
            dataIndex: "assetname",
            ellipsis: true,
            hideInSearch: true,
        },
        {
            title: "资产类别",
            width: 80,
            dataIndex: "assetclass",
            ellipsis: true,
            hideInSearch: true,
        },
        {
            title: "所属部门",
            width: 80,
            dataIndex: "department",
            ellipsis: true,
            hideInSearch: true,
        },
        {
            title: "资产数量",
            width: 80,
            dataIndex: "number",
            ellipsis: true,
            hideInSearch: true,
        },
    ];

    //是否有选中的清退资产
    const hasSelected = selectedRowKeys.length > 0;

    return (
        <>
            <Spin spinning={isSpinning}>
                <ProTable<AssetDisplayType>
                    bordered={true}
                    pagination={{ pageSize: 10 }}
                    options={{ reload: false }}
                    search={false}
                    rowKey="key"
                    columns={columns}
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
            </Spin>
        </>);
});

export default ClearAsset;