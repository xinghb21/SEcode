import { PropertySafetyFilled } from "@ant-design/icons";
import { Button } from "antd";
import  React from "react";
import { useState } from "react";

interface buttonprops{
    disable : boolean;
    onhandleclick :  ()=>void;  
}


const Buttonwithloading = ( propa:buttonprops )=>{
    const  [isloading,setloading ]  = useState<boolean> (false);
    return(
        <Button onClick={() => { setloading(true); propa.onhandleclick();setloading(false);  }}  loading={isloading} disabled={propa.disable}  > 删除 </Button>
    );
};


export default Buttonwithloading;