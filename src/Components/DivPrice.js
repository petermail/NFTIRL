import { getFullPrice } from "../Logic/CalculationLogic";

export const DivPrice = (props) => {
    const { basePriceUsd, shippingPrice } = props;

    const includeShipping = shippingPrice && shippingPrice.currency === 'USD';

    if (!basePriceUsd || basePriceUsd === 0) { return <div /> }
    return (<div>
        <div className="price">${getFullPrice(basePriceUsd, shippingPrice)}{includeShipping ? "*" : ""}</div>
        {includeShipping &&
            <>*shipping included</>
        }
    </div>)
}