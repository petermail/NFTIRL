import { useState } from "react";
import { getAllNftsAsync } from "../Api/NftApi";

const DivWallet = (props) => {
    //const { src, setSrc } = props;
    const [src, setSrc] = useState('');

    const handleChange = async (e) => {
        console.log(e.target.value);
        setSrc(x => e.target.value);
        const res = await getAllNftsAsync(e.target.value);
        console.log(res);
    }

    return (<div>
        <input type="text" size={60} value={src} onChange={handleChange}  />
    </div>)
}

export default DivWallet;