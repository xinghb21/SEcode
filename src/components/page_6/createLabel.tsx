import { useState } from "react";
import { Modal, Input, Button, message, Form } from "antd";
import React from "react";
import { ModalForm, ProForm, ProFormDateRangePicker, ProFormDigit, ProFormMoney, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { PlusOutlined } from "@ant-design/icons";
import { request } from "../../utils/network";

interface Label{

    key: React.Key;
    labelname: string;
    parent?: string;
    type: boolean;

}

const CreateLabel = () =>{

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
                        添加资产类别
                    </Button>
                }
                onFinish={async (values: any) => {
                    const label : Label = {
                        key : values.labelname,
                        labelname: values.labelname,
                        type: values.type,
                        parent: values.parent,
                    };
                    request("/api/asset/assetclass", "POST",
                        {
                            key : label.labelname,
                            name: label.labelname,
                            type: label.type,
                            parent: label.parent,
                        })
                        .then((res) => {
                            message.success("创建成功");
                        })
                        .catch((err) => {
                            message.warning(err);
                        });
                    return true;
                }}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="labelname"
                        label="类别名称"
                        tooltip="最长为 128 位"
                        placeholder="请输入名称"
                        required
                    />
                    <ProFormSelect
                        options={[
                            {
                                value: 0,
                                label: "数量型",
                            },
                            {
                                value: 1,
                                label: "条目型",
                            },
                        ]}
                        width="xs"
                        name="type"
                        required
                        label="资产属性"
                    />
                    <ProFormText
                        name="parent"
                        width="md"
                        label="上级类别名称"
                        placeholder="请输入名称"
                    />
                </ProForm.Group>
            </ModalForm>
        </div>
        
    );
};
export default CreateLabel;