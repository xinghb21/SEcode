import React, { useEffect, useState } from "react";
import { Avatar, Descriptions, Divider, Space, Typography, Upload, message } from "antd";
import { request } from "../../utils/network";
import { LoadingOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import OSS from "ali-oss";
import CryptoJS from "crypto-js";
import Base64 from "base-64";
import ImgCrop from 'antd-img-crop';

const { Title } = Typography;

interface Props {
    identity: string;
    username: string;
    department: string;
    entity: string;
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

const Page_home = () => {

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();

    const [user, setUser] = React.useState<Props>({
        identity: "",
        username: "",
        department: "",
        entity: "",
    });

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
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
                let url = client.signatureUrl(res.entity + "/" + res.department + "/" + res.username);
                setImageUrl(url);
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
            <div style={{ display: "flex"}}>
                <div style={{ width: "80%"}} key={0}>
                    <Title>☕️Welcome Back, {localStorage.getItem("username")} !</Title>
                    <Divider></Divider>
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Identity">{user.identity}</Descriptions.Item>
                        <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
                        <Descriptions.Item label="Department">{user.department}</Descriptions.Item>
                        <Descriptions.Item label="Entity">{user.entity}</Descriptions.Item>
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
                            {imageUrl ? <Avatar src={imageUrl} alt="avatar" style={{ width: '100%', height: "100%" }} /> : uploadButton}
                        </Upload>
                    </ImgCrop>
                </div>
            </div>
            <Divider></Divider>
        </>
        
    );
};

export default Page_home;
