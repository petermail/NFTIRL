import { useEffect, useRef, useState } from "react";
import { getVariantsAsync } from '../Api/PrintifyApi'
import { DivColor } from "./DivColor";
import { DivSize } from "./DivSize";
import DivVariant from "./DivVariant";

const AltVariants = (props) => {
    const { product, variants, handleCreateProduct, handleChooseVariant, variantId, isDebug,
        selectedColor, setSelectedColor, selectedSize, setSelectedSize
    } = props;
    /*const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');*/

    const colors = [...new Set(variants.filter(x => x.options.color).map(x => x.options.color.replace(/\s|\//g, '')))];
    const sizes = [...new Set(variants.map(x => x.options.size))];

    useEffect(() => {
        if (selectedColor && selectedSize) {
            const variant = variants.filter(x => x.options.size === selectedSize 
                && (colors.length === 0 || x.options.color?.replace(/\s|\//g, '') === selectedColor))[0];
            console.log('variants: ', variants, 'selected variant: ', variant, 'color: ', selectedColor, 'option colors:', variants.map(x => x.options.color));
            if (variant && variant.id && (variantId !== variant.Id)) {
                handleChooseVariant(variant.id);
            }
        }
    }, [selectedColor, selectedSize]);
    useEffect(() => {
        if (variants && variants.length > 0) {
            if (!variants.find(x => x.options.size === selectedSize)) {
                setSelectedSize(x => variants[0].options.size);
            }
            if (colors.length > 0) {
                if (!variants.find(x => x.options.size === selectedSize
                    && x.options.color.replace(/\s|\//g, '') === selectedColor)) {
                    setSelectedColor(x => variants[0].options.color.replace(/\s|\//g, ''));
                }
            }
        }
    }, [variants]);

    const isAvailable = (size, color) => {
        return 0 < (variants.filter(x => x.options.size === size 
            && (colors.length === 0 || x.options.color?.replace(/\s|\//g, '') === color))?.length ?? 0)
    }

    const handleColor = (color) => {
        setSelectedColor(x => color);
    }
    const handleSize = (size) => {
        setSelectedSize(x => size);
    }

    if (isDebug) {
        console.log('colors/sizes:', colors, sizes);
    }
    return (<div className="altVariants">
        { colors.length > 1 &&
            <div className="altItems">
                {colors.map((x, i) => <DivColor key={x} color={x} colorValue={product?.options?.filter(y => y.type === 'color')[0]?.values.filter(y => y.title.replace(/\s|\//g, '') === x)[0]?.colors[0]} 
                    isSelected={selectedColor === x} isAvailable={isAvailable(selectedSize, x)} handleSelected={() => handleColor(x)} />)}
            </div>
        }
        { sizes.length > 1 &&
            <div className="altItems">
                {sizes.map(x => <DivSize key={x} size={x} isSelected={selectedSize === x} isAvailable={isAvailable(x, selectedColor)} handleSelected={() => handleSize(x)} />)}
            </div>
        }
    </div>)
}

export default AltVariants;