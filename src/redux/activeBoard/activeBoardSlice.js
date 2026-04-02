import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'

import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
// Khởi tạo giá trị State của một Slice trong redux
const initialState = {
  currentActiveBoard: null
}

// Các hành động gọi API và cập nhật dữ liệu vào Redux dùng Middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk('activeBoard/fetchBoardDetailsAPI', async (boardId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
  // Axios trả về qua pros của nó là data
  return response.data
})

// Khởi tạo một cái Slice trong kho lưu trữ redux store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      //  action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây gán nó ra một biến có ý nghĩa hơn
      const board = action.payload

      // Xử lý dữ liệu

      // Update dữ liệu currentActiveBoard
      state.currentActiveBoard = board
    }
  },
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      //  action.payload là response.data trả về ở trên
      let board = action.payload

      //Sắp xếp thứ tự các column luôn trước khi đưa dữ liệu xuống dưới các component con.
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

      // Update dữ liệu currentActiveBoard
      state.currentActiveBoard = board
    })
  }
})

// Actions: nơi các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selectors: là nơi các components bên dưới gọi bằng useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer
