import * as React from 'react'
import { useState } from 'react'
import './App.css'

const settings = {
  rowHeight: 20,
  numRows: 10000,
  numVisibleRows: 100
}

const rows: { id: number }[] = []

for (let i = 0; i < settings.numRows; i++) {
  rows.push({ id: i })
}

const Row: React.FC<{ id: number, i: number, yScroll: number }> = ({ id, i, yScroll }) => {
  return (
    <div className="row" style={{
      top: yScroll + (i * settings.rowHeight)
      // translate: `0 ${yScroll + (i * settings.rowHeight)}px 0`
    }}>
      <p>{id}</p>
    </div>
  )
}

const totalHeight = settings.rowHeight * settings.numRows

function App() {
  const [yScroll, setYScroll] = useState(0)
  
  React.useEffect(() => {
    addEventListener('scroll', () => {
      setYScroll(scrollY)
    })
  })

  const iRowInView = Math.ceil(yScroll / settings.rowHeight)

  const rowNodes = []

  for (let i = 0; i < settings.numVisibleRows; i++) {
    rowNodes.push(<Row key={i} {...rows[iRowInView + i]} i={i} yScroll={yScroll} />)
  }

  return (
    <>
      <div className="rowContainer" style={{ height: totalHeight }}>
        { rowNodes }
      </div>
    </>
  )
}

export default App
