import { useEffect, useMemo, useRef, useState } from "react";
import { getBlueprintsAsync, getPrintArea, getPrintProvidersAsync, getShippingAsync, getShopsAsync, getVariant, getVariantsAsync, saveProductAsync, uploadImageAsync, createOrderAsync, createLineItem } from "../Api/PrintifyApi";
import ChooseImage from "./ChooseImage";
import DivBlueprints from "./DivBlueprints";
import DivWallet from './DivWallet';
import DivImage from "./DivImage";
import DivProduct from "./DivProduct";
import DivVariants from "./DivVariants";
import { WalletButton } from "./WalletButton";
import { addChain, connect, fixChecksumAddress, getBalance, getBalanceOf, getWeb3, verifyAddress } from "../Logic/WalletConn";
import { getChainMainCoin, getChainName } from "./Converters";
import { CHAIN_AVALANCHE, CHAIN_BINANCE, CHAIN_CRONOS, CHAIN_ETHEREUM, CHAIN_FANTOM, CHAIN_OPTIMISM, CHAIN_POLYGON } from "./Units";
import { getAllNftsAsync, getNftsForContractAsync } from "../Api/NftApi";
import { DivShipping } from "./DivShipping";
import { DivPrice } from "./DivPrice";
import { DivPay } from "./DivPay";

import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from "react-notifications";
import Web3 from "web3";
import { usdAddresses } from "../Other/Consts";

const { getCode } = require('country-list');

