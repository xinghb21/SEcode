import { EditableProTable, ProColumns, ProDescriptions } from "@ant-design/pro-components";
import { Button,Form,Input,message, Modal, Table, Tag } from "antd";
import { request } from "../../utils/network";
import { useEffect, useState } from "react";
import { set } from "js-cookie";

interface ModelProps {
    isOpen: boolean;
    onClose: () => void;
    content: AssetDisplayType;
}

type AdditionalDataType = {
    id: string;
    label: string;
    value: string;
}

const columns: ProColumns<AdditionalDataType>[] = [
    {
        title: "属性名",
        dataIndex: "label",
        width: "30%",
        editable: false,
    },
    {
        title: "属性值",
        dataIndex: "value",
        width: "70%",
        valueType: "text",
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: "此项为必填项",
                },
            ],
        },
    },
];

type AssetDisplayType = {
    //table数据的格式
    key: React.Key;//资产的编号
    name: string;//资产的名称
    parent?: string;//父资产的名称
    username: string[];//使用者的名字
    category: string;//资产的类型
    description: string;//资产描述
    create_time: number;//创建时间
    price: number;//资产原始价值
    life: number;//资产使用年限
    belonging: string;//挂账人
    number_idle: number;//闲置数量
    additional: Record<string, string>;//附加信息
}


const DisplayModel = (props: ModelProps) => {

    const [editRowKeys, seteditRowKeys] = useState<React.Key[]>([]);
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(()=>{
        return Object.entries(props.content.additional).map((item) => {
            return (item[0]);
        });
    });
    const [dataSource, setDataSource] = useState<readonly AdditionalDataType[]>(() =>
        Object.entries(props.content.additional).map((item) => {
            return {
                id: item[0],
                label: item[0],
                value: item[1],
            };
        }));
    const [form] = Form.useForm();

    let assetDisplay: AssetDisplayType = props.content;

    useEffect(() => {
        setDataSource(Object.entries(props.content.additional).map((item) => {
            return {
                id: item[0],
                label: item[0],
                value: item[1],
            };
        }));
        setEditableRowKeys(Object.entries(props.content.additional).map((item) => {
            return (item[0]);
        }));
    }, [props.content]);

    const handleOk = () => {
        
        if(editRowKeys == null || editRowKeys.length == 0) {
            let addition = {};
            dataSource.forEach((item) => {
                addition[item.label] = item.value;
            });
            if(assetDisplay.parent == null || assetDisplay.parent == "暂无上级资产") {
                request("/api/user/ep/modifyasset", "POST", 
                    {
                        name: assetDisplay.name,
                        number: assetDisplay.number_idle,
                        description: assetDisplay.description,
                        additional: addition,
                    })
                    .then((res) => {
                        message.success("修改成功");
                        props.onClose();
                    }).catch((err) => {
                        message.error(err.message);
                    });
            } else {
                request("/api/user/ep/modifyasset", "POST",
                    {
                        name: assetDisplay.name,
                        number: assetDisplay.number_idle,
                        description: assetDisplay.description,
                        additional: addition,
                        parent: assetDisplay.parent,
                    })
                    .then((res) => {
                        message.success("修改成功");
                        props.onClose();
                    }).catch((err) => {
                        message.error(err.message);
                    });
            }
        } else {
            message.warning("请确认修改");
        }
    };

    return (
        <Modal
            open={props.isOpen}
            onCancel={props.onClose}
            footer={[
                <Button key="back" onClick={handleOk}>
                    确认
                </Button>
            ]}
        >
            <ProDescriptions<AssetDisplayType>
                column={2}
                title={props.content.name}
                dataSource={assetDisplay}
                
                editable={{

                    onChange(editableKeys, editableRows) {
                        seteditRowKeys(editableKeys);
                    },

                    onSave: async (key, row) => {

                        assetDisplay.parent = row.parent;
                        assetDisplay.number_idle = row.number_idle;
                        assetDisplay.description = row.description;
                        assetDisplay.additional = row.additional;
                    
                    }
                }}
                columns={[
                    {
                        title: "资产编号",
                        dataIndex: "key",
                        key: "key",
                        valueType: "text",
                        editable: false,
                    },
                    {
                        title: "资产名称",
                        dataIndex: "name",
                        key: "name",
                        valueType: "text",
                        editable: false,
                    },
                    {
                        title: "父资产",
                        dataIndex: "parent",
                        key: "parent",
                        valueType: "text",
                    },
                    {
                        title: "挂账人",
                        dataIndex: "belonging",
                        key: "belonging",
                        valueType: "text",
                        editable: false,
                    },
                    {
                        title: "使用者",
                        dataIndex: "username",
                        key: "username",
                        valueType: "text",
                        editable: false,
                    },
                    {
                        title: "资产使用年限",
                        dataIndex: "life",
                        key: "life",
                        valueType: "digit",
                        editable: false,
                    },
                    {
                        title: "资产类型",
                        dataIndex: "category",
                        key: "category",
                        valueType: "text",
                        editable: false,
                    },
                    {
                        title: "资产数量",
                        dataIndex: "number_idle",
                        key: "number_idle",
                        valueType: "digit",
                    },
                    {
                        title: "资产描述",
                        dataIndex: "description",
                        key: "description",
                        valueType: "text",
                    },
                    {
                        title: "创建时间",
                        dataIndex: "create_time",
                        key: "create_time",
                        valueType: "dateTime",
                        editable: false,
                    },
                    {
                        title: "资产原始价值",
                        dataIndex: "price",
                        key: "price",
                        valueType: "money",
                        editable: false,
                    },
                ]}
            />
            <EditableProTable<AdditionalDataType>
                headerTitle="自定义属性"
                columns={columns}
                rowKey="id"
                value={dataSource}
                onChange={setDataSource}
                recordCreatorProps={false}
                editable={{
                    type: "multiple",
                    editableKeys,
                    actionRender: (row, config, defaultDoms) => {
                        return [defaultDoms.delete];
                    },
                    onValuesChange: (record, recordList) => {
                        setDataSource(recordList);
                    },
                    onChange: setEditableRowKeys,
                }}
            />
        </Modal>
    );
};
export default DisplayModel;