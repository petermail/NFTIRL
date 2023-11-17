import { createContext, useContext, useEffect, useState } from "react";
import { getBlueprintsAsync, getPrintArea, getPrintProvidersAsync, getShopsAsync, getVariant, getVariantsAsync, saveProductAsync, uploadImageAsync } from "../Api/PrintifyApi";

export const DataContext = createContext(null);

export function useData(){
    return useContext(DataContext);
}

export function DataProvider(props){
    const [isLoading, setIsLoading] = useState(false);
    const [blueprints, setBlueprints] = useState([]);
    const [products, setProducts] = useState([]);
    const isDebug = true;
    const [item, setItems] = useState({
        shopId: 6270768,
        blueprints: [],

        data: [{
            blueprint: {},
            printProvider: {},
            variants: [],
            variantId: -1,
            product: {},
        }],
        image: 'https://github.com/petermail/NFTIRL/raw/master/public/BitcoinLogo.png',
        allowedBlueprints: [12, 6, 49, 88, 1108, 618, 789, 1090, 892],
    });
    const count = 9;

    const addData = (blueprint) => {
        console.log('added blueprint', blueprint);
        item.data.push({
            blueprint: blueprint,
            printProvider: {},
            variants: [],
            variantId: -1,
            product: {},
            isLoading: false
        });
        console.log('added', item.data);
    }
    const getData = (blueprintId) => {
        return item.data.find(x => x.blueprint.id === blueprintId);
    }

    const changeImage = (image) => {
        if (item.image !== image) {
            item.image = image;
            recreateProduct();
        }
    }

    const recreateProduct = async () => {
        for (let i = 0; i < count && i < item.blueprints.length; ++i) {
            const blueprintId = item.blueprints[i].id;
            const curr = getData(blueprintId);
            
            await handleCreateProduct(blueprintId, item.image, curr.variantId);
        }
    }

    const loadBlueprints = () => {
        console.log('loading blueprints');
        setIsLoading(() => true);
        getShopsAsync().then(x => { 
            item.shopId = x.data[0].id;

            getBlueprintsAsync().then(x => {
                item.blueprints = x.data.filter(y => item.allowedBlueprints.includes(y.id))
                console.log('blueprints', item.blueprints);

                for (let i = 0; i < count && i < item.blueprints.length; ++i) {
                    addData(item.blueprints[i]);
                    if (isDebug) {
                        console.log('process blueprint:', item.blueprints[i]);
                    }
                    chooseBlueprint(item.blueprints[i]);
                }
                setBlueprints(() => item.blueprints);
                setIsLoading(() => false);
            });
        });
    }
    const chooseBlueprint = async (blueprintData) => {
        console.log('load print providers:');
        const printProviders = (await getPrintProvidersAsync(blueprintData.id)).data;
        if (isDebug) {
            console.log("print providers: ", printProviders);
        }
        const curr = getData(blueprintData.id);
        curr.blueprint = blueprintData;
        curr.printProvider = printProviders[0];
        if (isDebug) {
            console.log('blueprint', curr.blueprint);
        }
        getVariantsAsync(blueprintData.id, printProviders[0].id).then(x =>
        {
            curr.variants = x.data.variants;
            if (isDebug) {
                console.log('variants', x.data.variants);
            }
            const first = x.data.variants[0];
            if (first) {
                handleChooseVariant(blueprintData.id, first.id);
            }
        });
    }
    const handleChooseVariant = async (blueprintId, variantId) => {
        const curr = getData(blueprintId);
        if (curr) {
            curr.variantId = variantId;
        
            await handleCreateProduct(blueprintId, item.image, variantId);
        }
    }
    const handleCreateProduct = async (blueprintId, src, variantId) => {
            //setIsLoading(() => true);
            const curr = getData(blueprintId);
            curr.isLoading = true;
            const uploadedImg = (await uploadImageAsync("testImg001.jpg", src)).data;
            const usedVariants = [getVariant(variantId, 1900)];
            const scale = curr.blueprint.id === 68 ? 0.7 
                : ([220, 223, 229, 232].includes(curr.blueprint.id) ? 0.8 : 1);
            const printAreas = [getPrintArea([variantId], uploadedImg.id, 0.5, 0.5, scale, 0)];
            const chain = '';
            const wallet = '';
            const product = (await saveProductAsync(item.shopId, 'product on chain ' + chain, 'product for ' + wallet, curr.blueprint.id, curr.printProvider.id, usedVariants, printAreas)).data;
            if (isDebug) {
                console.log("product:", product);
            }
            if (product.errors) {
                //setIsLoading(x => false);
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
            curr.product = product;
            curr.isLoading = false;
            setProducts(x => item.data.map(y => y.product));
            //setIsLoading(x => false);
            if (isDebug && product.variants) {
                console.log("base price:", product.variants.find(y => y.id === variantId)?.cost);
            }
    }
    
    useEffect(() => {
        loadBlueprints();
    }, []);

    return (<DataContext.Provider value={{item, blueprints, isLoading, products, changeImage, getData, handleChooseVariant, handleCreateProduct}}>
        {props.children}
    </DataContext.Provider>)
}