const isDebug = true;
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
    const [imgSrc, setImgSrc] = useState('https://s2.coinmarketcap.com/static/img/coins/64x64/1.png') //https://tse2.mm.bing.net/th?id=OIP.oVeiT4LzCXtk9JVBfN-gMQHaE7');
    const [friendsWallet, setFriendsWallet] = useState('');
    const blueprint = useRef('');
    const printProvider = useRef('');
    const shipping = useRef({ firstName: '', lastName: '', email: '', phone: '', address1: '', 
        address2: '', zip: '', city: '', region: '', country: 'United States of America' });
    const shippingPrintify = useRef({});
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingPrice, setShippingPrice] = useState({});
    const [isShippingDone, setIsShippingDone] = useState(false);
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

    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    
    const updateBalance = () => {
        if (web3 != null && wallet != null && wallet.length > 0) {
            try {
                getBalance(web3, wallet, x => setBalance(x));
                const updateUsdc = x => setUsdc(y => x);
                const updateUsdt = x => setUsdt(y => x);
                const updateBusd = x => setBusd(y => x);
                const addresses = usdAddresses[chain];
                getBalanceOf(web3, wallet, addresses["USDC"], updateUsdc);
                getBalanceOf(web3, wallet, addresses["USDT"], updateUsdt);
                getBalanceOf(web3, wallet, addresses["BUSD"], updateBusd);
            } catch {
                setBalance(x => x = 0);
            }
        } else { setBalance(x => x = 0); }
    }
    useEffect(() => {
        //if (web3 == null){ return; }
        updateBalance();
        
        const usedWallet = friendsWallet ?? wallet;
        if (usedWallet && verifyAddress(web3 ?? new Web3(), usedWallet)) {
            getAllNftsAsync(usedWallet).then(x => {
                console.log(x);
                if (x && x.ownedNfts) {
                    setImages(z => x.ownedNfts.filter(y => y.rawMetadata.image).map(y => y.rawMetadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')));
                }
            });
        }
    }, [wallet, web3, friendsWallet]);
    
    const reorder = (bs) => {
        const indices = [6, 26, 30, 50, 268, 68, 74, 97, 190, 378, 5, 11, 12, 14, 36, 48, 238, 254, 280, 284, 352, 384, 18, 9, 353, 400, 430];
        const reordered = bs.filter(x => indices.includes(x.id));
        const filtered = bs.filter(x => !indices.includes(x.id) && ![40, 143, 167, 255, 256, 291, 292, 306, 329, 346, 347, 348, 349].includes(x.id));
        for (let i = 0; i < indices.length; ++i) {
            filtered.splice(i, 0, reordered.find(x => x.id === indices[i]));
        }
        return filtered;
    }
    useEffect(() => {
        if (!isFirstRun) { return; }
        isFirstRun = false;
        getShopsAsync().then(x => setShopId(y => x.data[0].id));
        getBlueprintsAsync().then(x => { 
            const reordered = reorder(x.data);
            setBlueprints(y => reordered);
        });
    });
    useEffect(() => {
        if (variantId) {
            handleCreateProduct(imgSrc, variantId);
        }
    }, [imgSrc]);
    useEffect(() => {
        if (variants) {
            const newVariantId = variants.filter(x => x.options.size === selectedSize 
                && (x.options?.color === undefined || x.options?.color?.replace(/\s|\//g, '') === selectedColor))[0];
            console.log('variants: ', variants, 'newVariantId: ', newVariantId);
            if (newVariantId && newVariantId.id !== variantId) {
                handleChooseVariant(newVariantId.id);
            }
        }
    }, [variants]);

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

    
    const getBestShipping = async () => {
        const blueprintId = blueprint.current.id;
        const printProviders = (await getPrintProvidersAsync(blueprintId)).data;
        const result = [];
        for (let i = 0; i < printProviders.length; ++i) {
            const shippingData = (await getShippingAsync(blueprintId, printProviders[i].id)).data;
            result.push({ 
                printProvider: printProviders[i].id,
                countries: shippingData.profiles.map(y => y.countries),
                cost: shippingData.profiles.map(y => y.first_item.cost)
            });
        }
        if (isDebug) {
            console.log('best shipping: ', result);
        }
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
        updateBalance();
    }, [chain])

    const createOrder = () => {
        //const front = product.print_areas.map(x => x.placeholders.find(y => y.position === "front"))[0];
        //console.log("front:", front);

        const lineItem = createLineItem(blueprint.current.id, variantId, printProvider.current.id, imgSrc, 0.5, 0.5, 1);
        const shippingMethod = 1; //Standard shipping
        const s = shipping.current;
        const countryCode = getCode(s.country);
        const dateCode = (new Date()).toString();
        createOrderAsync(shopId, wallet + "_" + dateCode, wallet, [lineItem], shippingMethod, 
            s.firstName, s.lastName, s.email, s.phone, countryCode, "", s.address1, s.address2, s.city, s.zip)
            .then(x => console.log('order created:', x));
    }

    const handleChooseBlueprint = async (blueprintData) => {
        //if (variants.length === 0) {
        //console.log('stuff:');
        const printProviders = (await getPrintProvidersAsync(blueprintData.id)).data;
        if (isDebug) {
            console.log("print providers: ", printProviders);
        }
        //console.log('blueprint:');
        //console.log(blueprintData);
        //setPrintProvider(x => printProviders[0]);
        //setBlueprint(x => blueprint);
        blueprint.current = blueprintData;
        printProvider.current = printProviders[0];
        if (isDebug) {
            console.log('blueprint', blueprint.current);
        }
        //setData(x => x = { blueprint: blueprint, printProvider: printProviders[0] })
        getVariantsAsync(blueprintData.id, printProviders[0].id).then(x =>
        {
            setVariants(y => x.data.variants); 
        });
        //}
        
        if (isDebug) {
            getBestShipping(); // TEMP
        }
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
        //console.log(uploadedImg);
        //console.log(variantId);
        //console.log(blueprint.current);
        const usedVariants = [getVariant(variantId, 1900)];
        const scale = blueprint.current.id === 68 ? 0.7 
            : ([220, 223, 229, 232].includes(blueprint.current.id) ? 0.8 : 1);
        const printAreas = [getPrintArea([variantId], uploadedImg.id, 0.5, 0.5, scale, 0)];
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
        setBasePriceUsd(x => product.variants.find(y => y.id === variantId)?.cost ?? 0);
        const shippingData = (await getShippingAsync(blueprint.current.id, printProvider.current.id)).data;
        if (isDebug) {
            console.log("shipping data:", shippingData);
        }
        shippingPrintify.current = shippingData.profiles;
        setShippingOptions(x => [' '].concat(shippingData.profiles.map(y => y.countries[0].replace(/_/g, ' '))));
        updateShippingPrice();
        //setIsLoading(x => false);
    }
    const updateShippingPrice = () => {
        setShippingPrice(x => ({ cost: 0 }));
        if (shipping.current && shipping.current.country) {
            const code = getCode(shipping.current.country);
            let regionShipping = shippingPrintify.current.find(x => x.countries.includes(code));
            if (!regionShipping) {
                regionShipping = shippingPrintify.current.find(x => x.countries[0] === 'REST_OF_THE_WORLD');
            }

            if (regionShipping) {
                setShippingPrice(x => regionShipping.first_item); // first_item: {cost: 240, currency: 'USD'}
            }
        }
    }
    const handleShippingChange = (combine, shippingValue) => {
        combine(shipping.current, shippingValue);
        updateShippingPrice();

        verifyShipping();
    }
    const verifyShipping = () => {
        const val = shipping.current;
        if (val.country && val.firstName && val.lastName && val.email && val.address1 && val.zip && val.city
            && val.email.includes('@') && val.email.includes('.')) {
            setIsShippingDone(x => true);
        } else {
            setIsShippingDone(x => false);
        }
    }

    const divVariants = (blueprintId) => (<div>
    { blueprintId === blueprint.current.id && variants.length > 0 &&
        <DivVariants product={product} variants={variants} handleChooseVariant={handleChooseVariant} 
            handleCreateProduct={handleCreateProduct} variantId={variantId}
            selectedColor={selectedColor} setSelectedColor={setSelectedColor}
            selectedSize={selectedSize} setSelectedSize={setSelectedSize} />
    }</div>);
    const divProducts = (blueprintId) => (<div>
            { blueprintId === blueprint.current.id && product && variants.find(x => x.id === variantId)
                && <DivProduct product={product} isDebug={isDebug} setIsLoading={setIsLoading} />}
        </div>
    );
    return (<div className="body">
        <div>
            <DivBlueprints blueprints={blueprints} handleChooseBlueprint={handleChooseBlueprint} 
                divVariants={divVariants} divProducts={divProducts} blueprint={blueprint.current} />
        </div>
        <div className="mainLayout">
            {isLoading &&
                <img src={process.env.PUBLIC_URL + "/loading.gif"} className="loading" alt="loading" />
            }
            {divProducts(blueprint.current.id)}
        </div>
        {divVariants(blueprint.current.id)}
        <div>
            <WalletButton connectHandler={connectHandler} 
                addPolygon={addPolygon} addEthereum={addEthereum} addBinance={addBinance} addOptimism={addOptimism} 
                addFantom={addFantom} addAvalanche={addAvalanche} addCronos={addCronos}
                wallet={wallet} balance={balance} chain={chain} />
                
            <DivPrice basePriceUsd={basePriceUsd} />
            <ChooseImage imgSrc={imgSrc} setImgSrc={setImgSrc} wallet={wallet} friendsWallet={friendsWallet} setFriendsWallet={setFriendsWallet} 
                images={images} handleCreateProduct={handleCreateProduct} />
            
            <DivShipping options={shippingOptions} handleShippingChange={handleShippingChange} value={shipping.current} isShippingDone={isShippingDone} />
            { isShippingDone &&
                <DivPay usdt={usdt} usdc={usdc} busd={busd} wallet={wallet} chain={chain} web3={web3} connectHandler={connectHandler} basePriceUsd={basePriceUsd} shippingPrice={shippingPrice} onPay={createOrder} />
            }
        </div>

        <NotificationContainer />
        <div className="footer">
            <div className="twitter" />
            <div className="instagram" />
            My IRL NFTs | 2023
        </div>
    </div>)
}

export default ChoicePage;