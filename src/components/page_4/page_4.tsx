import React, { useEffect, useMemo, useState } from "react";
import Dtree from "./Dtree";
import { useRouter } from "next/router";
import { Typography } from 'antd';
import { request } from "../../utils/network";
import CreateDT from "./createDT";
// import { Input, Tree } from 'antd';
// import type { DataNode } from 'antd/es/tree';

// const { Search } = Input;

// interface entitytree{
//     entitys:Array<>;
// }

// const x = 3;
// const y = 2;
// const z = 1;
// const defaultData: DataNode[] = [];
// const generateData = (_level: number, _preKey?: React.Key, _tns?: DataNode[]) => {
//   const preKey = _preKey || '0';
//   const tns = _tns || defaultData;

//   const children: React.Key[] = [];
//   for (let i = 0; i < x; i++) {
//     const key = `${preKey}-${i}`;
//     tns.push({ title: key, key });
//     if (i < y) {
//       children.push(key);
//     }
//   }
//   if (_level < 0) {
//     return tns;
//   }
//   const level = _level - 1;
//   children.forEach((key, index) => {
//     tns[index].children = [];
//     return generateData(level, key, tns[index].children);
//   });
// };
// generateData(z);

// const dataList: { key: React.Key; title: string }[] = [];
// const generateList = (data: DataNode[]) => {
//   for (let i = 0; i < data.length; i++) {
//     const node = data[i];
//     const { key } = node;
//     dataList.push({ key, title: key as string });
//     if (node.children) {
//       generateList(node.children);
//     }
//   }
// };
// generateList(defaultData);

// const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
//   let parentKey: React.Key;
//   for (let i = 0; i < tree.length; i++) {
//     const node = tree[i];
//     if (node.children) {
//       if (node.children.some((item) => item.key === key)) {
//         parentKey = node.key;
//       } else if (getParentKey(key, node.children)) {
//         parentKey = getParentKey(key, node.children);
//       }
//     }
//   }
//   return parentKey!;
// };

// import { Input, Tree } from 'antd';
// import type { DataNode } from 'antd/es/tree';

// const { Search } = Input;

// interface entitytree{
//     entitys:Array<>;
// }

// const x = 3;
// const y = 2;
// const z = 1;
// const defaultData: DataNode[] = [];
// const generateData = (_level: number, _preKey?: React.Key, _tns?: DataNode[]) => {
//   const preKey = _preKey || '0';
//   const tns = _tns || defaultData;

//   const children: React.Key[] = [];
//   for (let i = 0; i < x; i++) {
//     const key = `${preKey}-${i}`;
//     tns.push({ title: key, key });
//     if (i < y) {
//       children.push(key);
//     }
//   }
//   if (_level < 0) {
//     return tns;
//   }
//   const level = _level - 1;
//   children.forEach((key, index) => {
//     tns[index].children = [];
//     return generateData(level, key, tns[index].children);
//   });
// };
// generateData(z);

// const dataList: { key: React.Key; title: string }[] = [];
// const generateList = (data: DataNode[]) => {
//   for (let i = 0; i < data.length; i++) {
//     const node = data[i];
//     const { key } = node;
//     dataList.push({ key, title: key as string });
//     if (node.children) {
//       generateList(node.children);
//     }
//   }
// };
// generateList(defaultData);

// const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
//   let parentKey: React.Key;
//   for (let i = 0; i < tree.length; i++) {
//     const node = tree[i];
//     if (node.children) {
//       if (node.children.some((item) => item.key === key)) {
//         parentKey = node.key;
//       } else if (getParentKey(key, node.children)) {
//         parentKey = getParentKey(key, node.children);
//       }
//     }
//   }
//   return parentKey!;
// };

const Page_4 = () => {
    
//   const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
//   const [searchValue, setSearchValue] = useState('');
//   const [autoExpandParent, setAutoExpandParent] = useState(true);

    //   const onExpand = (newExpandedKeys: React.Key[]) => {
    //     setExpandedKeys(newExpandedKeys);
    //     setAutoExpandParent(false);
    //   };
    //   useEffect(() => {
    //         fetchList();
    //     }, [props.entitys]);
    // const  fetchList = ()=> {
    
    // } 
    //   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { value } = e.target;
    //     const newExpandedKeys = dataList
    //       .map((item) => {
    //         if (item.title.indexOf(value) > -1) {
    //           return getParentKey(item.key, defaultData);
    //         }
    //         return null;
    //       })
    //       .filter((item, i, self) => item && self.indexOf(item) === i);
    //     setExpandedKeys(newExpandedKeys as React.Key[]);
    //     setSearchValue(value);
    //     setAutoExpandParent(true);
    //   };

    //   const treeData = useMemo(() => {
    //     const loop = (data: DataNode[]): DataNode[] =>
    //       data.map((item) => {
    //         const strTitle = item.title as string;
    //         const index = strTitle.indexOf(searchValue);
    //         const beforeStr = strTitle.substring(0, index);
    //         const afterStr = strTitle.slice(index + searchValue.length);
    //         const title =
    //           index > -1 ? (
    //             <span>
    //               {beforeStr}
    //               <span className="site-tree-search-value">{searchValue}</span>
    //               {afterStr}
    //             </span>
    //           ) : (
    //             <span>{strTitle}</span>
    //           );
    //         if (item.children) {
    //           return { title, key: item.key, children: loop(item.children) };
    //         }

    //         return {
    //           title,
    //           key: item.key,
    //         };
    //       });

    //     return loop(defaultData);
    //   }, [searchValue]);

    //   return (
    //     <div>
    //       <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
    //       <Tree
    //         onExpand={onExpand}
    //         expandedKeys={expandedKeys}
    //         autoExpandParent={autoExpandParent}
    //         treeData={treeData}
    //       />
    //     </div>
    //   );
    let json={ "Apple": { "商务分析部门": "$", "技术部门": { "芯片研发部门": "$" }, "应用设计部门": { "UI界面": "$", "服务器维护": "$","创意部门":{"设计部门":"$"} } } };
    const router = useRouter();
    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        fetchJson();
    }, [router,json]);
    const { Title } = Typography;
   

    const fetchJson =()=>{
        // request("/api/user/es/departs","GET")
        // .then((res)=>{
        //    json=res.info;
        // })
        // .catch((err) => {
        //     alert(err.message);
        //     router.push("/");
        // });
    };
    return(
        <div>
            <Title level={3}>
            {localStorage.getItem("entity")+"部门管理"}
            </Title>
            <Dtree data={json}/>
        </div>
    );
};

export default Page_4;