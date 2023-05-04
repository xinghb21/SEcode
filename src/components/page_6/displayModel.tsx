import { ProDescriptions } from "@ant-design/pro-components";
import { Button,message, Modal } from "antd";
import { request } from "../../utils/network";
import { useState } from "react";
interface ModelProps {
    isOpen: boolean;
    onClose: () => void;
    content: AssetDisplayType;
}

type AssetDisplayType = {
    //table数据的格式
    key: React.Key;//资产的编号
    name: string;//资产的名称
    parent?: string;//父资产的名称
    username: string[];//使用者的名字
    category: string;//资产的类型
    description: string;//资产描述
    create_time: string;//创建时间
    price: number;//资产原始价值
    life: number;//资产使用年限
    belonging: string;//挂账人
    additional: string;//附加信息
    number_idle: number;//闲置数量
}

type AssetChangeType = {
    name: string;//资产的名称
    parent?: string;//父资产的名称
    number: number;//闲置数量
    description: string;//资产描述
    additional: string;//附加信息
}  

const DisplayModel = (props: ModelProps) => {

    const [editRowKeys, seteditRowKeys] = useState<React.Key[]>([]);

    const [assetChange, setAssetChange] = useState<AssetChangeType>({
        name: props.content.name,
        parent: props.content.parent,
        number: props.content.number_idle,
        description: props.content.description,
        additional: props.content.additional,
    });

    let assetDisplay: AssetDisplayType = props.content;

    const handleOk = () => {
        request("/api//user/ep/modifyasset", "POST", assetChange)
            .then((res) => {
                message.success("修改成功");
                props.onClose();
            }).catch((err) => {
                message.error(err.message);
            })
    }

    const rowSelection = {
        editRowKeys,
        onChange: (keys: React.Key[]) => seteditRowKeys(keys),
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
                    
                    onSave: async (key, row) => {

                        assetDisplay.parent = row.parent;
                        assetDisplay.number_idle = row.number_idle;
                        assetDisplay.description = row.description;
                        assetDisplay.additional = row.additional;
                        
                        if(row.parent == null) {
                            setAssetChange({
                                name: row.name,
                                number: row.number_idle,
                                description: row.description,
                                additional: row.additional,
                            });
                        } else {
                            setAssetChange({
                                name: row.name,
                                parent: row.parent,
                                number: row.number_idle,
                                description: row.description,
                                additional: row.additional,
                            });
                        }
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
                        title: "自定义属性",
                        dataIndex: "addtional",
                        key: "addtional",
                        valueType: "jsonCode",
                    },
                ]}
            />
        </Modal>
    );
};
export default DisplayModel;