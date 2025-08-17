import { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mapOrder } from '~/utils/sorts'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'

// import { mockData } from '~/apis/mock-data'
import {
  fetchBoardDetailsAPI,
  createNewCardAPI,
  createNewColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '68a205e929cb00de24facd44'
    //Call API
    fetchBoardDetailsAPI(boardId).then((board) => {
      /**
       * Sắp xếp thứ tự các column luôn trước khi đưa dữ liệu xuống dưới các component con.
       */
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach((column) => {
        // Xử lý kéo thả column rỗng
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          /**
           * Sắp xếp thứ tự các cards luôn trước khi đưa dữ liệu xuống dưới các component con.
           */
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      setBoard(board)
    })
  }, [])

  // Gọi API tạo mới column và làm mới dữ liệu state board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cap nhat state board
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Cap nhat state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find((column) => column._id === createdCard.columnId)
    if (columnToUpdate) {
      // Nếu column rỗng: bản chất là đang chứa một cái placeholder card
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    setBoard(newBoard)
  }

  /**
   *  goi API xu ly khi keo tha column xong
   * Chỉ cần gọi API để cập nhật mảng cardOrderIds của Board chứa nó (thay đổi vị trí trong board)
   */
  const moveColumns = (dndOrderedColumns) => {
    // Update cho chuẩn dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API update board
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds
    })
  }

  /**
   * Khi di chuyển card trong cùng 1 column:
   * Chỉ cần gọi API để cập nhật mảng cardOrderIds của column chứa nó (thay đổi vị trí trong mảng)
   */
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // Update cho chuẩn dữ liệu state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find((column) => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)
    // Gọi API update board
    updateColumnDetailsAPI(columnId, {
      cardOrderIds: dndOrderedCardIds
    })
  }
  /**
   * Khi di chuyển card sang column khác:
   * B1: Cập nhật mảng cardOrderIds của column ban đầu chứa nó (xóa cái _id của card ra khỏi mảng)
   * B2: Cập nhật mảng cardOrderIds của column tiếp theo (thêm _id của card vào mảng)
   * B3: Cập nhật lại trường columnId mới của cái card đã kéo
   * -> Làm API riêng
   */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // Update cho chuẩn dữ liệu state boardc
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API xử lý
    let prevCardOrderIds = dndOrderedColumns.find((c) => c._id === prevColumnId)?.cardOrderIds
    // Xử lý vấn đề khi kéo phần tử cuối cùng ra khỏi column, column rỗng sẽ có placeholder card, cần xóa nó đi trước khi gửi dữ liệu lên cho BE.
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)?.cardOrderIds
    })
  }

  // Xử lý xóa 1 column và cards bên trong nó
  const deleteColumnDetails = (columnId) => {
    // Update cho chuẩn dữ liệu state board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter((c) => c._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter((_id) => _id !== columnId)
    setBoard(newBoard)
    // Goi API
    deleteColumnDetailsAPI(columnId).then((res) => {
      toast.success(res?.deleteResult)
    })
  }

  if (!board)
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    )

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  )
}

export default Board
