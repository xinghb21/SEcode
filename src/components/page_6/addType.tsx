import React, { useEffect, useState } from "react";
import { request } from "../../utils/network";
import { Button, Table, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { ModalForm, ProForm, ProFormText, ProFormDigit, ProFormMoney } from "@ant-design/pro-components";

interface Type {
    key: React.Key,
    info: string,
}

const columns: ColumnsType<Type> = [
    {
        title: "已定义属性",
        dataIndex: "info",
    },
];

const AddType = () => {

    const [types, setType] = useState<Type[]>([]);

    //从后端获取部门对应的所有自定义属性
    useEffect(() => {
        request("/api/asset/attributes", "GET")
            .then((res) => {
                let typelist: Type[] = [];
                for(let i = 0; i < res.info.length; i++) {
                    let tmp_type: Type = {
                        key: res.info[i],
                        info: res.info[i],
                    };
                    typelist.push(tmp_type);
                }
                setType(typelist);
            })
            .catch((err) => {
                message.warning(err.message);
            });
    }, []);

    return (
        <>
            <div style={{margin: 24}}>
                <ModalForm
                    autoFocusFirstInput
                    modalProps={{
                        destroyOnClose: true,
                    }}
                    trigger={
                        <Button type="primary">
                            <PlusOutlined />
                        添加资产属性
                        </Button>
                    }
                    onFinish={async (values: any) => {
                        const label: Type = {
                            key: values.info,
                            info: values.info,
                        };
                        //与后端实现添加属性
                        request("/api/asset/createattributes", "POST", {
                            name: values.info
                        })
                            .then((res) => {
                                setType([...types, label]);
                                message.success("创建成功");
                            })
                            .catch((err) => {
                                message.warning(err.message);
                            });
                        return true;
                    }}
                >
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="info"
                            label="属性名称"
                            placeholder="请输入名称"
                            required
                        />
                    </ProForm.Group>
                </ModalForm>
                <div style={{marginTop: 24}}>
                    <Table columns={columns} dataSource={types} />
                </div>
            </div>
            
        </>
        
    );
};

export default AddType;