
export const DivSize = (props) => {
    const { size, isSelected, handleSelected } = props;

    return (<div className={isSelected ? "selected" : ""}>
        <div className="sizeVariant" onClick={handleSelected}>
            {size}
        </div>
    </div>)
}