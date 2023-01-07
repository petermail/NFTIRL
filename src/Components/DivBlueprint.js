import '../index.css';


const DivBlueprint = (props) => {
    const { blueprint, handleChooseBlueprint, divVariants, divProducts } = props;

    if (blueprint) {
        return (
        <div className="blueprint" onClick={() => handleChooseBlueprint(blueprint)}>
            <div className="tooltip">
                <h4 className="title">{blueprint.title}</h4>
                <div className="tooltipText">
                    <div className="bold">{blueprint.brand}</div>
                    <div dangerouslySetInnerHTML={{__html: blueprint.description}}></div>
                </div>
            </div>
            <div>
            {
                blueprint.images.map(x => <img key={x} alt='' src={x} width='100' height='100' />)
            }
            </div>
            {divVariants(blueprint.id)}
            {divProducts(blueprint.id)}
            {/*<div onClick={() => handleChooseBlueprint(blueprint)}>choose</div>*/}
        </div>)
    } else { return (<div />) }
}

export default DivBlueprint;