import { ModalForm, ProForm, ProFormDigit, ProFormMoney, ProFormSelect, ProFormText, ProList } from "@ant-design/pro-components";
import { Button, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { request } from "../../utils/network";
import type { ColumnsType } from "antd/es/table";

interface Asset{

    key: React.Key;
    name: string;
    description?: string;
    category: string;
    parent?: string;
    life: Number;
    number?: Number;
    price: Number;
    belonging?: string;
    addtional?: Object;
    type?: boolean;

}

interface Props {
    strList: string[];
}

interface Addition {

    key: string;
    value: string;

}

const columns: ColumnsType<Asset> = [
    {
        title: "待提交资产",
        dataIndex: "name",
    },
    {
        title: "资产描述",
        dataIndex: "description",
    },
];

const AddAsset = () => {

    const [assets, setAsset] = useState<Asset[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [labels, setLabel] = useState<string[]>([]);
    const [addition, setAddition] = useState<string[]>([]);

    // let addition: string[] = [];
    let additions: Addition[] = [];

    useEffect(() => {
        request("/api/asset/assetclass", "GET")
            .then((res) => {
                setLabel(res.data);
            })
            .catch((err) => {
                message.warning(err);
            });
        request("/api/asset/attributes", "GET")
            .then((res) => {
                setAddition(res.info);
            })
            .catch((err) => {
                message.warning(err);
            });
    }, []);

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };
      
    const StrListToProFormText: React.FC<Props> = ({ strList }) => {
        return (
            <>
                {strList.map((str, index) => (
                    <ProFormText key={index} name={str} label={str} />
                ))}
            </>
        );
    };

    const hasSelected = selectedRowKeys.length > 0;

    const onSubmit = (() => {
        //与后端交互，实现批量添加

        const newAssets = assets.filter(item => !selectedRowKeys.includes(item.key));
        const selectedAssert = selectedRowKeys.map(key => {
            const item = assets.find(data => data.key === key);
            return item;
        });

        request("/api/asset/post", "POST", selectedAssert)
            .then((res) => {
                setAsset(newAssets);
                message.success("提交成功");
            })
            .catch((err) => {
                message.warning(err);
            });
    });

    return (
        <div style={{margin: 24}}>
            <ModalForm
                autoFocusFirstInput
                modalProps={{
                    destroyOnClose: true,
                }}
                trigger={
                    <Button type="primary">
                        <PlusOutlined />
                        添加资产
                    </Button>
                }
                onFinish={async (values: any) => {
                    additions.splice(0);
                    for(let i = 0; i < addition.length; i++) {
                        additions.push({key: addition[i], value: values[addition[i]]});
                    }
                    const asset : Asset = {

                        key : values.assetname,
                        name: values.assetname,
                        description: values.description,
                        category: values.category,
                        parent: values.parent,
                        life: values.life,
                        price: values.price,
                        number: values.number,
                        belonging: values.belonging,
                        addtional: additions,
                        
                    };
                    setAsset([...assets, asset]);

                    return true;
                }}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="assetname"
                        label="资产名称"
                        tooltip="最长为 128 位"
                        placeholder="请输入名称"
                        rules={[{ required: true, message: "请输入名称！" }]}
                    />
                    <ProFormText 
                        width="md" 
                        name="description" 
                        label="资产描述" 
                        initialValue={""}
                        placeholder="请输入描述" 
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormSelect
                        options={labels}
                        width="xs"
                        name="category"
                        label="资产类别"
                        rules={[{ required: true, message: "请选择类别！" }]}
                    />
                    <ProFormText
                        name="parent"
                        width="md"
                        label="上级资产名称"
                        placeholder="请输入名称"
                        initialValue={""}
                    />
                    <ProFormDigit
                        label="资产使用年限"
                        name="life"
                        rules={[{ required: true, message: "请输入使用年限！" }]}
                        min={0}
                    />
                    <ProFormDigit
                        label="资产数量(条目型默认为1 输入无效)"
                        name="number"
                        rules={[{ required: true, message: "请输入数量！" }]}
                        min={0}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormMoney
                        label="资产价值"
                        name="price"
                        locale="￥"
                        min={0}
                        rules={[{ required: true, message: "请输入资产价值！" }]}
                    />
                    <ProFormText
                        width="md" 
                        name="belonging" 
                        label="挂账人" 
                        initialValue={""}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <StrListToProFormText strList={addition}/>
                </ProForm.Group>
            </ModalForm>
            <div style={{marginTop: 24}}>
                <Table rowSelection={rowSelection} columns={columns} dataSource={assets} />
                <Button type="primary" onClick={onSubmit} disabled={!hasSelected}>
                    提交
                </Button>
            </div>
        </div>
    );
};

export default AddAsset;