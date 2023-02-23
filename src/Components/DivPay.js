import { useState } from "react";
import { getFullPrice } from "../Logic/CalculationLogic";
import { getChainName } from "./Converters";
import { DivPrice } from "./DivPrice";

export const DivPay = (props) => {
    const { chain, usdt, usdc, busd, basePriceUsd, shippingPrice } = props;
    const [isExpanded, setIsExpanded] = useState(false);
    const [payToken, setPayToken] = useState('usdt');

    return (<div className="margin20">
        <div onClick={() => setIsExpanded(x => x = !x)} className="middle">
            <img className={"rotatable" + (isExpanded ? "" : " rotate")} src={process.env.PUBLIC_URL + "/icon_bottom.png"} alt="expand/collapse" width={20} />
            &nbsp; Payment
        </div>
        { isExpanded && 
            <div>
                <div className="column">
                    <DivPrice basePriceUsd={basePriceUsd} shippingPrice={shippingPrice} />
                </div>
                <div className="column">
                    pay with USDT, USDC or BUSD
                    <div className="wrap">
                        <div className={"payToken" + (payToken === "usdt" ? " selected" : "")} onClick={() => setPayToken(x => "usdt")}>{usdt} USDT <img src={process.env.PUBLIC_URL + "/usdt.png"} alt="USDT" width={20} /></div>
                        <div className={"payToken" + (payToken === "usdc" ? " selected" : "")} onClick={() => setPayToken(x => "usdc")}>{usdc} USDC <img src={process.env.PUBLIC_URL + "/usdc.png"} alt="USDT" width={20} /></div>
                        <div className={"payToken" + (payToken === "busd" ? " selected" : "")} onClick={() => setPayToken(x => "busd")}>{busd} BUSD <img src={process.env.PUBLIC_URL + "/busd.png"} alt="USDT" width={20} /></div>
                        
                    </div>
                    
                </div>
                
                <div className="column button">
                    pay <span className="price">{getFullPrice(basePriceUsd, shippingPrice)} {payToken.toUpperCase()}</span>
                </div>
            </div>
        }
    </div>)
}