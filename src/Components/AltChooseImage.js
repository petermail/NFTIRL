import { useEffect, useState } from "react";
import DivImage from "./DivImage";

const AltChooseImage = (props) => {
    const defaultImages = ['BitcoinLogo.png', 'ethereum.png', 'NotYourBankNotYourMoney.png', 
        'NotYourBankNotYourMoney2.png', 'NotYourKeysNotYourCoins.png', 'EthereumText.png', 'Bitcoin.png']
        .map(x => "https://github.com/petermail/NFTIRL/raw/master/public/" + x);
    const { imgSrc, setImgSrc, images } = props;
    const [left, setLeft] = useState(0);

    const handleNav = (toLeft) => {
        if (left > 0 && toLeft === -1) {
            setLeft(x => x + toLeft);
        } else if (toLeft === 1 && images.length - left - 5 > 0) {
            setLeft(x => x + toLeft);
        }
    }

    const getClass = (src) => {
        return (imgSrc === src ? 'selectedImage' : 'choiceImage') + ' imageFit';
    }

    if (images.length === 0) {
        defaultImages.forEach(element => {
            images.push(element);
        });
    }

    useEffect(() => {
        if (!imgSrc || !defaultImages.find(x => x === imgSrc)) {
            setImgSrc(x => x = defaultImages[0]);
        }
    }, [])

    return (<div className="images">
        <div className={"navIcon" + (left === 0 ? " disable" : "")} onClick={() => handleNav(-1)}>
            <img src={process.env.PUBLIC_URL + "/icon_left.png"} alt="left" />
        </div>
            {images.slice(0 + left, 5 + left).map((x, i) => <img className={getClass(x)} key={i} src={x} alt='' width={160} height={160} onClick={() => setImgSrc(x)} />)}
        <div className={"navIcon" + (images.length - left - 5 <= 0 ? " disable" : "")} onClick={() => handleNav(+1)}>
            <img src={process.env.PUBLIC_URL + "/icon_right.png"} alt="right" />
        </div>
    </div>)
}

export default AltChooseImage;