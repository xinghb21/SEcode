import { ModalForm, ProForm, ProFormDigit, ProFormMoney, ProFormText, ProList } from "@ant-design/pro-components";
import { Button, Table, message } from "antd";
import React, { useState } from "react";
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
    addtional?: string;
    type?: boolean;

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

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    };

    const hasSelected = selectedRowKeys.length > 0;

    const onSubmit = (() => {
        //与后端交互，实现批量添加
        request("/api/asset/post", "POST", assets)
            .then((res) => {
                message.success("提交成功");
            })
            .catch((err) => {
                message.error(err);
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
                        addtional: "",
                        
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
                    <ProFormText
                        name="category"
                        width="md"
                        label="资产类别"
                        placeholder="请输入类别"
                        rules={[{ required: true, message: "请输入类别！" }]}
                    />
                    <ProFormText
                        name="parent"
                        width="md"
                        label="上级资产名称"
                        placeholder="请输入名称"
                    />
                    <ProFormDigit
                        label="资产使用年限"
                        name="life"
                        initialValue={0}
                        rules={[{ required: true, message: "请输入使用年限！" }]}
                        min={0}
                    />
                    <ProFormDigit
                        label="资产数量(条目型默认为1 输入无效)"
                        name="number"
                        rules={[{ required: true, message: "请输入数量！" }]}
                        initialValue={1}
                        min={0}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormMoney
                        label="资产价值"
                        name="price"
                        locale="￥"
                        initialValue={0}
                        min={0}
                        rules={[{ required: true, message: "请输入资产价值！" }]}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormText
                        width="md" 
                        name="belonging" 
                        label="挂账人" 
                    />
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