import { useState } from "react";
import DivImage from "./DivImage";

const ChooseImage = (props) => {
    const defaultImages = ['ethereum.png', 'NotYourBankNotYourMoney.png', 
        'NotYourBankNotYourMoney2.png', 'NotYourKeysNotYourCoins.png', 'EthereumText.png', 'Bitcoin.png']
        .map(x => "https://github.com/petermail/NFTIRL/raw/master/public/" + x); 
        /*['https://tse4.mm.bing.net/th?id=OIP.yCfii-S-bS1UXp_XVoqAyAHaFV',
        'https://tse2.mm.bing.net/th?id=OIP.oVeiT4LzCXtk9JVBfN-gMQHaE7',
        'https://www.tech-recipes.com/wp-content/uploads/2018/07/featured-6.jpg'];*/
    const { imgSrc, setImgSrc, friendsWallet, setFriendsWallet, images, handleCreateProduct, wallet } = props;
    const [isExpanded, setIsExpanded] = useState(true);

    const getClass = (src) => {
        return imgSrc === src ? 'selectedImage' : 'choiceImage';
    }

    if (images.length === 0) {
        defaultImages.forEach(element => {
            images.push(element);
        });
    }

    return (<div className="margin20 nfts">
        
        {imgSrc && !isExpanded &&
            <span className="selected left"><img src={imgSrc} alt="thumbnail" width={40} /></span>
        }
        <div onClick={() => setIsExpanded(x => x = !x)} className="middle">
            <img className={"rotatable" + (isExpanded ? "" : " rotate")} src={process.env.PUBLIC_URL + "/icon_bottom.png"} alt="expand/collapse" width={20} />
            { wallet === null &&
                <>&nbsp; NFTs from Ethereum
                &nbsp;<img src={process.env.PUBLIC_URL + "/Ethereum.png"} alt="Ethereum" width={16} />
                </>
            }
            { wallet !== null &&
                <>&nbsp; Default images</>
            }
        </div>
        { isExpanded &&
        <div>
            <div className="images">
                {!images.includes(imgSrc) && 
                    <img className={getClass(imgSrc)} key={imgSrc} src={imgSrc} alt='' height={100} onClick={() => setImgSrc(imgSrc)} />
                }
                {images.map((x, i) => <img className={getClass(x)} key={i} src={x} alt='' height={100} onClick={() => setImgSrc(x)} />)}
            </div>

            <DivImage handleCreateProduct={handleCreateProduct} src={imgSrc} setSrc={setImgSrc}
                friendsWallet={friendsWallet} setFriendsWallet={setFriendsWallet} />
        </div>
        }
        { !isExpanded &&
            <div className="clear" />
        }
    </div>)
}

export default ChooseImage;