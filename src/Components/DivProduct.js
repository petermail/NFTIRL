
const DivProduct = (props) => {
    const { product } = props;

    return (<div>
        {/*<h4>{product.title}</h4>*/}
        {product && product.images && product.images.filter(x => x.position === "front" || x.position === "other").map((x, i) => 
            <div key={i} className="imgWithDetail">
                <img src={x.src} width={200} height={200} alt='' />
                <div className="imgDetail">
                    <img src={x.src} alt='' width={400} height={400} />
                </div>
            </div>
        )}
        {/*<div>{product.tags.map(x => <div key={x}>{x}</div>)}</div>*/}
    </div>)
}

export default DivProduct;