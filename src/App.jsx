import { Route, Routes, Navigate } from 'react-router-dom'

import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
function App() {
  return (
    <Routes>
      {/* Redirect Roote */}
      <Route
        path="/"
        element={
          // replace là true để thay thế route /, có thể hiểu là route / sẽ không nằm trong history của browser
          <Navigate to="/boards/68a205e929cb00de24facd44" replace={true} />
        }
      />
      {/* Board Details*/}
      <Route path="/boards/:boardId" element={<Board />} />
      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verication" element={<AccountVerification />} />

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
