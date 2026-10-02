import {useEffect, useState} from 'react'
import './App.css'
import type {Sector} from "./types/Sector.ts";


function Sector({sector, indent}: {sector: Sector, indent: number}) {
  return (
      <>
      <option value={sector.id}>{"\u00A0\u00A0\u00A0\u00A0".repeat(indent)}{sector.name}</option>
      {sector.children.map((childSector: Sector) => (
          <Sector sector={childSector} indent={indent + 1}/>
      ))}
      </>
  )
}

function App() {
  const [sectors, setSectors] = useState<Sector[]>([])

  useEffect(() => {
    fetch('http://localhost:8080/sectors')
        .then(res => res.json() as Promise<Sector[]>)
        .then(data => setSectors(data))
  }, [])




  return (
    <>
      <section id="spacer"></section>

      Please enter your name and pick the Sectors you are currently involved in.

      <br/>
        <form onSubmit={}>
          Name:
          <input type="text" placeholder="Name"/>
          <br/>

          Sectors:
          <select multiple size={5}>
            {sectors?.map((sector) => (
                <Sector sector={sector} indent={0}/>

            ))}
          </select>

          <br/>
          <div>
            Agree to terms
            <input type="checkbox"/>
          </div>

          <input type="submit" value="Save"/>
        </form>

      <section id="spacer"></section>
    </>
  )
}

export default App
