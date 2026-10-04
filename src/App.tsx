import {type SubmitEvent, useEffect, useState} from 'react'
import './App.css'
import type {Sector} from "./types/Sector.ts";
import type {UserEntryRequest} from "./types/UserEntryRequest.ts";
import {ValidationErrorMessage} from "./components/messages/ValidationErrorMessage.tsx";
import {NetworkErrorMessage} from "./components/messages/NetworkErrorMessage.tsx";
import {EditMessage} from "./components/messages/EditMessage.tsx";
import {SectorSelectionList} from "./components/SectorSelectionList.tsx";

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
                <SectorSelectionList
                    selectedSectors={selectedSectors}
                    setShowValidationError={setShowValidationError}
                    setSelectedSectors={setSelectedSectors}
                    sectors={sectors}
                />

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
