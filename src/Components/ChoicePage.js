import { useEffect, useRef, useState } from "react";
import { getBlueprintsAsync, getPrintArea, getPrintProvidersAsync, getShopsAsync, getVariant, getVariantsAsync, saveProductAsync, uploadImageAsync } from "../Api/PrintifyApi";
import ChooseImage from "./ChooseImage";
import DivBlueprints from "./DivBlueprints";
import DivImage from "./DivImage";
import DivProduct from "./DivProduct";
import DivVariants from "./DivVariants";

var isFirstRun = true;
const ChoicePage = () => {
    //const [printProvider, setPrintProvider] = useState('');
    //const [blueprint, setBlueprint] = useState('');
    //const [data, setData] = useState('');
    const [variants, setVariants] = useState([]);
    const [shopId, setShopId] = useState('');
    const [product, setProduct] = useState('');
    const [variantId, setVariantId] = useState('');
    const [blueprints, setBlueprints] = useState([]);
    const [imgSrc, setImgSrc] = useState('https://tse2.mm.bing.net/th?id=OIP.oVeiT4LzCXtk9JVBfN-gMQHaE7');
    const blueprint = useRef('');
    const printProvider = useRef('');

    useEffect(() => {
        if (!isFirstRun) { return; }
        isFirstRun = false;
        getShopsAsync().then(x => setShopId(y => x.data[0].id));
        getBlueprintsAsync().then(x => { 
            setBlueprints(y => x.data);
        });
    })

    const handleChooseBlueprint = async (blueprintData) => {
        //if (variants.length === 0) {
        //console.log('stuff:');
        const printProviders = (await getPrintProvidersAsync(blueprintData.id)).data;
        //console.log(printProviders);
        //console.log('blueprint:');
        //console.log(blueprintData);
        //setPrintProvider(x => printProviders[0]);
        //setBlueprint(x => blueprint);
        blueprint.current = blueprintData;
        printProvider.current = printProviders[0];
        //setData(x => x = { blueprint: blueprint, printProvider: printProviders[0] })
        getVariantsAsync(blueprintData.id, printProviders[0].id).then(x =>
        {
            setVariants(y => x.data.variants); 
        });
        //}
    }
    const handleChooseVariant = async (variantId) => {
        //console.log('handleChooseVariant');
        setVariantId(x => variantId);

        await handleCreateProduct(imgSrc, variantId);
    }
    const handleCreateProduct = async (src, variantId) => {
        setProduct(x => undefined);
        //console.log('handleCreateProduct');
        const uploadedImg = (await uploadImageAsync("testImg001.jpg", src)).data;
        //console.log(uploadedImg);
        //console.log(variantId);
        //console.log(blueprint.current);
        const usedVariants = [getVariant(variantId, 2500)];
        const printAreas = [getPrintArea([variantId], uploadedImg.id, 0.5, 0.5, 1, 0)];
        const product = (await saveProductAsync(shopId, 'test title', 'test desc', blueprint.current.id, printProvider.current.id, usedVariants, printAreas)).data;
        //console.log(product);
        setProduct(x => product);
    }

    const divVariants = (blueprintId) => (<div>
    { blueprintId === blueprint.current.id && variants.length > 0 &&
        <DivVariants variants={variants} handleChooseVariant={handleChooseVariant} handleCreateProduct={handleCreateProduct} />
    }</div>);
    const divProducts = (blueprintId) => (<div>
            { blueprintId === blueprint.current.id && product && variants.find(x => x.id === variantId)
                && <DivProduct product={product} />}
        </div>
    );
    return (<div>
        <DivImage handleCreateProduct={handleCreateProduct} src={imgSrc} setSrc={setImgSrc} />
        <ChooseImage imgSrc={imgSrc} setImgSrc={setImgSrc} />
        <DivBlueprints blueprints={blueprints} handleChooseBlueprint={handleChooseBlueprint} 
            divVariants={divVariants} divProducts={divProducts} />
    </div>)
}

export default ChoicePage;