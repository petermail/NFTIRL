import { useState } from "react";

const AltDivProduct = (props) => {
    const { product, isDebug, setIsLoading, getVariants } = props;
    const [index, setIndex] = useState(0);

    const images = product?.images?.filter(x => x.position !== 'back');
    if (images && index >= images.length) { setIndex(x => 0); }
    if (isDebug){
        //console.log('images', images);
    }
    return (<div>
        {/*<h4>{product.title}</h4>*/}
        {product && images && images.slice(index, index + 1).map((x, i) => 
            <div key={i} className="imgWithDetail">
                { isDebug && images.length > 1 &&
                    <div className="pointsImg">
                        <div className="pointsImg2">
                            {images.map((x, i) => <div key={i} className={(index === i ? " selected" : "")}><div className="point" onClick={() => setIndex(y => i)}></div></div>)}
                        </div>
                    </div>
                }
                { isDebug && images.length > 1 &&
                    <div className="navIcon2Right" onClick={() => { setIndex(x => (index + 1) % images.length) }}><img src={process.env.PUBLIC_URL + "/icon_right.png"} alt="right" /></div>
                }
                { isDebug && images.length > 1 &&
                    <div className="navIcon2" onClick={() => { setIndex(x => index > 0 ? index - 1 : images.length - 1); }}><img src={process.env.PUBLIC_URL + "/icon_left.png"} alt="left" /></div>
                }
                {getVariants()}
                <img src={x.src} width={300} height={300} alt='' onLoad={() => setIsLoading(x => false)} />
                {/*<div className="imgDetail">
                    <img src={x.src} alt='' width={500} height={500} />
                </div>*/}
                
            </div>
        )}
        {/*<div>{product.tags.map(x => <div key={x}>{x}</div>)}</div>*/}
    </div>)
}

export default AltDivProduct;