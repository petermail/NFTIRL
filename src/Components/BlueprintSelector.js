
export const BlueprintSelector = (props) => {
    const { blueprints } = props;

    return (<div>
        {blueprints.map((x, i) => <div key={i}><img src={x} alt='blueprint' /></div>)}
    </div>)
}