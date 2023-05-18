import React, { useEffect, useState } from "react";
import { request } from "../../utils/network";
import { Space, Spin, Tag, message } from "antd";
import { ProForm, ProFormDateRangePicker, ProFormSelect, ProFormText, QueryFilter, ProTable, ProColumns } from "@ant-design/pro-components";
// import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import moment from "moment";

interface History {
    key: React.Key;
    id: number;
    content: string;
    time: number;
    type: number;
    asset: string;
}

const AssetHistory = () => {
    const [isSpinning, setIsSpinning] = useState<boolean>(false);
    const [historylist, sethistorylist] = useState<History[]>([]);
    const [datatype, setdatatype] = useState<any>("");
    const [dataname, setdataname] = useState<any>("");
    const [datatimefrom, setdatatimefrom] = useState<any>("");
    const [datatimeto, setdatatimeto] = useState<any>("");
    const [pagenation, setpagenation] = useState({
        current: 1, // 当前页码
        pageSize: 10, // 每页显示条数
        total: 0, // 总记录数
    });
    const columns: ProColumns<History>[] = [
        {
            title: "资产名称",
            dataIndex: "asset",
        },
        {
            title: "操作类型",
            dataIndex: "type",
            render: (_, row) => {
                return (
                    <Space size={0}>
                        {(row.type === 1) ? <Tag color="blue" key={row.id}>资产创建</Tag> :
                            ((row.type === 2) ? <Tag color="green" key={row.id}>资产领用</Tag> :
                                ((row.type === 3) ? <Tag color="orange" key={row.id}>资产转移</Tag> :
                                    ((row.type === 4) ? <Tag color="red" key={row.id}>资产维保</Tag> :
                                        ((row.type === 5) ? <Tag color="purple" key={row.id}>资产退库</Tag> :
                                            <Tag color="cyan" key={row.id}>资产数量变动</Tag>))))
                        }
                    </Space>
                );
            },
        },
        {
            title: "操作描述",
            dataIndex: "content",
            render: (_, row) => {
                return (
                    <div>
                        {row.content}
                    </div>
                );
            },
        },
        {
            title: "时间",
            dataIndex: "time",
            render: (_, row) => {
                return (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <p>Happen at: {moment(row.time, "X").format("YYYY-MM-DD-HH:mm:ss")}</p>
                    </div>
                );
            },
        }
    ];
    useEffect((() => {
        setIsSpinning(true);
        request("/api/asset/allhistory", "GET", { page: 1 })
            .then((res) => {
                // 更新表格数据源和分页器状态
                sethistorylist(res.info.map((val) => {
                    return {
                        key: val.id,
                        id: val.id,
                        content: val.content,
                        type: val.type,
                        time: val.time,
                        asset: val.asset,
                    };
                }));
                setpagenation({
                    current: 1,
                    pageSize: 10,
                    total: res.count,
                });
            })
            .catch((error) => {
                message.warning(error.message);
            });
        setTimeout(() => {
            setIsSpinning(false);
        }, 500);
    }), []);

    const handleFetch = (page: number, pageSize: number) => {
        // 构造请求参数
        // 发送请求获取数据
        setIsSpinning(true);
        request("/api/asset/queryhis", "GET",
            {
                type: datatype,
                assetname: dataname,
                timefrom: datatimefrom,
                timeto: datatimeto,
                page: page,
            })
            .then((res) => {
                //更改
                sethistorylist(res.info.map((val) => {
                    return {
                        key: val.id,
                        id: val.id,
                        content: val.content,
                        type: val.type,
                        time: val.time,
                        asset: val.asset,
                    };
                }));
                setpagenation({
                    current: page,
                    pageSize: 10,
                    total: res.count,
                });
            }).catch((err) => {
                message.warning(err.message);
            });
        setTimeout(() => {
            setIsSpinning(false);
        }, 500);
    };

    return (
        <div>
            <div>
                <QueryFilter
                    labelWidth="auto"
                    onFinish={async (values) => {
                        //发送查询请求，注意undefined的情况
                        if (values.status != undefined) {
                            setdatatype(values.status);
                        } else {
                            setdatatype("");
                        }
                        if (values.name != undefined) {
                            setdataname(values.name);
                        } else {
                            setdataname("");
                        }
                        if (values.date != undefined) {
                            setdatatimefrom(Date.parse(values.date[0]) / 1000);
                            setdatatimeto(Date.parse(values.date[1]) / 1000);
                        } else {
                            setdatatimefrom("");
                            setdatatimeto("");
                        }
                        setIsSpinning(true);
                        request("/api/asset/queryhis", "GET",
                            {
                                type: (values.status != undefined) ? values.status : "",
                                assetname: (values.name != undefined) ? values.name : "",
                                timefrom: (values.date != undefined) ? Date.parse(values.date[0]) / 1000 : "",
                                timeto: (values.date != undefined) ? Date.parse(values.date[1]) / 1000 : "",
                                page: "1",
                            })
                            .then((res) => {
                                //更改
                                sethistorylist(res.info.map((val) => {
                                    return {
                                        key: val.id,
                                        id: val.id,
                                        content: val.content,
                                        type: val.type,
                                        time: val.time,
                                        asset: val.asset,
                                    };
                                }));
                                setpagenation({
                                    current: 1,
                                    pageSize: 10,
                                    total: res.count,
                                });
                                message.success("查询成功");
                            }).catch((err) => {
                                message.warning(err.message);
                            });
                        setTimeout(() => {
                            setIsSpinning(false);
                        }, 500);
                    }
                    }
                >
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="name"
                            label="资产名称"
                            placeholder="请输入名称"
                        />
                        <ProFormSelect
                            options={[
                                {
                                    value: 1,
                                    label: "创建",
                                },
                                {
                                    value: 2,
                                    label: "领用",
                                },
                                {
                                    value: 3,
                                    label: "转移",
                                },
                                {
                                    value: 4,
                                    label: "维保",
                                },
                                {
                                    value: 5,
                                    label: "退库",
                                },
                                {
                                    value: 6,
                                    label: "数量变化",
                                },
                            ]}
                            width="xs"
                            name="status"
                            label="历史类型"
                        />
                        <ProFormDateRangePicker
                            width="md"
                            name="date"
                            label="时间段选择"
                        />

                    </ProForm.Group>
                </QueryFilter>
            </div>
            <Spin spinning={isSpinning}>
                <ProTable<History>
                    bordered={true}
                    //切换页面的实现在于pagination的配置，如下
                    pagination={{
                        current: pagenation.current,
                        pageSize: pagenation.pageSize,
                        onChange: handleFetch,
                        total: pagenation.total
                    }}
                    search={false}
                    options={false}
                    columns={columns}
                    rowKey="key"
                    headerTitle="资产历史查看"
                    dataSource={historylist}
                />
            </Spin>
        </div>
    );
};

export default AssetHistory;