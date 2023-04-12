import { useState } from "react";
import { Modal, Input, Button, message, Form } from "antd";
import React from "react";
import { ModalForm, ProForm, ProFormDateRangePicker, ProFormDigit, ProFormMoney, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { PlusOutlined } from "@ant-design/icons";
import { request } from "../../utils/network";

interface Asset{

    key: React.Key;
    name: string;
    person?: string;
    department?: string;
    parent?: string;
    child?: string;
    status?: Number;
    category: string;
    description?: string;
    number?: Number;
    price: Number;
    addtion?: string;

}

interface DialogProps{
    onCreateAsset: (asset: Asset) => void;
}

const CreateAsset = (props: DialogProps) =>{

    const [form] = Form.useForm();

    return (
        <div
            style={{
                margin: 24,
            }}
        >
            <ModalForm
                form={form}
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
                        category : values.category,
                        price: values.price,
                        number: values.number,
                        description: values.description,
                        status: 0,
                    };
                    request("/api/asset/post", "POST",
                        {
                            name: asset.name,
                            category : asset.category,
                            price: asset.price,
                            number: asset.number,
                            description: values.description,
                        })
                        .then((res) => {
                            props.onCreateAsset(asset);
                            message.success("创建成功");
                        })
                        .catch((err) => {
                            alert(err);
                            message.warning(err);
                        });
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
                        required
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
                        required
                    />
                    <ProFormText
                        name="parent_category"
                        width="md"
                        label="资产类别的上级类别"
                        placeholder="请输入类别"
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
                        min={0}
                    />
                    <ProFormDigit
                        label="资产数量(条目型默认为1 输入无效)"
                        name="number"
                        required
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
                    />
                    <ProFormDigit
                        label="资产使用年限"
                        name="life"
                        initialValue={0}
                        min={0}
                    />

                </ProForm.Group>
                <ProFormText
                    width="md" 
                    name="belonging" 
                    label="挂账人" 
                />
            </ModalForm>
        </div>
        
    );
};
export default CreateAsset;