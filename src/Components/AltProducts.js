import { useEffect, useMemo, useRef, useState } from "react";
import { getPrintArea, getPrintProvidersAsync, getVariant, getVariantsAsync, saveProductAsync, uploadImageAsync } from "../Api/PrintifyApi";
import DivProduct from "./DivProduct";

const AltProducts = (props) => {
    const { blueprints, isDebug, imgSrc, shopId } = props;

    return (<div className="wrap">
            { blueprints.splice(0, 9).map(x => 
                    <AltProduct key={x.id} activeBlueprint={x} imgSrc={imgSrc} shopId={shopId} isDebug={isDebug} />
                )
            }
        </div>);
}

const AltProduct = (props) => {
    const { isDebug, activeBlueprint, imgSrc, shopId } = props;
    const [product, setProduct] = useState('');
    const [variants, setVariants] = useState({});
    const [variantId, setVariantId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const printProvider = useRef('');
    const blueprint = useRef('');

    const handleChooseBlueprint = async (blueprintData) => {
        const printProviders = (await getPrintProvidersAsync(blueprintData.id)).data;
        if (isDebug) {
            console.log("print providers: ", printProviders);
        }
        blueprint.current = blueprintData;
        printProvider.current = printProviders[0];
        if (isDebug) {
            console.log('blueprint', blueprint.current);
        }
        getVariantsAsync(blueprintData.id, printProviders[0].id).then(x =>
        {
            setVariants(y => x.data.variants);
            const first = x.data.variants[0];
            if (first) {
                handleChooseVariant(first.id);
            }
        });
    }
    const handleChooseVariant = async (variantId) => {
        setVariantId(x => variantId);

        await handleCreateProduct(imgSrc, variantId);
    }
    const handleCreateProduct = async (src, variantId) => {
        setIsLoading(x => true);
        //setProduct(x => undefined);
        //setBasePriceUsd(x => 0);
        const uploadedImg = (await uploadImageAsync("testImg001.jpg", src)).data;
        //console.log('uploaded:', uploadedImg);
        //console.log(uploadedImg);
        //console.log(variantId);
        //console.log(blueprint.current);
        const usedVariants = [getVariant(variantId, 1900)];
        const scale = blueprint.current.id === 68 ? 0.7 
            : ([220, 223, 229, 232].includes(blueprint.current.id) ? 0.8 : 1);
        const printAreas = [getPrintArea([variantId], uploadedImg.id, 0.5, 0.5, scale, 0)];
        const chain = '';
        const wallet = '';
        const product = (await saveProductAsync(shopId, 'product on chain ' + chain, 'product for ' + wallet, blueprint.current.id, printProvider.current.id, usedVariants, printAreas)).data;
        if (isDebug) {
            console.log("product:", product);
        }
        if (product.errors) {
            setIsLoading(x => false);
            return;
        }
        if (product && product.images && product.images.length > 0) {
            new Image().src = product.images[0].src; // Preload image
        }
        setProduct(x => product);
        setIsLoading(x => true);
        if (isDebug && product.variants) {
            console.log("base price:", product.variants.find(y => y.id === variantId)?.cost);
        }
        /*setBasePriceUsd(x => product.variants.find(y => y.id === variantId)?.cost ?? 0);
        const shippingData = (await getShippingAsync(blueprint.current.id, printProvider.current.id)).data;
        if (isDebug) {
            console.log("shipping data:", shippingData);
        }
        shippingPrintify.current = shippingData.profiles;
        setShippingOptions(x => [' '].concat(shippingData.profiles.map(y => y.countries[0].replace(/_/g, ' '))));
        updateShippingPrice();*/
        //setIsLoading(x => false);
    }
    const divProducts = (blueprintId) => (<div>
            {isLoading &&
                <img src={process.env.PUBLIC_URL + "/loading.gif"} className="loading" alt="loading" />
            }
            { blueprintId === blueprint.current.id && product && variants.find(x => x.id === variantId)
                && <DivProduct product={product} isDebug={isDebug} setIsLoading={setIsLoading} />}
        </div>
    );

    useEffect(() => {
        handleChooseBlueprint(activeBlueprint);
    }, []);

    return (<div>
        {divProducts(blueprint.current.id)}
    </div>)
}

export default AltProducts;