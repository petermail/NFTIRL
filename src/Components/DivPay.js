import { useState } from "react";
import { getFullPrice } from "../Logic/CalculationLogic";
import { getChainName } from "./Converters";
import { DivPrice } from "./DivPrice";
import { CHAIN_BINANCE, CHAIN_ETHEREUM } from "./Units";

export const DivPay = (props) => {
    const { chain, usdt, usdc, busd, wallet, basePriceUsd, shippingPrice, onPay, connectHandler } = props;
    const [isExpanded, setIsExpanded] = useState(false);
    const [payToken, setPayToken] = useState('usdt');

    const onClick = () => {
        if (shippingPrice && shippingPrice.cost > 0) {
            onPay();
        }
    }

    //console.log('shippingPrice:', shippingPrice);
    return (<div className="margin20">
        <div onClick={() => setIsExpanded(x => x = !x)} className="middle">
            <img className={"rotatable" + (isExpanded ? "" : " rotate")} src={process.env.PUBLIC_URL + "/icon_bottom.png"} alt="expand/collapse" width={20} />
            &nbsp; Payment
        </div>
        { isExpanded && (wallet === null || wallet.length === 0) &&
            <div className="pointer column" onClick={connectHandler}>connect wallet to pay</div>
        }
        { isExpanded && wallet !== null && wallet.length > 0 &&
            <div>
                <div className="column">
                    balance:
                    <div className="wrap">
                        <div className={"payToken" + (payToken === "usdt" ? " selected" : "")} onClick={() => setPayToken(x => "usdt")}>{usdt} USDT <img src={process.env.PUBLIC_URL + "/usdt.png"} alt="USDT" width={20} /></div>
                        <div className={"payToken" + (payToken === "usdc" ? " selected" : "")} onClick={() => setPayToken(x => "usdc")}>{usdc} USDC <img src={process.env.PUBLIC_URL + "/usdc.png"} alt="USDT" width={20} /></div>
                        { (chain === CHAIN_ETHEREUM || chain === CHAIN_BINANCE) &&
                            <div className={"payToken" + (payToken === "busd" ? " selected" : "")} onClick={() => setPayToken(x => "busd")}>{busd} BUSD <img src={process.env.PUBLIC_URL + "/busd.png"} alt="USDT" width={20} /></div>
                        }
                    </div>
                    
                </div>
                
                <div className="column">
                    <div className={"button" + ((shippingPrice && shippingPrice.cost > 0) ? "" : " disabled")}
                        onClick={onClick}>
                        pay <span className="price">{getFullPrice(basePriceUsd, shippingPrice)} {payToken.toUpperCase()}</span>
                    </div>
                    { (shippingPrice && shippingPrice.cost > 0) &&
                        <span className="priceContext">includes shipping price ${(shippingPrice.cost/100.0).toFixed(2)}</span>
                    }
                    { (!shippingPrice || shippingPrice.cost === 0) &&
                        <span className="priceContext">not available</span>
                    }
                </div>
            </div>
        }
    </div>)
}