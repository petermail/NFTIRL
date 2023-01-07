import { useState } from "react";

const DivImage = (props)  => {
    //const [src, setSrc] = useState('');
    const { src, setSrc, handleCreateProduct } = props;

    const handleChange = (e) => {
        setSrc(x => e.target.value);
    }

    return (<div className="divImage">Image url:&nbsp;
        <input type="text" size={60} value={src} onChange={handleChange} />
        {/*<div onClick={() => handleCreateProduct(src)}>upload image and create product</div>*/}
    </div>)
}

export default DivImage;