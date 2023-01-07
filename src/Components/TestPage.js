import { useEffect } from 'react';
import { getBlueprintsAsync, getImagesAsync, getPrintArea, getPrintProvidersAsync, getShippingAsync, getShopsAsync, getVariant, getVariantsAsync, saveProductAsync, uploadImageAsync } from '../Api/PrintifyApi'
import ChoicePage from './ChoicePage';
import DivBlueprints from './DivBlueprints';

var isFirstRun = true;
const runTest = async () => {
    if (!isFirstRun) { return; }
    isFirstRun = false;
    console.log("shop:");
    const shops = (await getShopsAsync()).data;
    console.log(shops);
    if (shops === "Service Unavailable") { return; }
    const shopId = shops[0].id;
    console.log('shopId: ' + shopId);
    /*const img = "https://tse3.mm.bing.net/th?id=OIP.Lu6H5BsniDS6PGMxNWePQgHaFj";
    const uploadRes = (await uploadImageAsync("testImg.jpg", img)).data;
    console.log(uploadRes);
    const imgs = (await getImagesAsync()).data;
    console.log(imgs);
    const imgId = imgs.data[0].id;
    console.log(imgId);
    console.log("-------------");
    const blueprints = (await getBlueprintsAsync()).data;
    console.log(blueprints);
    const blueprintId = blueprints[1].id;
    const printProviders = (await getPrintProvidersAsync(blueprintId)).data;
    console.log(printProviders);
    const printProviderId = printProviders[0].id
    const shipping = (await getShippingAsync(blueprintId, printProviderId)).data;
    console.log(shipping);
    const variants = (await getVariantsAsync(blueprintId, printProviderId)).data;
    console.log('variants:');
    console.log(variants);
    const variantId = variants.variants[0].id
    const printAreas = [getPrintArea([variantId], imgId, 0.5, 0.5, 1, 0)];
    const usedVariants = [getVariant(variantId, 500)];
    const product = (await saveProductAsync(shopId, "Test title", "Test desc", blueprintId, printProviderId, usedVariants, printAreas)).data;
    console.log(product);*/
}
const TestPage = () => {
    useEffect(() => {
        //runTest();
    }, []);

    return (
        <div>
            <ChoicePage />
        </div>
    )
};

export default TestPage;