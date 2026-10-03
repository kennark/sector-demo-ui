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

function ValidationErrorMessage({render}: { render: boolean }) {
    if (!render) return null
    else return <span className="error">Please fill all fields.</span>
}

function NetworkErrorMessage({render}: { render: boolean }) {
    if (!render) return null
    else return <span className="error">There seems to be an issue with the connection... Please try again.</span>
}

function EditMessage({render}: { render: boolean }) {
    if (!render) return null
    else return <span>Data saved! You can edit your entry during this session.</span>
}

function App() {
    const [sectors, setSectors] = useState<Sector[]>([])
    const [name, setName] = useState<string>('')
    const [agreeTerms, setAgreeTerms] = useState<boolean>(false)
    const [selectedSectors, setSelectedSectors] = useState<string[]>([])
    const [showValidationError, setShowValidationError] = useState<boolean>(false)
    const [showNetworkError, setShowNetworkError] = useState<boolean>(false)
    const [userId, setUserId] = useState<number | null>(null)

    useEffect(() => {
        fetch('http://localhost:8080/sectors')
            .then(res => res.json() as Promise<Sector[]>)
            .then(data => setSectors(data))
    }, [])

    function PostData(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        setShowNetworkError(false)

        if (name === '' || selectedSectors.length === 0 || !agreeTerms) {
            setShowValidationError(true)
            return

        }
        const payload: UserEntryRequest = {id: userId, name, sectorIds: selectedSectors, agreeTerms}

        fetch('http://localhost:8080/userData', {
            method: userId === null ? 'POST' : 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        }).then(res => res.json()).then(data => setUserId(data.id))
            .catch(err => {
                console.log(err)
                setShowNetworkError(true)
            })
    }

    return (
        <>
            <section id="spacer"></section>

            Please enter your name and pick the Sectors you are currently involved in.
            <br/>

            <EditMessage render={userId !== null}/>

            <ValidationErrorMessage render={showValidationError}/>
            <NetworkErrorMessage render={showNetworkError}/>

            <br/>
            <form onSubmit={PostData}>
                Name:
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => {
                        setShowValidationError(false)
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
                        setShowValidationError(false)
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
                            setShowValidationError(false)
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
