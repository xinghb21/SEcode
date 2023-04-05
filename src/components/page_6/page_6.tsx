import React, { useEffect, useState } from "react";
import Assertlist from "./assertlist";
import { useRouter } from "next/router";

interface Assert{

    key: React.Key;
    assertname: string;
    person: string;
    department: string;
    parent: string;
    child: string;
    status: string;
    category: string;
    description: string;
    addtion: string;

}

const Page_6 = () => {
    
    const router = useRouter();
    const query = router.query;
    
    let asserts:Assert[] = [{key: Date.now(), description: "12314", assertname: "123", person : "", department: "", parent: "" , child: "", status: "free", category: "", addtion: ""}];

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        fetchList();
    }, [router, query]);

    const fetchList = () => {

    };

    return (
        <Assertlist data={asserts}></Assertlist>
    );
};

export default Page_6;