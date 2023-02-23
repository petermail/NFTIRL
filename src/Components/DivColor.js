
export const DivColor = (props) => {
    const { color, isSelected, handleSelected } = props;

    return (<div className={isSelected ? "selected" : ""}>
        <div className="colorVariant" onClick={handleSelected}>
            <div className={"cl" + color + " fill"} />
        </div>
    </div>)
}