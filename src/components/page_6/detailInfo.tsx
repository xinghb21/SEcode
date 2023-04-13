import { useEffect } from "react";
import { request } from "../../utils/network";

interface Asset{

    key: React.Key;
    assetname: string;
    person: string;
    department: string;
    parent: string;
    child: string;
    status: string;
    category: string;
    description: string;
    type: boolean;
    number: Number;
    addtion: string;

}

interface DetailProps {
    isOpen: boolean;
    onClose: () => void;
    name: string;
}

const DetailInfo = (props: DetailProps) => {

    useEffect(() => {
        request("/api/asset/getdetail", "GET", props.name)
            .then((res) => {

            });
    }, []);

    
};