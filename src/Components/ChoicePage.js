import { useEffect, useMemo, useRef, useState } from "react";
import { getBlueprintsAsync, getPrintArea, getPrintProvidersAsync, getShippingAsync, getShopsAsync, getVariant, getVariantsAsync, saveProductAsync, uploadImageAsync } from "../Api/PrintifyApi";
import ChooseImage from "./ChooseImage";
import DivBlueprints from "./DivBlueprints";
import DivWallet from './DivWallet';
import DivImage from "./DivImage";
import DivProduct from "./DivProduct";
import DivVariants from "./DivVariants";
import { WalletButton } from "./WalletButton";
import { addChain, connect, fixChecksumAddress, getBalance, getBalanceOf, getWeb3 } from "../Logic/WalletConn";
import { getChainMainCoin, getChainName } from "./Converters";
import { CHAIN_AVALANCHE, CHAIN_BINANCE, CHAIN_CRONOS, CHAIN_ETHEREUM, CHAIN_FANTOM, CHAIN_OPTIMISM, CHAIN_POLYGON } from "./Units";
import { getAllNftsAsync } from "../Api/NftApi";
import { DivShipping } from "./DivShipping";
import { DivPrice } from "./DivPrice";
import { DivPay } from "./DivPay";

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
    const shipping = useRef({});
    const shippingPrintify = useRef({});
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingPrice, setShippingPrice] = useState({});
    const [basePriceUsd, setBasePriceUsd] = useState(0);
    const [usdc, setUsdc] = useState(0);
    const [usdt, setUsdt] = useState(0);
    const [busd, setBusd] = useState(0);
    
    const [wallet, setWallet] = useState("");
    const [chain, setChain] = useState("");
    const [balance, setBalance] = useState(0);
    const [web3, setWeb3] = useState(null);
    const [eth, setEth] = useState(null);
    const [images, setImages] = useState([]);
    
    useEffect(() => {
        console.log("images:");
        console.log(images);
    }, [images]);

    
    useEffect(() => {
        if (web3 == null || wallet == null || wallet.length === 0){ return; }

        try {
            getBalance(web3, wallet, x => setBalance(x));
            getBalanceOf(web3, wallet, "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", x => setUsdc(y => x));
            getBalanceOf(web3, wallet, "0xdac17f958d2ee523a2206206994597c13d831ec7", x => setUsdt(y => x));
            getBalanceOf(web3, wallet, "0x4Fabb145d64652a948d72533023f6E7A623C7C53", x => setBusd(y => x));
        } catch {
            setBalance(x => x = 0);
        }
        
        console.log("wallet changed");
        const tempWallet = "0x8c92e2Cdb999f84d2c54459Bd9F23388ab84921A";//"0x3E9E20680dF719E874b60Cd44a9329cc629bC4f1";
        getAllNftsAsync(tempWallet).then(x => {
            console.log(x);
            if (x && x.ownedNfts) {
                setImages(z => x.ownedNfts.filter(y => y.rawMetadata.image).map(y => y.rawMetadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')));
            }
        });
    }, [wallet, web3]);
    useEffect(() => {
        if (!isFirstRun) { return; }
        isFirstRun = false;
        getShopsAsync().then(x => setShopId(y => x.data[0].id));
        getBlueprintsAsync().then(x => { 
            setBlueprints(y => x.data);
        });
    });
    useEffect(() => {
        if (variantId) {
            handleCreateProduct(imgSrc, variantId);
        }
    }, [imgSrc]);

    const addPolygon = () => {
        addChain(eth, CHAIN_POLYGON, getChainName(CHAIN_POLYGON), 
            "Matic", getChainMainCoin(CHAIN_POLYGON), ["https://rpc-mainnet.matic.network"], ["https://explorer.matic.network"]);
    }
    const addEthereum = () => {
        addChain(eth, CHAIN_ETHEREUM, getChainName(CHAIN_ETHEREUM),
            "Ethereum", getChainMainCoin(CHAIN_ETHEREUM), ["https://eth.llamarpc.com"]);
    }
    const addBinance = () => {
        addChain(eth, CHAIN_BINANCE, getChainName(CHAIN_BINANCE),
            "Binance", getChainMainCoin(CHAIN_BINANCE), ["https://bsc-dataseed3.binance.org"]);
    }
    const addCronos = () => {
        addChain(eth, CHAIN_CRONOS, getChainName(CHAIN_CRONOS),
            "Cronos", getChainMainCoin(CHAIN_CRONOS), ["https://evm.cronos.org"]);
    }
    const addOptimism = () => {
        addChain(eth, CHAIN_OPTIMISM, getChainName(CHAIN_OPTIMISM),
            "Ethereum", getChainMainCoin(CHAIN_OPTIMISM), ["https://mainnet.optimism.io"]);
    }
    const addFantom = () => {
        addChain(eth, CHAIN_FANTOM, getChainName(CHAIN_FANTOM),
            "Fantom", getChainMainCoin(CHAIN_FANTOM), ["https://rpc.fantom.network"]);
    }
    const addAvalanche = () => {
        addChain(eth, CHAIN_AVALANCHE, getChainName(CHAIN_AVALANCHE),
            "Avalanche", getChainMainCoin(CHAIN_AVALANCHE), ["https://avalanche-evm.publicnode.com"]);
    }

    
    const connectHandler = () => {
        setWeb3(x => x = getWeb3());
    }
    useEffect(() => {
        if (web3 === null){ return; }
        connect((eth) => {
            setEth(x => x = eth);
            setChain(x => x = eth.networkVersion);
            web3?.eth.getAccounts().then(accounts => {
                const acc = fixChecksumAddress(web3, accounts[0]);
                setWallet(x => x = acc);
            })
        }, (network) => {
            const chain = parseInt(network, 16);
            setChain(x => x = chain);
            web3.eth.getAccounts().then(accounts => {
              const acc = fixChecksumAddress(web3, accounts[0]);
              setWallet(x => x = acc);
            });
        }, (account) => {
            const acc = fixChecksumAddress(web3, account);
            setWallet(x => x = acc);
        });
    }, [web3]);
    useEffect(() => {
        // Logic when chain is changed
    }, [chain])

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
        console.log('handleChooseVariant: ' + variantId);
        setVariantId(x => variantId);

        await handleCreateProduct(imgSrc, variantId);
    }
    const handleCreateProduct = async (src, variantId) => {
        //setProduct(x => undefined);
        //setBasePriceUsd(x => 0);
        console.log('handleCreateProduct');
        const uploadedImg = (await uploadImageAsync("testImg001.jpg", src)).data;
        //console.log(uploadedImg);
        //console.log(variantId);
        //console.log(blueprint.current);
        const usedVariants = [getVariant(variantId, 2500)];
        const printAreas = [getPrintArea([variantId], uploadedImg.id, 0.5, 0.5, 1, 0)];
        const product = (await saveProductAsync(shopId, 'test title', 'test desc', blueprint.current.id, printProvider.current.id, usedVariants, printAreas)).data;
        console.log("product:");
        console.log(product);
        setProduct(x => product);
        console.log("base price:");
        console.log(product.variants.find(y => y.id === variantId)?.cost);
        setBasePriceUsd(x => product.variants.find(y => y.id === variantId)?.cost ?? 0);
        const shippingData = (await getShippingAsync(blueprint.current.id, printProvider.current.id)).data;
        console.log(shippingData);
        shippingPrintify.current = shippingData.profiles;
        setShippingOptions(x => shippingData.profiles.map(y => y.countries[0].replace(/_/g, ' ')));
    }
    const handleShippingChange = (combine, shippingValue) => {
        combine(shipping.current, shippingValue);
        //console.log(shipping.current);
        if (shipping.current && shipping.current.region) {
            const priceRow = shippingPrintify.current.find(x => x.countries[0].replace(/_/g, ' ') === shipping.current.region);
            if (priceRow) {
                setShippingPrice(x => priceRow.first_item); // first_item: {cost: 240, currency: 'USD'}
            }
        }
    }

    const divVariants = (blueprintId) => (<div>
    { blueprintId === blueprint.current.id && variants.length > 0 &&
        <DivVariants variants={variants} handleChooseVariant={handleChooseVariant} handleCreateProduct={handleCreateProduct} variantId={variantId} />
    }</div>);
    const divProducts = (blueprintId) => (<div>
            { blueprintId === blueprint.current.id && product && variants.find(x => x.id === variantId)
                && <DivProduct product={product} />}
        </div>
    );
    return (<div className="body">
        {/*<DivWallet />*/}
        
        <div>
            <DivBlueprints blueprints={blueprints} handleChooseBlueprint={handleChooseBlueprint} 
                divVariants={divVariants} divProducts={divProducts} blueprint={blueprint.current} />
        </div>
        <div className="mainLayout">
            {divProducts(blueprint.current.id)}
        </div>
        {divVariants(blueprint.current.id)}
        <div>
            <WalletButton connectHandler={connectHandler} 
                addPolygon={addPolygon} addEthereum={addEthereum} addBinance={addBinance} addOptimism={addOptimism} 
                addFantom={addFantom} addAvalanche={addAvalanche} addCronos={addCronos}
                wallet={wallet} balance={balance} chain={chain} />
                
            <DivPrice basePriceUsd={basePriceUsd} />
            <ChooseImage imgSrc={imgSrc} setImgSrc={setImgSrc} images={images} handleCreateProduct={handleCreateProduct} />
            {/*<DivImage handleCreateProduct={handleCreateProduct} src={imgSrc} setSrc={setImgSrc} />*/}

            <DivShipping options={shippingOptions} handleShippingChange={handleShippingChange} />
            <DivPay usdt={usdt} usdc={usdc} busd={busd} chain={chain} basePriceUsd={basePriceUsd} shippingPrice={shippingPrice} />
        </div>
    </div>)
}

export default ChoicePage;