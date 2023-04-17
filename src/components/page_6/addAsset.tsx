import { ModalForm, ProForm, ProFormDigit, ProFormMoney, ProFormSelect, ProFormText, ProList } from "@ant-design/pro-components";
import { Button, Form, Input, Table, Upload, UploadProps, message } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { request } from "../../utils/network";
import type { ColumnsType } from "antd/es/table";
import CryptoJS from 'crypto-js';
import Base64 from 'base-64';

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

const host = "/image";
const accessKeyId = "LTAI5t7ktfdDQPrsaDua9HaG";
const accessSecret = "z6KJp2mQNXioRZYF0jkIvNKL5w8fIz";
const policyText = {
    "expiration": "2028-01-01T12:00:00.000Z", // 设置该Policy的失效时间，
    "conditions": [
      ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
    ]
};
const policyBase64 = Base64.encode(JSON.stringify(policyText))
const bytes = CryptoJS.HmacSHA1(policyBase64, accessSecret, { asBytes: true });
const signature = bytes.toString(CryptoJS.enc.Base64); 


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

const props: UploadProps = {
    beforeUpload: (file) => {
        const isImg = (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg');
        if (!isImg) {
            message.error(`${file.name} is not an image`);
        }
        return isImg || Upload.LIST_IGNORE;
    },
};

const AddAsset = () => {

    const [assets, setAsset] = useState<Asset[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [labels, setLabel] = useState<string[]>([]);
    const [addition, setAddition] = useState<string[]>([]);
    const [imagename, setImage] = useState<string>("");
  
    // let addition: string[] = [];
    let additions: Addition[] = [];
    let department: string = "";
    let entity: string = "";

    useEffect(() => {
        request("/api/asset/assetclass", "GET")
            .then((res) => {
                setLabel(res.data);
            })
            .catch((err) => {
                alert(err);
            });
        request("/api/asset/attributes", "GET")
            .then((res) => {
                setAddition(res.info);
            })
            .catch((err) => {
                alert(err);
            });
        request("/api/asset/getbelonging", "GET")
            .then((res) => {
                department = res.department;
                entity = res.entity;
            })
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
            .then(() => {
                setAsset(newAssets);
                message.success("提交成功");
            })
            .catch((err) => {
                alert(err);
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
                <ProForm.Group>
                    <Upload 
                        {...props}
                        action={host}
                        accept="image/*"
                        maxCount={1}
                        onChange={(info) => {
                            if(info.file.status == "done")
                                setImage(info.file.name);
                            if(info.file.status == "removed")
                                setImage("");
                        }}
                        data={{
                            key: "${entity}/${department}/${filename}",
                            policy: policyBase64,
                            OSSAccessKeyId: accessKeyId,
                            success_action_status: 200,
                            signature,
                        }}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
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