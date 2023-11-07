import { createContext, useContext, useState } from "react";
import { getBlueprintsAsync, getPrintArea, getPrintProvidersAsync, getShopsAsync, getVariant, getVariantsAsync, saveProductAsync, uploadImageAsync } from "../Api/PrintifyApi";

export const DataContext = createContext(null);

export function useData(){
    return useContext(DataContext);
}

export function DataProvider(props){
    const [isLoading, setIsLoading] = useState(false);
    const isDebug = false;
    const item = {
        shopId: 6270768,
        blueprints: [],
        blueprint: {},
        printProvider: {},
        variants: [],
        variantId: -1,
        product: {},
        image: 'https://github.com/petermail/NFTIRL/raw/master/public/BitcoinLogo.png',
        allowedBlueprints: [12, 6, 49, 88, 1108, 618, 789, 1090, 892],
    };

    const loadBlueprints = () => {
        getShopsAsync().then(x => item.shopId = x);
        getBlueprintsAsync().then(x => {
            item.blueprints = x.data.filter(y => item.allowedBlueprints.includes(y.id))

            const first = item.blueprints[0];
            if (first) {
                chooseBlueprint(first);
            }
        });
    }
    const chooseBlueprint = async (blueprintData) => {
        const printProviders = (await getPrintProvidersAsync(blueprintData.id)).data;
        if (isDebug) {
            console.log("print providers: ", printProviders);
        }
        item.blueprint = blueprintData;
        item.printProvider = printProviders[0];
        if (isDebug) {
            console.log('blueprint', item.blueprint);
        }
        getVariantsAsync(blueprintData.id, printProviders[0].id).then(x =>
        {
            item.variants = x.data.variants;
            if (isDebug) {
                console.log('variants', x.data.variants);
            }
            const first = x.data.variants[0];
            if (first) {
                handleChooseVariant(first.id);
            }
        });
    }
    const handleChooseVariant = async (variantId) => {
        item.variantId = variantId;
    
        await handleCreateProduct(item.image, variantId);
    }
    const handleCreateProduct = async (src, variantId) => {
            setIsLoading(() => true);
            const uploadedImg = (await uploadImageAsync("testImg001.jpg", src)).data;
            const usedVariants = [getVariant(variantId, 1900)];
            const scale = item.blueprint.id === 68 ? 0.7 
                : ([220, 223, 229, 232].includes(item.blueprint.id) ? 0.8 : 1);
            const printAreas = [getPrintArea([variantId], uploadedImg.id, 0.5, 0.5, scale, 0)];
            const chain = '';
            const wallet = '';
            const product = (await saveProductAsync(item.shopId, 'product on chain ' + chain, 'product for ' + wallet, item.blueprint.id, item.printProvider.id, usedVariants, printAreas)).data;
            if (isDebug) {
                console.log("product:", product);
            }
            if (product.errors) {
                setIsLoading(x => false);
                return;
            }
            if (product && product.images && product.images.length > 0) {
                const img = new Image();
                img.onerror += (ev) => {
                    setTimeout(function () {
                        new Image().src = product.images[0].src; // Preload image
                    }, 2000);
                };
                img.src = product.images[0].src; // Preload image
            }
            item.product = product;
            setIsLoading(x => false);
            if (isDebug && product.variants) {
                console.log("base price:", product.variants.find(y => y.id === variantId)?.cost);
            }
    }
    
    loadBlueprints();

    return (<DataContext.Provider value={{item, isLoading}}>
        {props.children}
    </DataContext.Provider>)
}
