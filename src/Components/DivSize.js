
export const DivSize = (props) => {
    const { size, isSelected, isAvailable, handleSelected } = props;

    return (<div className={(isSelected ? "selected" : "") + (isAvailable ? "" : " unavailable")}>
        <div className="sizeVariant" onClick={handleSelected}>
            {size}
        </div>
    </div>)
}