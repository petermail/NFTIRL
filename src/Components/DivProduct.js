
const DivProduct = (props) => {
    const { product } = props;

    return (<div>
        {/*<h4>{product.title}</h4>*/}
        {product && product.images && product.images.slice(0, 1).filter(x => x.position === "front" || x.position === "other").map((x, i) => 
            <div key={i} className="imgWithDetail">
                <img src={x.src} width={400} height={400} alt='' />
                {/*<div className="imgDetail">
                    <img src={x.src} alt='' width={500} height={500} />
                </div>*/}
            </div>
        )}
        {/*<div>{product.tags.map(x => <div key={x}>{x}</div>)}</div>*/}
    </div>)
}

export default DivProduct;