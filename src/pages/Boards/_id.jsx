import { useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { cloneDeep } from 'lodash'
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
// import { mockData } from '~/apis/mock-data'
import { updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI } from '~/apis'

function Board() {
  const dispatch = useDispatch()
  // Không dùng state của component mà chuyển qua dùng state của redux
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)

  useEffect(() => {
    const boardId = '68a205e929cb00de24facd44'
    //Call API
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch])

  /**
   *  goi API xu ly khi keo tha column xong
   * Chỉ cần gọi API để cập nhật mảng cardOrderIds của Board chứa nó (thay đổi vị trí trong board)
   */
  const moveColumns = (dndOrderedColumns) => {
    // Update cho chuẩn dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)

    /**
     * Trường hợp dùng Spread Operator không sao
     * -> vì không dùng push như trên làm thay đổi mảng
     * -> mà chỉ gán lại toàn bộ giá trị columns và columnOrderIds bằng 2 mảng mới.
     */
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

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
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find((column) => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

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
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

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
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
