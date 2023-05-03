{/* <div
                style={{
                    margin: 20,
                }}
            > */}
{/* <QueryFilter 
                    labelWidth="auto" 
                    onFinish={async (values) => {
                        
                        request("/api/asset/get", "GET", 
                            {
                                parent: values.parent,
                                category: values.category,
                                name: values.name,
                                belonging: values.belonging,
                                from: values.date[0],
                                to: values.date[1],
                                user: values.user,
                                status: values.status,
                                pricefrom: values.price[0],
                                priceto: values.price[1],
                            })
                            .then((res) => {
                                setAssets(res.data);
                                message.success("查询成功");
                            }).catch((err) => {
                                message.warning(err.message);
                            });
                    }}
                >
                    <ProForm.Group>
                        <ProFormText
                            width="md"
                            name="name"
                            label="资产名称"
                            initialValue={""}
                            placeholder="请输入名称"
                        />
                        <ProFormSelect
                            options={[
                                {
                                    value: 0,
                                    label: "闲置",
                                },
                                {
                                    value: 1,
                                    label: "使用中",
                                },
                                {
                                    value: 2,
                                    label: "维保",
                                },
                                {
                                    value: 3,
                                    label: "清退",
                                },
                                
                            ]}
                            width="xs"
                            name="status"
                            label="资产状态"
                        />
                        <ProFormDateRangePicker
                            width="md"
                            name="date"
                            label="资产创建时间"
                        
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText 
                            width="md" 
                            name="parent" 
                            label="上级资产名称" 
                            initialValue={""}
                        />
                        <ProFormText 
                            width="md" 
                            name="category" 
                            label="资产类别" 
                        />

                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText 
                            width="md" 
                            name="belonging" 
                            label="资产挂账人" 
                        />
                        <ProFormText 
                            width="md" 
                            name="user" 
                            label="当前使用者" 
                        />
                    </ProForm.Group>
                    <ProFormDigitRange
                        width="xs"
                        name="price"
                        label="资产价值区间"
                    />
                </QueryFilter>
            </div> */}