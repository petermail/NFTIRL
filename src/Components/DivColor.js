
export const DivColor = (props) => {
    const { color, colorValue, isSelected, isAvailable, handleSelected } = props;

    return (<div className={(isSelected ? "selected" : "") + (isAvailable ? "" : " unavailable")}>
        <div className="colorVariant" onClick={handleSelected} style={{backgroundColor: colorValue}}>
        </div>
    </div>)
}