import { useState } from "react";
import DivImage from "./DivImage";

const ChooseImage = (props) => {
    const defaultImages = ['https://tse4.mm.bing.net/th?id=OIP.yCfii-S-bS1UXp_XVoqAyAHaFV',
        'https://tse2.mm.bing.net/th?id=OIP.oVeiT4LzCXtk9JVBfN-gMQHaE7',
        'https://www.tech-recipes.com/wp-content/uploads/2018/07/featured-6.jpg'];
    const { imgSrc, setImgSrc, images, handleCreateProduct } = props;
    const [isExpanded, setIsExpanded] = useState(true);

    const getClass = (src) => {
        return imgSrc === src ? 'selectedImage' : 'choiceImage';
    }

    //console.log(images);
    return (<div className="margin20 nfts">
        
        {imgSrc && !isExpanded &&
            <span className="selected left"><img src={imgSrc} alt="thumbnail" width={40} /></span>
        }
        <div onClick={() => setIsExpanded(x => x = !x)} className="middle">
            <img className={"rotatable" + (isExpanded ? "" : " rotate")} src={process.env.PUBLIC_URL + "/icon_bottom.png"} alt="expand/collapse" width={20} />
            &nbsp; NFTs from Ethereum
            &nbsp;<img src={process.env.PUBLIC_URL + "/Ethereum.png"} alt="Ethereum" width={16} />
        </div>
        { isExpanded &&
        <div>
            <div className="images">
                {images.map((x, i) => <img className={getClass(x)} key={i} src={x} alt='' height={100} onClick={() => setImgSrc(x)} />)}
                {!images.includes(imgSrc) && 
                    <img className={getClass(imgSrc)} key={imgSrc} src={imgSrc} alt='' height={100} onClick={() => setImgSrc(imgSrc)} />
                }
            </div>

            <DivImage handleCreateProduct={handleCreateProduct} src={imgSrc} setSrc={setImgSrc} />
        </div>
        }
        { !isExpanded &&
            <div className="clear" />
        }
    </div>)
}

export default ChooseImage;