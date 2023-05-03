import { useEffect } from "react";
import { request } from "../../utils/network";

interface Asset{

    key: React.Key;
    name: string;
    person?: string;
    department?: string;
    parent?: string;
    child?: string;
    category: string;
    description?: string;
    number?: Number;
    addtion?: Object;
    status?: Number;
    type?: boolean;

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

    return (
        <>
        131312342
        </>
    );
};

export default DetailInfo;