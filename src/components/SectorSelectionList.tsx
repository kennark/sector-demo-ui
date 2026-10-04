import type {Sector} from "../types/Sector.ts";
import type {Dispatch, SetStateAction} from "react";

function SectorOption({sector, indent}: { sector: Sector, indent: number }) {
    return (
        <>
            <option value={sector.id}>{"\u00A0\u00A0\u00A0\u00A0".repeat(indent)}{sector.name}</option>
            {sector.children.map((childSector: Sector) => (
                <SectorOption key={childSector.id} sector={childSector} indent={indent + 1}/>
            ))}
        </>
    )
}

export function SectorSelectionList(
    {selectedSectors, setShowValidationError, setSelectedSectors, sectors}: {
        selectedSectors: string[],
        setShowValidationError: Dispatch<SetStateAction<boolean>>,
        setSelectedSectors: Dispatch<SetStateAction<string[]>>,
        sectors: Sector[]
    }) {
    return <select
        multiple
        size={5}
        value={selectedSectors}
        onChange={(e) => {
            setShowValidationError(false)
            setSelectedSectors(Array.from(e.target.selectedOptions, (option) => option.value))
        }}
    >
        {sectors?.map((sector) => (
            <SectorOption key={sector.id} sector={sector} indent={0}/>
        ))}
    </select>;
}