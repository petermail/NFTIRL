import { useEffect, useState } from 'react';
import { getBlueprintsAsync } from '../Api/PrintifyApi'
import DivBlueprint from './DivBlueprint';

const DivBlueprints = (props) => {
    const { blueprints, handleChooseBlueprint, divVariants, divProducts, blueprint } = props;
    const [left, setLeft] = useState(0);

    const handleNav = (toLeft) => {
        if (left > 0 && toLeft === -1) {
            setLeft(x => x = x + toLeft);
        } else if (toLeft === 1) {
            setLeft(x => x = x + toLeft);
        }
    }

    return (<div className="blueprints">
        <div className={"navIcon" + (left === 0 ? " disable" : "")} onClick={() => handleNav(-1)}><img src={process.env.PUBLIC_URL + "/icon_left.png"} alt="left" /></div>
        { blueprints && blueprints.slice(left, left + 5).map(x => 
            <DivBlueprint key={x.id} blueprint={x} handleChooseBlueprint={handleChooseBlueprint} 
                divVariants={divVariants} divProducts={divProducts} isSelected={blueprint.id === x.id} />) }
        <div className="navIcon" onClick={() => handleNav(+1)}><img src={process.env.PUBLIC_URL + "/icon_right.png"} alt="left" /></div>
    </div>)
}

export default DivBlueprints;