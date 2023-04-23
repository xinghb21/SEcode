import { Button, Descriptions, message, Modal } from "antd";
interface ModelProps {
    isOpen: boolean;
    onClose: () => void;
    content: AssetDisplayType;
}

type customfeature = {
    //自定义属性的格式
    name: string;//名称
    content: string;//具体内容
}

type AssetDisplayType = {
    //table数据的格式
    key: React.Key;//资产的编号
    name: string;//资产的名称
    username: string[];//使用者的名字
    assetclass: string;//资产的类型
    assetcount: number[];//资产数量
    description: string;//资产描述
    type: boolean;
    custom: customfeature[];//自定义属性
    date:string;//创建时间
    oriprice:number;//资产原始价值
}

const DisplayModel = (props: ModelProps) => {
    return (
        <Modal
            open={props.isOpen}
            title="该资产实例详细"
            onCancel={props.onClose}
            footer={[
                <Button key="back" onClick={props.onClose}>
                    关闭
                </Button>,
            ]}
        >
            <Descriptions></Descriptions>
        </Modal>);
};
export default DisplayModel;