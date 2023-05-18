import { ModalForm, ProForm, ProFormDigit, ProFormMoney, ProFormSelect, ProFormText, ProList } from "@ant-design/pro-components";
import { Button, Form, Input, Modal, Space, Spin, Table, Upload, UploadFile, UploadProps, message } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { request } from "../../utils/network";
import type { ColumnsType } from "antd/es/table";
import CryptoJS from "crypto-js";
import Base64 from "base-64";
import OSS from "ali-oss";
import "react-quill/dist/quill.snow.css";
import MarkdownIt from "markdown-it";
const ReactQuill = typeof window === "object" ? require("react-quill") : () => false;
import { RcFile } from "antd/lib/upload";
import * as XLSX from "xlsx/xlsx.mjs";


const md = new MarkdownIt();

interface Asset {

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
    additionalinfo?: string;
    hasimage: boolean;

}

interface Excel {

    资产名称: string;
    资产种类: string;
    资产价值: Number;
    资产使用年限: Number;
    资产描述?: string;
    资产数量?: Number;
    上级资产名称?: string;
    挂账人?: string;

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
const policyBase64 = Base64.encode(JSON.stringify(policyText));
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

const client = new OSS({
    region: "oss-cn-beijing",
    accessKeyId: accessKeyId,
    accessKeySecret: accessSecret,
    bucket: "aplus-secoder",
});

const AddAsset = () => {

    const [assets, setAsset] = useState<Asset[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [labels, setLabel] = useState<string[]>([]);
    const [addition, setAddition] = useState<string[]>([]);
    const [imagename, setImage] = useState<string>("");
    const [department, setDepart] = useState<string>("");
    const [entity, setEntity] = useState<string>("");
    const [value, setValue] = useState("");
    const [fileList, setFileList] = useState<RcFile[]>([]);
    const [detail, setDetail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imgList, setImgList] = useState<UploadFile[]>([]);
    const [isSpinning, setIsSpinning] = useState<boolean>(false);

    //markdown
    const handleChange = (content: string) => {
        setValue(content);
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
    ];

    let additions: Addition[] = [];

    useEffect(() => {
        setIsSpinning(true);
        request("/api/asset/assetclass", "GET")
            .then((res) => {
                setLabel(res.data);
            })
            .catch((err) => {
                message.warning(err.message);
            });
        request("/api/asset/attributes", "GET")
            .then((res) => {
                setAddition(res.info);
            })
            .catch((err) => {
                message.warning(err.message);
            });
        request("/api/asset/getbelonging", "GET")
            .then((res) => {
                setDepart(res.department);
                setEntity(res.entity);
            });
        request("/api/asset/getbelonging", "GET")
            .then((res) => {
                setDepart(res.department);
                setEntity(res.entity);
            });
        setTimeout(() => {
            setIsSpinning(false);
        }, 500);
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

    async function handleUpload(file: UploadFile, name: string) {
        const result = await client.put(entity + "/" + department + "/" + name, file);
        return { url: result.url };
    }

    const onSubmit = (() => {
        //与后端交互，实现批量添加
        setIsSpinning(true);
        setLoading(true);
        const newAssets = assets.filter(item => !selectedRowKeys.includes(item.key));
        const selectedAssert = selectedRowKeys.map(key => {
            const item = assets.find(data => data.key === key);
            return item;
        });

        request("/api/asset/post", "POST", selectedAssert)
            .then(() => {
                setAsset(newAssets);
                message.success("提交成功");
                setLoading(false);
            })
            .catch((err) => {
                message.warning(err.message);
                setLoading(false);
            });
        setTimeout(() => {
            setIsSpinning(false);
        }, 500);
    });


    //excel
    const onImportExcel = (file: RcFile) => {
        setIsSpinning(true);
        if (fileList.some(f => f.name === file.name)) {
            message.error("文件已上传");
            return false;
        }
        let resData: Excel[] = [];// 存储获取到的数据
        // 通过FileReader对象读取文件
        const fileReader = new FileReader();
        fileReader.readAsBinaryString(file);  //二进制
        fileReader.onload = event => {
            try {
                const result = event.target?.result;
                // 以二进制流方式读取得到整份excel表格对象		
                const workbook = XLSX.read(result, { type: "binary" });
                // 遍历每张工作表进行读取（这里默认只读取第一张表）
                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        // 利用 sheet_to_json 方法将 excel 转成 json 数据
                        resData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                        break; // 如果只取第一张表，就取消注释这行
                    }
                }
                let check: Boolean = true;
                let fileAsset: Asset[] = [];
                for (let i = 0; i < resData.length; i++) {
                    if (!("资产名称" in resData[i])) {
                        message.error("文件中缺少资产名称，请参照模板规范");
                        check = false;
                        break;
                    } else if (!("资产种类" in resData[i])) {
                        message.error("文件中缺少资产种类，请参照模板规范");
                        check = false;
                        break;
                    } else if (!("资产使用年限" in resData[i])) {
                        message.error("文件中缺少资产使用年限，请参照模板规范");
                        check = false;
                        break;
                    } else if (!("资产价值" in resData[i])) {
                        message.error("文件中缺少资产价值，请参照模板规范");
                        check = false;
                        break;
                    }
                    let resAsset: Asset = {

                        key: resData[i].资产名称,
                        name: resData[i].资产名称,
                        category: resData[i].资产种类,
                        life: resData[i].资产使用年限,
                        price: resData[i].资产价值,
                        description: resData[i].资产描述,
                        parent: resData[i].上级资产名称,
                        belonging: resData[i].挂账人,
                        number: resData[i].资产数量 ? resData[i].资产数量 : 1,
                        hasimage: false,

                    };
                    fileAsset.push(resAsset);
                }
                if (check) {
                    setAsset(assets => assets.concat(fileAsset));
                    message.success("导入成功");
                    setFileList([...fileList, file]);
                    return true;
                }
            } catch (e) {
                message.error("文件类型不正确");
                return false;
            }
        };
        setTimeout(() => {
            setIsSpinning(false);
        }, 500);
    };

    return (
        <div style={{ margin: 24 }}>
            <Space size="middle">
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
                        if (assets.filter(item => item.key === values.assetname).length > 0) {
                            message.error("资产名称重复");
                            return false;
                        }
                        additions.splice(0);
                        for (let i = 0; i < addition.length; i++) {
                            additions.push({ key: addition[i], value: values[addition[i]] });
                        }

                        let hasImage: boolean = false;

                        if (imgList.length > 0) {
                            hasImage = true;
                            let file = imgList[0];
                            handleUpload(file, values.assetname).then(
                                () => {
                                    message.success("上传成功");
                                },
                                error => {
                                    message.error("上传失败");
                                }
                            );
                            setImgList([]);
                        }

                        const asset: Asset = {

                            key: values.assetname,
                            name: values.assetname,
                            description: values.description,
                            category: values.category,
                            parent: values.parent,
                            life: values.life,
                            price: values.price,
                            number: values.number,
                            belonging: values.belonging,
                            addtional: additions,
                            additionalinfo: value,
                            hasimage: hasImage,

                        };
                        setAsset([...assets, asset]);
                        setValue("");
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
                        <ProFormMoney
                            label="资产价值"
                            name="price"
                            locale="￥"
                            min={0}
                            rules={[{ required: true, message: "请输入资产价值！" }]}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="belonging"
                            label="挂账人"
                            initialValue={""}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <StrListToProFormText strList={addition} />
                    </ProForm.Group>
                    <ProForm.Group>
                        <Upload
                            // action={host}
                            accept="image/*"
                            maxCount={1}
                            beforeUpload={(file) => {
                                setImgList([...imgList, file]);
                                return false;
                            }}
                            onChange={(info) => {
                                if (info.file.status == "done")
                                    setImage(info.file.name);
                                if (info.file.status == "removed")
                                    setImage("");
                            }}
                            onRemove={(file: UploadFile) => {
                                setImgList([]);
                                message.success(`${file.name} 已删除`);
                                // try {
                                //     await client.delete(file.name);
                                //     message.success(`${file.name} 已删除`);
                                // } catch (error) {
                                //     alert(error);
                                // }
                            }}
                            data={{
                                key: entity + "/" + department + "/" + "${filename}",
                                policy: policyBase64,
                                OSSAccessKeyId: accessKeyId,
                                success_action_status: 200,
                                signature,
                            }}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </ProForm.Group>
                    <ProForm.Group>
                        <div style={{ marginTop: 20 }}>
                            <Space direction="vertical">
                                <div>补充说明</div>
                                <ReactQuill
                                    title="资产描述"
                                    value={value}
                                    onChange={handleChange}
                                    modules={modules}
                                    formats={formats}
                                    theme="snow"
                                    placeholder="Write something..."
                                />
                            </Space>
                        </div>
                    </ProForm.Group>
                </ModalForm>
                <Upload
                    beforeUpload={onImportExcel}
                    showUploadList={false}
                    accept=".xlsx">
                    <Button icon={<UploadOutlined />}>从文件中导入</Button>
                </Upload>
                <a href="https://cloud.tsinghua.edu.cn/f/3472ab7dc87a4c03aa5c/?dl=1">下载模板文件</a>
                <Button type="link" onClick={() => setDetail(true)}>
                    模板说明
                </Button>
                <Modal
                    title="模板说明"
                    open={detail}
                    onOk={() => setDetail(false)}
                    onCancel={() => setDetail(false)}
                >
                    <p>模板中含有资产的必要属性与非必要属性，对于必要属性表格中的每一项资产都必须填写，非必要属性则可以有选择地填写</p>
                    <p>必要属性：资产名称、资产种类、资产价值、资产使用年限</p>
                    <p>非必要属性：资产描述、资产数量、上级资产名称、挂账人</p>
                </Modal>
            </Space>
            <div style={{ marginTop: 24 }}>
                <Spin spinning={isSpinning}>
                    <Table rowSelection={rowSelection} columns={columns} dataSource={assets} bordered={true} />
                </Spin>
                <Button type="primary" onClick={onSubmit} disabled={!hasSelected} loading={loading} style={{ marginTop: 10 }}>
                    提交
                </Button>
            </div>
        </div>
    );
};

export default AddAsset;