import { useEffect, useRef, useState } from "react";
import { getVariantsAsync } from '../Api/PrintifyApi'
import { DivColor } from "./DivColor";
import { DivSize } from "./DivSize";
import DivVariant from "./DivVariant";

const DivVariants = (props) => {
    const { variants, handleCreateProduct, handleChooseVariant, variantId } = props;
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    const colors = [...new Set(variants.map(x => x.options.color.replace(/\s|\//g, '')))];
    const sizes = [...new Set(variants.map(x => x.options.size))];

    useEffect(() => {
        if (selectedColor && selectedSize) {
            const variant = variants.filter(x => x.options.size === selectedSize && x.options.color.replace(/\s|\//g, '') === selectedColor)[0];
            console.log(variant);
            console.log(variantId);
            if (variant && variant.id && (variantId !== variant.Id)) {
                console.log("handleChooseVariant");
                handleChooseVariant(variant.id);
            }
        }
    }, [selectedColor, selectedSize]);
    useEffect(() => {
        if (variants && variants.length > 0) {
            if (!variants.find(x => x.options.color.replace(/\s|\//g, '') === selectedColor)) {
                setSelectedColor(x => variants[0].options.color.replace(/\s|\//g, ''));
            }
            if (!variants.find(x => x.options.size === selectedSize)) {
                setSelectedSize(x => variants[0].options.size);
            }
            console.log("variants:", variants);
        }
    }, [variants]);

    //console.log(variants);
    console.log(colors);
    return (<div className="variants">
        {/*variants?.map(x => <DivVariant key={x.id} variant={x} handleChooseVariant={handleChooseVariant} handleCreateProduct={handleCreateProduct} />)*/}
        <div className="items">
            {colors.map(x => <DivColor key={x} color={x} isSelected={selectedColor === x} handleSelected={() => setSelectedColor(y => x)} />)}
        </div>
        <div className="items">
            {sizes.map(x => <DivSize key={x} size={x} isSelected={selectedSize === x} handleSelected={() => setSelectedSize(y => x)} />)}
        </div>
    </div>)
}

export default DivVariants;