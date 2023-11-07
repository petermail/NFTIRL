import { useEffect, useRef, useState } from "react";
import { getBlueprintsAsync, getShopsAsync } from "../Api/PrintifyApi";
import AltChoicePage from "./AltChoicePage";

export const AltMainPage = () => {
    const [blueprints, setBlueprints] = useState([]);
    const [shopId, setShopId] = useState('');

    
    const reorder = (bs) => {
        const indices = [12, 6, 49, 88, 1108, 618, 789, 1090, 892];
        const reordered = bs.filter(x => indices.includes(x.id));
        return reordered;
    }

    useEffect(() => {
        getShopsAsync().then(x => setShopId(y => x.data[0].id));
        getBlueprintsAsync().then(x => { 
            const reordered = reorder(x.data);
            setBlueprints(() => reordered);
        });
    }, []);

    return <AltChoicePage blueprints={[12].map(x => ({ id: x }))} shopId={6270768} />
}