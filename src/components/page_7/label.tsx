import { Avatar, List, Space, Button, message,Input, QRCode ,Modal ,Col, Row ,Descriptions ,Checkbox, Divider } from "antd";
import React from "react";
import {ProFormDatePicker, ProList} from "@ant-design/pro-components";
import { useState } from "react";
import {useEffect} from "react";
import { request } from "../../utils/network";
import { ModalForm, ProForm, ProFormDateRangePicker, ProFormDigit, ProFormMoney, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { PlusOutlined } from "@ant-design/icons";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useRouter } from "next/router";

interface Attributes{
    attributes: string[];
    used:string[];
}

const Label = ( () => {
    const [used, setUsed] = useState<string[]>([]);
    const [attributes, setAttributes] = useState<string[]>([]);
    const [text, setText] = React.useState("https://aplus-frontend-aplus.app.secoder.net/");
    const [refreshing, setRefreshing] = useState<boolean>(true);
    const router = useRouter();
    const query = router.query;

    useEffect(() => {
        setRefreshing(true);
        request("/api/asset/usedlabel", "GET")
            .then((res) => {
                setUsed(res.info);
                setRefreshing(false);
            })
            .catch((err) => {
                alert(err);
                setRefreshing(false);
            }),
        request("/api/asset/attributes", "GET")
            .then((res) => {
                setAttributes(res.info);
            })
            .catch((err) => {
                alert(err);
            });
    },[]);

    const onChange = (e: CheckboxChangeEvent) => {
        if(e.target.checked && e.target.name)
        {
            let name = String(e.target.name);
            if(used.indexOf(name) === -1)
            {
                setUsed([...used, e.target.name]);
            }
        }
        else if(!e.target.checked && e.target.name)
        {
            let name = String(e.target.name);
            if(used.indexOf(name) !== -1)
            {
                setUsed(used.filter(item => item !== name));
            }
        }
    };
    
    const updateAttributes = () =>{
        request("/api/asset/setlabel", "POST",
            {
                label:used
            })
            .then((res) => {
                message.success("保存成功");
            })
            .catch((err) => {
                alert(err);
                message.warning(err);
            });
    };
    
    console.log(used.indexOf("使用年限"));
    const optionsWithDisabled = ["资产名称","业务实体","部门"];
    const availableOptions = [...optionsWithDisabled,"资产类别","上级资产","挂账人","价格","使用年限","创建时间","描述", ...attributes];

    return refreshing ? (<p></p>) :
        (
            <div>
                <Divider orientation="left" >标签预览</Divider>
                <div
                    style={{
                        margin: 24,
                        padding: 20,
                        borderWidth: 1,
                        borderColor: "lightgray",
                        borderStyle: "solid",
                        borderRadius: 20
                    }}
                >
                    <Row>
                        <Col span={20}>
                            <Descriptions title="xxx(资产名称)">
                                <Descriptions.Item label="业务实体">xxx</Descriptions.Item>
                                <Descriptions.Item label="部门">xxx</Descriptions.Item>
                                {used.map((val,i)=><Descriptions.Item key={i} label={val}>xxx</Descriptions.Item>)}
                            </Descriptions>
                        </Col>
                        <Col>
                            <Space direction="vertical" align="center">
                                <QRCode value={text} style={{ marginBottom: 16}}/>
                            </Space>
                        </Col>
                    </Row>
                </div>
                <Divider orientation="left">标签属性定义</Divider>
                <div
                    style={{
                        margin: 24,
                        padding: 20,
                        borderWidth: 1,
                        borderColor: "lightgray",
                        borderStyle: "solid",
                        borderRadius: 20
                    }}>
                    <Row>
                        {availableOptions.map((val,i)=>
                            optionsWithDisabled.indexOf(val) != -1 ?
                                <Col key={i} span={4}>
                                    <Checkbox key={i} defaultChecked disabled name={val}>{val}</Checkbox>
                                    <br/>
                                </Col>
                                :
                                <Col key={i} span={4}>
                                    {used.indexOf(val) != -1 ? <Checkbox key={i} defaultChecked onChange={onChange} name={val}>{val} </Checkbox>
                                        :<Checkbox key={i} onChange={onChange} name={val}>{val}</Checkbox>}
                                    <br/>
                                </Col>
                        )
                        }
                    </Row>
                    <br/>
                    <br/>
                    <Row>
                        <Col offset={20}>
                            <Button type="primary" onClick={updateAttributes}>保存修改</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        );
}
);

export default Label;