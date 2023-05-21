import { ModalForm, ProForm, ProFormDateRangePicker, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Form, Button, message, Modal, Input, Table, InputNumber } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import { request } from "../../utils/network";

const { TextArea } = Input;

interface Assets {
    key: React.Key;
    assetname: string;
}

interface MoveAssetType {
    id: React.Key;
    assetname: string;
    assetnumber: number;
}

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    content: Assets[];
}

const MoveAsset = (props: DialogProps) => {

    const [reason, setReason] = useState<string>("");
    const [department, setDepartment] = useState<string>("");
    const [assetType, setAssetType] = useState<MoveAssetType[]>([]);
    const [ okloading , setokloading] = useState<boolean>(false);
    let assetTypes: MoveAssetType[] = props.content.map((item) => {
        return {
            id: item.key,
            assetname: item.assetname,
            assetnumber: assetType.filter((i) => i.id === item.key).length === 0 ? 1 : assetType.filter((i) => i.id === item.key)[0].assetnumber,
        };
    });

    const handleOk = () => {
        setokloading(true);
        request("/api/user/ep/transfer", "POST", 
            {
                transfer: assetTypes,
                reason: reason,
                department: department, 
            }).then((res) => {
            message.success("提交成功，请等待审批");
            setokloading(false);
            props.onClose();
        }).catch((err) => {
            setokloading(false);
            message.error(err.message);
        });
    };

    const columns = [
        {
            title: "资产编号",
            dataIndex: "key",
            key: "key",
        },
        {
            title: "资产名称",
            dataIndex: "assetname",
            key: "assetname",
        },
        {
            title: "指定数量",
            dataIndex: "number",
            render: (_: any, record: any, index: any) => {
                return (
                    <InputNumber defaultValue={1} onChange={(e) => {
                        if(e) assetTypes[index].assetnumber = e;
                        else assetTypes[index].assetnumber = 1;
                        let temp = assetType;
                        if(temp.filter((item) => item.id === record.key).length === 0) temp.push(assetTypes[index]);
                        else temp = temp.map((item) => {
                            if(item.id === record.key) {
                                if(e) item.assetnumber = e;
                                else item.assetnumber = 1;
                            }
                            return item;
                        });
                        setAssetType(temp);
                    }}></InputNumber>
                );
            }
        }
    ];

    return (
        <Modal
            open={props.isOpen}
            onCancel={props.onClose}
            title="待调拨资产"
            footer={[
                <Button key="back" type="primary" loading={okloading} onClick={handleOk}>
                    确认
                </Button>
            ]}>
            <div>调拨部门：</div>
            <Input onChange={(e) => setDepartment(e.target.value)}></Input>
            <div>调拨原因：</div>
            <TextArea autoSize={{ minRows: 2, maxRows: 6 }} onChange={(e) => setReason(e.target.value)}></TextArea>
            <div>待调拨资产：</div>
            <Table columns={columns} dataSource={props.content} />
        </Modal>
    );
};

export default MoveAsset;