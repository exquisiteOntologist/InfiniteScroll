import * as React from 'react'
import { useState } from 'react'
import './App.css'

const settings = {
  rowHeight: 20,
  numRows: 10000,
  numVisibleRows: 300
}

interface DataRow {
  id: number
}

/** The "actual" rows */
const rowsData: DataRow[] = []

for (let i = 0; i < settings.numRows; i++) {
  rowsData.push({ id: i })
}

const Row: React.FC<{ id: number, i: number, top: number, onScreen: boolean }> = ({ id, i, top, onScreen }) => { 
  return (
    <div className="row" style={{ top: top }} data-active={onScreen ? 'a' : 'b'}>
      <p>{id} ({i}/{settings.numVisibleRows - 1}){onScreen ? '(A)' : '(B)'}</p>
    </div>
  )
}

const totalHeight = settings.rowHeight * settings.numRows

interface VisibleRow {
  id: number
  rowId: number
  top: number
  onScreen: boolean
  offPage: boolean
}

/** Create an array representing the rendered rows, not the data source's rows */
const createVisibleRows = (): VisibleRow[] => {
  const rows = []

  for (let i = 0; i < settings.numVisibleRows; i++) {
    rows.push({ id: i, rowId: 0, top: 0, onScreen: false, offPage: false })
  }

  return rows
}

function App() {
  const [priorYScroll, setPriorYScroll] = useState(0)
  const [yScroll, setYScroll] = useState(0)
  const [vScreen, setVScreen] = useState(visualViewport.height)
  /** Visible rows, the rendered rows, to roll over the actual rows */
  const [vRows, setVRows] = useState<VisibleRow[]>(createVisibleRows())
  
  React.useEffect(() => {
    addEventListener('scroll', () => {
      setPriorYScroll(yScroll)
      setYScroll(scrollY) // `scrollY` from global
    })
    addEventListener('resize', () => setVScreen(visualViewport.height))
  })

  /** Has the user scrolled so far at once (e.g. end) that the just-out-of-view rendered rows were not these rows now meant to be displayed? */
  const bigJump = priorYScroll - yScroll > visualViewport.height * 2 || yScroll - priorYScroll > visualViewport.height * 2

  const iRowInView = Math.floor(yScroll / settings.rowHeight)

  console.log('row in view', iRowInView)

  const numRowsOnScreen = Math.floor(vScreen / settings.rowHeight)
  const numRowsWithOffsets = numRowsOnScreen * 2

  const centerRow = Math.floor(iRowInView + (numRowsOnScreen / 2))
  const activeIds = []
  for (let nI = 0; nI < numRowsWithOffsets; nI++) {
    activeIds.push(Math.floor(centerRow - (numRowsWithOffsets / 2)) + nI)
  }

  console.log('active ids', activeIds)
  console.log('y scroll:', yScroll, 'iRowInView', iRowInView, 'centerRow:', centerRow, rowsData[centerRow].id)
  console.log('num rows on screen:', numRowsOnScreen, 'num visible:', settings.numVisibleRows)

  for (let i = 0; i < vRows.length; i++) {   
    const vRow = vRows[(iRowInView + i) % vRows.length]
    const rowDataIndex = Math.floor((centerRow - (vRows.length / 2)) + i)
    const row = rowsData[rowDataIndex]
    vRow.offPage = !row
    if (vRow.offPage) continue
    const active = activeIds.includes(row.id)
    if (!yScroll || !active || bigJump) {
      vRow.top = row.id * settings.rowHeight
      vRow.rowId = row.id
    }

    vRow.onScreen = active
  }
  console.log('mouse', vScreen, yScroll)
  console.log('big jump?', bigJump)
  console.log('active & non', vRows.filter(vR => vR.onScreen).length, 'VS', vRows.filter(vR => !vR.onScreen).length)
  console.log('y first active', document.querySelectorAll('[data-active=a]')[1])
  console.log('y first inactive', document.querySelector('[data-active=b]'))

  // console.log('vRows', vRows)

  const rowNodes = vRows.map((vRow, i) => !vRow.offPage && <Row key={i} i={i} id={vRow.rowId} top={vRow.top} onScreen={vRow.onScreen} />)

  return (
    <>
      <main className="rowContainer" style={{ height: totalHeight }}>
        { rowNodes }
      </main>
    </>
  )
}

export default App
