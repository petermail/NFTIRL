import { CHAIN_POLYGON } from './Units'
import { coinRound, getChainId, getChainMainCoin, getChainName } from './Converters'

export const WalletButton = (props) => {
    const { wallet, balance, connectHandler, addPolygon, addEthereum, addBinance, addOptimism, addAvalanche, addCronos, addFantom, chain } = props;

    const shortenWallet = (wallet) => {
        if (wallet !== null && wallet.length > 13){
            return wallet.substring(0, 6) + "..." + wallet.substring(wallet.length - 4);
        } else {
            return wallet;
        }
    }

    if (wallet.length > 0) {
        const addChain = (chain) => {
            switch (chain) {
                case "binance": addBinance(); break;
                case "polygon": addPolygon(); break;
                case "optimism": addOptimism(); break;
                case "avalanche": addAvalanche(); break;
                case "cronos": addCronos(); break;
                case "fantom": addFantom(); break;
                default:
                case "ethereum": addEthereum(); break;

            }
        }

        return (
            <div className="wrap wallet">
                <div className="connect">connected: <b>{shortenWallet(wallet)}</b> &nbsp; {coinRound(chain, balance)} {getChainMainCoin(props.chain)}</div>
                {["ethereum", "binance", "polygon", "optimism", "cronos", "avalanche", "fantom"].map(x => 
                    <div key={x} className={"connectIcon" + (getChainName(chain).toLowerCase() === x ? " selected" : "")} onClick={() => addChain(x)}>
                        <img src={process.env.PUBLIC_URL + "/" + x + '.png'} alt={"switch to " + x} width="22" />
                    </div>)
                }
            </div>
        )
    } else
    return (
        <div className="connect pointer" onClick={connectHandler}>connect wallet</div>
    )
}