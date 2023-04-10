import { useState } from "react";
import { Modal, Input, Button, message, Form } from "antd";
import React from "react";
import { ModalForm, ProForm, ProFormDateRangePicker, ProFormDigit, ProFormMoney, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { PlusOutlined } from "@ant-design/icons"
import { request } from '../../utils/network';

interface Assert{

    key: React.Key;
    assertname: string;
    person?: string;
    department?: string;
    parent?: string;
    child?: string;
    status?: string;
    category: string;
    description?: string;
    type: boolean;
    number?: Number;
    addtion?: string;

}

interface DialogProps{
    onCreateAssert: (assert: Assert) => void;
}

const CreateAssert = (props: DialogProps) =>{

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
                trigger={
                    <Button type="primary">
                        <PlusOutlined />
                        添加资产
                    </Button>
                }
                onFinish={async (values: any) => {
                    const assert : Assert = {
                        key : values.assertname,
                        assertname: values.assertname,
                        category : values.category,
                        type: values.type,
                    }
                    // request("/api/asset/post", "POST",
                    //     {
                    //         key : assert.assertname,
                    //         assertname: assert.assertname,
                    //         category : assert.category,
                    //         type: assert.type,
                    //     })
                    //     .then((res) => {
                    //         props.onCreateAssert(assert);
                    //         message.success("创建成功");
                    //     })
                    //     .catch((err) => {
                    //         alert(err.detail);
                    //     })
                    return true;
                }}
                >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="assertname"
                        label="资产名称"
                        tooltip="最长为 128 位"
                        placeholder="请输入名称"
                        required
                    />
                    <ProFormText 
                        width="md" 
                        name="description" 
                        label="资产描述" 
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
                        name="parent"
                        width="md"
                        label="上级资产名称"
                        placeholder="请输入名称"
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
                </ProForm.Group>
                <ProFormText
                    width="md" 
                    name="belonging" 
                    label="挂账人" 
                />
                 {/* <ProFormText
                    name="text"
                    label="文本框"
                    dependencies={["type"]}
                    hidden={(form.getFieldValue("type") === 1)}
                /> */}
            </ModalForm>
        </div>
        
    );
};
export default CreateAssert;