import { useEffect, useState } from "react";
import { getVariantsAsync } from '../Api/PrintifyApi'
import DivVariant from "./DivVariant";

const DivVariants = (props) => {
    const { variants, handleCreateProduct, handleChooseVariant } = props;

    //console.log(variants);
    return (<div className="variants">
        {variants?.map(x => <DivVariant key={x.id} variant={x} handleChooseVariant={handleChooseVariant} handleCreateProduct={handleCreateProduct} />)}
    </div>)
}

export default DivVariants;