import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
function BoardContent({ board }) {
  // yeu cau chuot di chuyen 10px thi moi kich hoat event, fix truong hop click bi goi event
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: {
  //     distance: 10
  //   }
  // })
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  })
  // Nhan giu 250ms va dung sai cam ung thi kich hoat envent
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }
  })
  // Uu tien su dung ket hop 2 loai sensors la mouse va touch de co trai nghiem tren mobile tot nhat
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  const handleDragEnd = (event) => {
    // console.log(event)
    const { active, over } = event
    // Kiem tra neu khong ton tai over thi return
    if (!over) return
    // Neu vi tri sau khac vi tri truoc
    if (active.id !== over.id) {
      // Lay vi tri cu (tu thang active)
      const oldIndex = orderedColumns.findIndex((column) => column._id === active.id)
      // Lay vi tri moi (tu thang over)
      const newIndex = orderedColumns.findIndex((column) => column._id === over.id)
      // arrayMove: sap xep lai mang column ban dau
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // console phia duoi se dung de xu ly goi API
      // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
      // console.log('dndOrderedColumns',  dndOrderedColumns)
      // console.log('dndOrderedColumnsIds',  dndOrderedColumnsIds)

      // Cap nhat lai state columns ban dau sau khi da keo tha
      setOrderedColumns(dndOrderedColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
