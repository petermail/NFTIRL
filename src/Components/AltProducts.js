import { useEffect, useMemo, useRef, useState } from "react";
import { getPrintArea, getPrintProvidersAsync, getVariant, getVariantsAsync, saveProductAsync, uploadImageAsync } from "../Api/PrintifyApi";
import AltDivProduct from "./AltDivProduct";
import AltVariants from "./AltVariants";
import DivVariants from "./DivVariants";
import { useData } from "../Base/DataProvider";

const AltProducts = (props) => {
    const { blueprints, isDebug, imgSrc, shopId } = props;

    const filtered = [...blueprints].splice(0, 9);
    console.log('filtered', filtered);
    return (<div className="wrap">
            { filtered.map(x => 
                    <AltProduct key={x.id} blueprintId={x.id} isDebug={isDebug} />
                )
            }
        </div>);
}

const AltProduct = (props) => {
    const { isDebug, blueprintId } = props;
    const { item, getData, handleChooseVariant, products } = useData();
    const [curr, setCurr] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        const data = getData(blueprintId);
        setCurr(() => data);
    }, [blueprintId, getData, products]);
    
    const divVariants = () => (<>
        { curr && curr.variants.length > 0 &&
            <AltVariants product={curr.product} variants={curr.variants} handleChooseVariant={handleChooseVariant} 
                variantId={curr.variantId} blueprintId={blueprintId}
                selectedColor={selectedColor} setSelectedColor={setSelectedColor}
                selectedSize={selectedSize} setSelectedSize={setSelectedSize} />
        }</>);

    return (<div>
        { curr && curr.isLoading &&
            <img src={process.env.PUBLIC_URL + "/loading.gif"} className="loading" alt="loading" />
        }
        { curr && curr.product && curr.variants.find(x => x.id === curr.variantId)
            && <AltDivProduct product={curr.product} isDebug={isDebug} setIsLoading={setIsLoading} getVariants={() => divVariants()} />}
    </div>)
}

export default AltProducts;