import {useEffect, useState, type SubmitEvent} from 'react'
import './App.css'
import type {Sector} from "./types/Sector.ts";
import type {UserEntryRequest} from "./types/UserEntryRequest.ts";

function SectorOption({sector, indent}: { sector: Sector, indent: number }) {
    return (
        <>
            <option value={sector.id}>{"\u00A0\u00A0\u00A0\u00A0".repeat(indent)}{sector.name}</option>
            {sector.children.map((childSector: Sector) => (
                <SectorOption sector={childSector} indent={indent + 1}/>
            ))}
        </>
    )
}

function ErrorMessage({render}: { render: boolean }) {
    if (!render) {
        return null
    } else return <span className="error">Please fill all fields.</span>
}

function App() {
    const [sectors, setSectors] = useState<Sector[]>([])
    const [name, setName] = useState('')
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [selectedSectors, setSelectedSectors] = useState<string[]>([])
    const [showError, setShowError] = useState<boolean>(false)

    useEffect(() => {
        fetch('http://localhost:8080/sectors')
            .then(res => res.json() as Promise<Sector[]>)
            .then(data => setSectors(data))
    }, [])

    function PostData(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        if (name === '' || selectedSectors.length === 0 || !agreeTerms) {
            setShowError(true)
            return

        }
        const payload: UserEntryRequest = {name, sectorIds: selectedSectors, agreeTerms}

        fetch('http://localhost:8080/userData', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        })
    }

    return (
        <>
            <section id="spacer"></section>

            Please enter your name and pick the Sectors you are currently involved in.
            <br/>

            <ErrorMessage render={showError}/>

            <br/>
            <form onSubmit={PostData}>
                Name:
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => {
                        setShowError(false)
                        setName(e.target.value)
                    }}
                />
                <br/>

                Sectors:
                <select
                    multiple
                    size={5}
                    value={selectedSectors}
                    onChange={(e) => {
                        setShowError(false)
                        setSelectedSectors(Array.from(e.target.selectedOptions, (option) => option.value))
                    }}
                >
                    {sectors?.map((sector) => (
                        <SectorOption sector={sector} indent={0}/>
                    ))}
                </select>

                <br/>
                <div>
                    Agree to terms
                    <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => {
                            setShowError(false)
                            setAgreeTerms(e.target.checked)
                        }}
                    />
                </div>

                <input type="submit" value="Save"/>
            </form>

            <section id="spacer"></section>
        </>
    )
}

export default App
