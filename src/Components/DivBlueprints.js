import { useEffect, useState } from 'react';
import { getBlueprintsAsync } from '../Api/PrintifyApi'
import DivBlueprint from './DivBlueprint';

const DivBlueprints = (props) => {
    const { blueprints, handleChooseBlueprint, divVariants, divProducts } = props;

    return (<div className="blueprints">
        { blueprints && blueprints.slice(0, 10).map(x => 
            <DivBlueprint key={x.id} blueprint={x} handleChooseBlueprint={handleChooseBlueprint} 
                divVariants={divVariants} divProducts={divProducts} />) }
    </div>)
}

export default DivBlueprints;