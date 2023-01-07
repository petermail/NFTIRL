
const DivVariant = (props) => {
    const { variant, handleChooseVariant } = props;

    return (<div className="variant" onClick={() => handleChooseVariant(variant.id)}>
        <h4 className="title">{variant.options.color}</h4>
        <div className="title">{variant.options.size}</div>
        {/*<div onClick={() => handleChooseVariant(variant.id)}>choose</div>*/}
    </div>)
}

export default DivVariant;