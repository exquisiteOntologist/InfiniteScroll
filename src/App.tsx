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

const createRows = () => {
  const rows = []

  for (let i = 0; i < settings.numVisibleRows; i++) {
    rows.push({ id: i, rowId: 0, top: 0, active: false })
  }

  return rows
}

const vRows = createRows()

function App() {
  const [yScroll, setYScroll] = useState(0)
  const [vScreen, setVScreen] = useState(visualViewport.height)
  // const [vRows, setVRows] = useState(createRows())
  
  React.useEffect(() => {
    addEventListener('scroll', () => setYScroll(scrollY))
    addEventListener('resize', () => setVScreen(visualViewport.height))
  })

  const iRowInView = Math.ceil(yScroll / settings.rowHeight)

  console.log('row in view', iRowInView)

  const numRowsOnScreen = Math.ceil(vScreen / settings.rowHeight)
  const numRowsWithOffsets = numRowsOnScreen * 2

  // const insertAbove = yScroll - vScreen
  // const insertBelow = yScroll + vScreen + (vScreen / 2)
  // const insertBefore = Math.ceil(iRowInView - (numRowsOnScreen / 2))
  // const insertBefore = Math.ceil(iRowInView - (numRowsOnScreen / 2))
  // const insertAfter = Math.ceil(iRowInView + (numRowsOnScreen / 2))
  // const vRowInViewTop = Math.ceil(iRowInView % vRows.length)

  const centerRow = Math.ceil(iRowInView + (numRowsOnScreen / 2))
  const activeIds = []
  for (let nI = 0; nI < numRowsOnScreen; nI++) {
    // activeIds.push(mod(Math.max(iRowInView + nI, 0), vRows.length))
    // activeIds.push(centerRow - (numRowsWithOffsets / 2) + nI)
    activeIds.push(Math.floor(centerRow - (numRowsOnScreen / 2)) + nI)
    // activeIds.push((iRowInView + nI) % vRows.length)
  }

  console.log('active ids', activeIds)
  console.log('y scroll:', yScroll, 'iRowInView', iRowInView, 'centerRow:', centerRow, rowsData[centerRow].id)
  console.log('num rows on screen:', numRowsOnScreen, 'num visible:', settings.numVisibleRows)

  for (let i = 0; i < vRows.length; i++) {
    // 
    
    const vRow = vRows[(iRowInView + i) % vRows.length]
    const row = rowsData[Math.ceil(((iRowInView + (numRowsOnScreen / 2)) - (vRows.length / 2)) + i)]
    if (!row) continue
    const active = !yScroll || activeIds.includes(row.id)
    if (!active) {
      vRow.top = row.id * settings.rowHeight
      vRow.rowId = row.id
    }

    // const target = mod(Math.ceil(iRowInView + i), vRows.length)
    // // const target = i
    // const vRow = vRows[target]
    // const row = rows[Math.ceil(iRowInView - vRows.length / 2) + target]
    // if (!row) continue
    // const { top } = vRow
    // // const updateTop = !yScroll || (yScroll && !top) || (top < insertAbove) || (top > insertBelow)
    // // const updateTop = !yScroll || (top < insertAbove) || (top > insertBelow)
    // const updateTop = !yScroll || row.id < insertBefore - numRowsOnScreen || row.id > insertAfter - numRowsOnScreen
    // // console.log('update?', top, insertAbove, insertBelow, updateTop)
    // console.log('update?', top, row.id, insertBefore, insertAfter, updateTop)
    // if (updateTop) {
      
    //   // vRow.top = (iRowInView + target) * settings.rowHeight
    //   vRow.top = row.id * settings.rowHeight
    //   vRow.rowId = row.id
      
    //   console.log('vRow', i, iRowInView, target, vRow, row, top)
    // } else {
    //   console.log('vRow', i, iRowInView, target, vRow, 'x', top)
    // }

    vRow.active = active
  }
  console.log('mouse', vScreen, yScroll) //, insertAbove, insertBelow)
  console.log('active & non', vRows.filter(vR => vR.active).length, 'VS', vRows.filter(vR => !vR.active).length)
  console.log('y first active', document.querySelectorAll('[data-active=a]')[1])
  console.log('y first inactive', document.querySelector('[data-active=b]'))

  // console.log('vRows', vRows)

  const rowNodes = vRows.map((vRow, i) => <Row key={i} i={i} id={vRow.rowId} top={vRow.top} active={vRow.active} />)

  return (
    <>
      <div className="rowContainer" style={{ height: totalHeight }}>
        { rowNodes }
      </div>
    </>
  )
}

export default App
