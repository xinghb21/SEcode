import { useState } from "react";
import { Modal, Input, Button, message, Form, Checkbox, Col, Row } from "antd";
import React from "react";
import {useEffect} from "react";
import { ModalForm, ProForm, ProFormDateRangePicker, ProFormDigit, ProFormMoney, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { PlusOutlined } from "@ant-design/icons"
import { request } from '../../utils/network';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

interface Attributes{
    attributes: string[];
    used:string[];
}


interface DialogProps{
    onSetLabel: (used : string[]) => void;
}

const SetLabel = (props: DialogProps) =>{

    const [form] = Form.useForm();
    const [used, setUsed] = useState<string[]>([]);
    const [attributes, setAttributes] = useState<string[]>([]);

    useEffect(() => {
        request("/api/asset/usedlabel", "GET")
            .then((res) => {
                setUsed(res.info);
            })
            .catch((err) => {
                alert(err);
            }),
            request("/api/asset/attributes", "GET")
            .then((res) => {
                setAttributes(res.info);
            })
            .catch((err) => {
                alert(err);
            })
        },[]);

    const onChange = (e: CheckboxChangeEvent) => {
        if(e.target.checked && e.target.name)
        {
            let name = String(e.target.name)
            if(used.indexOf(name) === -1)
            {
                setUsed([...used, e.target.name]);
            }
        }
        else if(!e.target.checked && e.target.name)
        {
            let name = String(e.target.name)
            if(used.indexOf(name) !== -1)
            {
                setUsed(used.filter(item => item !== name));
            }
        }
          };

    const optionsWithDisabled = ['资产名称','业务实体','部门'];
    const availableOptions = [...optionsWithDisabled,'资产类别','上级资产','挂账人','价格','使用年限','创建时间','描述', ...attributes]
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
                        设置标签项
                    </Button>
                }
                onFinish={async (values: any) => {
                    request("/api/asset/setlabel", "POST",
                        {
                            label:used
                        })
                        .then((res) => {
                            props.onSetLabel(used);
                            message.success("设置成功");
                        })
                        .catch((err) => {
                            alert(err);
                            message.warning(err);
                        })
                    return true;
                }}
                >
                <>
                <Row>
                    {availableOptions.map((val,i)=>
                    optionsWithDisabled.indexOf(val) != -1 ?
                    <Col span={4}>
                        <Checkbox defaultChecked disabled name={val}>{val}</Checkbox>
                    </Col>:
                    <Col span={4}>
                    {used.indexOf(val) != -1 ? <Checkbox defaultChecked onChange={onChange} name={val}>{val} </Checkbox>
                    :<Checkbox onChange={onChange} name={val}>{val}</Checkbox>}
                    </Col>
                    )
                    }
                </Row>
                </>
            </ModalForm>
        </div>
        
    );
};
export default SetLabel;