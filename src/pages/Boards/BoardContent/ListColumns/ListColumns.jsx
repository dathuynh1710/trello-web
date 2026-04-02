import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { cloneDeep } from 'lodash'
import { createNewColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'

function ListColumns({ columns }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter column title')
      return
    }

    // Tạo dữ liệu Column để gọi API
    const newColumnData = {
      title: newColumnTitle
    }

    // Gọi API tạo mới column và làm mới dữ liệu state board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cap nhat state board
    /**
     * Đoạn này dính lỗi "object is not extensible" bởi đã copy/clone ra giá trị newBoard nhưng bản chất
     * của spread operator là Shallow Copy/Clone, nên dính phải rules Immutability trong Redux Toolkit không
     * dùng được hàm PUSH --> ta dùng Deep Copy/Clone toàn bộ Board.
     */
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    // Cập nhật dữ liệu Board vào Redux Store
    dispatch(updateCurrentActiveBoard(newBoard))
    // Đóng trạng thái thêm Column mới và Input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }
  /**
   * SortableContext yêu cầu items là một dạng:
   * ['id-1', 'id-2', 'id-3'] chứ không phải [{id: 'id-1'}, {id: 'id-2'}, {id: 'id-3'}]
   * Nếu không đúng thì vẫn kéo thả được nhưng k có animation
   */
  return (
    <SortableContext items={columns?.map((c) => c._id)} strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 2 }
        }}
      >
        {columns?.map((column) => (
          <Column key={column._id} column={column} />
        ))}

        {/* Box Add new column */}
        {!openNewColumnForm ? (
          <Box
            onClick={toggleOpenNewColumnForm}
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d'
            }}
          >
            <Button
              startIcon={<NoteAddIcon />}
              sx={{ color: 'white', width: '100%', justifyContent: 'flex-start', pl: 2.5, py: 1 }}
            >
              Add new column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <TextField
              label="Enter column title..."
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white'
                  },
                  '&:hover fieldset': {
                    borderColor: 'white'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white'
                  }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                className="interceptor-loading"
                onClick={addNewColumn}
                variant="contained"
                color="success"
                size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >
                Add column
              </Button>
              <CloseIcon
                fontSize="small"
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': {
                    color: (theme) => theme.palette.warning.light
                  }
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  )
}

export default ListColumns
