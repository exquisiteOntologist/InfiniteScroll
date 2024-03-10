import * as React from 'react'
import { useState } from 'react'
import './App.css'

const settings = {
  rowHeight: 20,
  numRows: 10000,
  numVisibleRows: 300
}

/** mod because simple '%' makes negative n negative value */
function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/** The "actual" rows */
const rowsData: { id: number }[] = []

for (let i = 0; i < settings.numRows; i++) {
  rowsData.push({ id: i })
}

const Row: React.FC<{ id: number, i: number, top: number, active: boolean }> = ({ id, i, top, active }) => { 
  return (
    <div className="row" style={{ top: top }} data-active={active ? 'a' : 'b'}>
      <p>{i}:{id}{active ? '(A)' : '(B)'}</p>
    </div>
  )
}

const totalHeight = settings.rowHeight * settings.numRows

/** Create an array representing the rendered rows, not the data source's rows */
const createVisibleRows = () => {
  const rows = []

  for (let i = 0; i < settings.numVisibleRows; i++) {
    rows.push({ id: i, rowId: 0, top: 0, active: false })
  }

  return rows
}

function App() {
  const [yScroll, setYScroll] = useState(0)
  const [vScreen, setVScreen] = useState(visualViewport.height)
  /** Visible rows, the rendered rows, to roll over the actual rows */
  const [vRows, setVRows] = useState(createVisibleRows())
  
  React.useEffect(() => {
    addEventListener('scroll', () => setYScroll(scrollY))
    addEventListener('resize', () => setVScreen(visualViewport.height))
  })

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

  // NOTE: There is a serious bug where first row (id: 0) is not rendered or is not considered active

  for (let i = 0; i < vRows.length; i++) {   
    const vRow = vRows[(iRowInView + i) % vRows.length]
    const row = rowsData[Math.floor((centerRow - (vRows.length / 2)) + i)]
    if (!row) continue
    const active = activeIds.includes(row.id)
    if (!yScroll || !active) {
      vRow.top = row.id * settings.rowHeight
      vRow.rowId = row.id
    }

    vRow.active = active
  }
  console.log('mouse', vScreen, yScroll)
  console.log('active & non', vRows.filter(vR => vR.active).length, 'VS', vRows.filter(vR => !vR.active).length)
  console.log('y first active', document.querySelectorAll('[data-active=a]')[1])
  console.log('y first inactive', document.querySelector('[data-active=b]'))

  // console.log('vRows', vRows)

  const rowNodes = vRows.map((vRow, i) => (vRow.top > 0 || i === 0) && <Row key={i} i={i} id={vRow.rowId} top={vRow.top} active={vRow.active} />)

  return (
    <>
      <div className="rowContainer" style={{ height: totalHeight }}>
        { rowNodes }
      </div>
    </>
  )
}

export default App
