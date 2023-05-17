import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Col, Descriptions, Divider, Row, Space, Typography, Upload, message } from "antd";
import { request } from "../../utils/network";
import { LoadingOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import OSS from "ali-oss";
import CryptoJS from "crypto-js";
import Base64 from "base-64";
import ImgCrop from "antd-img-crop";
import pic1 from "./../../styles/资产查看.jpg";
import pic2 from "./../../styles/资产分析.jpg";
import pic3 from "./../../styles/资产管理.jpg";
import pic4 from "./../../styles/资产申请.jpg";
import pic5 from "./../../styles/资产退库.jpg";
import pic6 from "./../../styles/资产维保.jpg";
import pic7 from "./../../styles/资产转移.jpg";
import pic8 from "./../../styles/部门管理.jpg";
import pic9 from "./../../styles/操作日志.jpg";
import pic10 from "./../../styles/人员管理.jpg";
import pic11 from "./../../styles/异步任务.jpg";
import SITE_CONFIG from "../../settings";

const { Meta } = Card;

const { Title } = Typography;

interface Props {
    identity: string;
    username: string;
    department: string;
    entity: string;
    head: boolean;
}

const accessKeyId = "LTAI5t7ktfdDQPrsaDua9HaG";
const accessSecret = "z6KJp2mQNXioRZYF0jkIvNKL5w8fIz";
const policyText = {
    "expiration": "2028-01-01T12:00:00.000Z", // 设置该Policy的失效时间，
    "conditions": [
        ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
    ]
};
const policyBase64 = Base64.encode(JSON.stringify(policyText));
const bytes = CryptoJS.HmacSHA1(policyBase64, accessSecret, { asBytes: true });
const signature = bytes.toString(CryptoJS.enc.Base64); 

const client = new OSS({
    region: "oss-cn-beijing",
    accessKeyId: accessKeyId,
    accessKeySecret: accessSecret,
    bucket: "aplus-avatar",
});

interface ClickProps {
    onChange : (e: number) => void;
}

interface Feishu {
    name: string;
    mobile: string;
    isbound: boolean;
}

const Page_home = (prop: ClickProps) => {

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();

    const [user, setUser] = React.useState<Props>({
        identity: "",
        username: "",
        department: "",
        entity: "",
        head: false,
    });

    const [feishu, setFeishu] = useState<Feishu>({
        name: "",
        mobile: "",
        isbound: false,
    });

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange: UploadProps["onChange"] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }
        if (info.file.status === "done") {
            // Get this url from response in real world.
            request("/api/user/changehead", "POST")
                .then((res) => {
                    message.success("头像上传成功！");
                })
                .catch((err) => {
                    message.error(err.message);
                });
            let url = client.signatureUrl(user.entity + "/" + user.department + "/" + user.username);
            setImageUrl(url);
            setLoading(false);
        }
    };

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as RcFile);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    useEffect(() => {
        request("/api/user/home/" + localStorage.getItem("username"), "GET")
            .then((res) => {
                if(res.identity === 1) res.identity = "超级系统管理员";
                else if(res.identity === 2) res.identity = "系统管理员";
                else if(res.identity === 3) res.identity = "资产管理员";
                else res.identity = "员工";
                setUser(res);
                let url = undefined;
                if(res.head === true)
                    url = client.signatureUrl(res.entity + "/" + res.department + "/" + res.username);
                setImageUrl(url);
                request("/api/feishu/getfeishuinfo/", "GET").then((res) => {
                    setFeishu(res.info);
                }).catch((err) => {
                    message.error(err.message);
                });
            })
            .catch((err) => {
                message.error(err.message);
            });
    }, []);

    const uploadButton = (
        <div >
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>上传头像</div>
        </div>
    );

    return (
        <>
            <div style={{ display: "flex", marginBottom: "1%"}}>
                <div style={{ width: "80%"}} key={0}>
                    <Title>☕️Welcome Back, {localStorage.getItem("username")} !</Title>
                    <Divider></Divider>
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Identity">{user.identity}</Descriptions.Item>
                        <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
                        <Descriptions.Item label="Department">{user.department}</Descriptions.Item>
                        <Descriptions.Item label="Entity">{user.entity}</Descriptions.Item>
                        {(feishu.isbound === true) ? 
                            <Descriptions.Item label="飞书账号">{feishu.mobile}<Button onClick={()=>{
                                request("/api/feishu/unbind", "DELETE")
                                    .then((res)=>{
                                        setFeishu({
                                            name: "",
                                            mobile: "",
                                            isbound: false,
                                        });
                                    })
                                    .catch((err) => {
                                        message.error(err.message);
                                    });
                            }}>解除绑定</Button></Descriptions.Item> : 
                            <Descriptions.Item label="飞书账号">未绑定<Button href={"https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=cli_a4b17e84d0f8900e&redirect_uri="+SITE_CONFIG.FRONTEND+"/bind&response_type=code"}
                            >绑定账号</Button></Descriptions.Item>}
                    </Descriptions>
                </div>
                <div style={{ marginLeft: "auto", marginRight: "auto", marginTop: "5%"}} key={1}>
                    <ImgCrop rotationSlider cropShape="round">
                        <Upload
                            listType="picture-circle"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="/image"
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            onPreview={onPreview}
                            data={{
                                key: user.entity + "/" + user.department + "/" + user.username,
                                policy: policyBase64,
                                OSSAccessKeyId: accessKeyId,
                                success_action_status: 200,
                                signature: signature,
                            }}
                        >
                            {imageUrl ? <Avatar src={imageUrl} alt="avatar" style={{ width: "100%", height: "100%" }} /> : uploadButton}
                        </Upload>
                    </ImgCrop>
                </div>
            </div>
            <Card title="应用导航">
                <Row gutter={[16, 16]}>
                    {
                        user.identity === "员工" ?
                            <>
                                <Col span={6}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt="example" src={pic1.src} />}
                                        onClick={() => prop.onChange(14)}
                                    >
                                        <Meta title="资产查看" description="查看拥有的资产列表" />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt="example" src={pic4.src} />}
                                        onClick={() => prop.onChange(15)}
                                    >
                                        <Meta title="资产领用" description="查看可领用的资产及申请列表" />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt="example" src={pic7.src} />}
                                        onClick={() => prop.onChange(16)}
                                    >
                                        <Meta title="资产转移" description="查看可转移的资产及申请列表" />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt="example" src={pic6.src} />}
                                        onClick={() => prop.onChange(17)}
                                    >
                                        <Meta title="资产维保" description="查看可维保的资产及申请列表" />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt="example" src={pic5.src} />}
                                        onClick={() => prop.onChange(18)}
                                    >
                                        <Meta title="资产退库" description="查看可退库的资产及申请列表" />
                                    </Card>
                                </Col>
                            </> : null
                    }
                    {
                        user.identity === "资产管理员" ?
                            <>
                                <Col span={6}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt="example" src={pic1.src} />}
                                        onClick={() => prop.onChange(5)}
                                    >
                                        <Meta title="资产定义" description="定义资产类别、自定义属性以及资产标签格式" />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt="example" src={pic3.src} />}
                                        onClick={() => prop.onChange(6)}
                                    >
                                        <Meta title="资产管理" description="进行资产录入、变更、清退和维保" />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt="example" src={pic2.src} />}
                                        onClick={() => prop.onChange(7)}
                                    >
                                        <Meta title="资产分析" description="查看资产统计、资产告警和历史" />
                                    </Card>
                                </Col>
                            </> : null
                    }
                    {
                        user.identity === "系统管理员" ?
                            <>
                                <Col span={6}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt="example" src={pic8.src} />}
                                        onClick={() => prop.onChange(4)}
                                    >
                                        <Meta title="企业部门管理" description="部门树及员工查看" />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt="example" src={pic10.src} />}
                                        onClick={() => prop.onChange(2)}
                                    >
                                        <Meta title="企业人员管理" description="员工创建、查询与删除" />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt="example" src={pic9.src} />}
                                        onClick={() => prop.onChange(3)}
                                    >
                                        <Meta title="操作日志查询" description="查看本业务实体下的操作日志" />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt="example" src={pic11.src} />}
                                        onClick={() => prop.onChange(13)}
                                    >
                                        <Meta title="异步任务管理" description="管理业务实体内异步导入导出任务" />
                                    </Card>
                                </Col>
                            </> : null
                    }
                    {
                        user.identity === "超级系统管理员" ?
                            <>
                                <Col span={6}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt="example" src={pic8.src} />}
                                        onClick={() => prop.onChange(0)}
                                    >
                                        <Meta title="业务实体管理" description="业务实体的查看、创建及删除" />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt="example" src={pic10.src} />}
                                        onClick={() => prop.onChange(1)}
                                    >
                                        <Meta title="系统人员管理" description="系统管理员的任命与解雇" />
                                    </Card>
                                </Col>
                            </> : null
                    }
                </Row>
            </Card>
        </>
        
    );
};

export default Page_home;
