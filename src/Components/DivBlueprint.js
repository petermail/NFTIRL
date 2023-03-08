import '../index.css';


const DivBlueprint = (props) => {
    const { blueprint, handleChooseBlueprint, divVariants, divProducts, isSelected } = props;

    const getImgIndex = () => {
        if (blueprint && blueprint.id === 6) {
            return 3;
        }
        return 0;
    }
    const index = getImgIndex();

    if (blueprint) {
        return (
        <div className={"blueprint" + (isSelected ? " selected" : "")} onClick={() => handleChooseBlueprint(blueprint)}>
            <div className="tooltip">
                <h4 className="title">{blueprint.title}</h4>
                {/*<div className="tooltipText">
                    <div className="bold">{blueprint.brand}</div>
                    <div dangerouslySetInnerHTML={{__html: blueprint.description}}></div>
                </div>*/}
            </div>
            <div>
            {
                blueprint.images.slice(index, index + 1).map(x => <img key={x} alt='' className="topImage" src={x} width='160' height='160' />)
            }
            </div>
            {/*divVariants(blueprint.id)*/}
            {/*divProducts(blueprint.id)*/}
        </div>)
    } else { return (<div />) }
}

export default DivBlueprint;