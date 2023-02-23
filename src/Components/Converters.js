
// Round to about 10 USD cents for each coin
export const coinRound = (chain, x) => {
    switch (chain){
        case "42161":
        case "10":
        case "137":
            return Math.round(x * 10) / 10;
        case "1":
        case "56":
        default: return Math.round(x * 1000) / 1000;
    }
}

export const getChainName = (x) => {
    switch (String(x)){
        case "56": return "Binance";
        case "137": return "Polygon";
        case "1": return "Ethereum";
        case "42161": return "Arbitrum One";
        case "43114": return "Avalanche";
        case "10": return "Optimism";
        case "250": return "Fantom";
        case "25": return "Cronos";
        default: return x;
      }
}

export const getChainMainCoin = (x) => {
    switch (String(x)){
      case "56": return "BNB";
      case "137": return "MATIC";
      case "42161":
      case "10":
      case "1": return "ETH";
      case "43114": return "AVAX";
      case "250": return "FTM";
      case "25": return "CRO";
      default: return "coins";
    }
  }