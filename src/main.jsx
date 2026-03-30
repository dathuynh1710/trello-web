// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme'

// Config react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Config MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm'

// Config Redux Store
import { Provider } from 'react-redux'
import { store } from '~/redux/store'

// Config react-router-dom
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/">
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <ConfirmProvider
          defaultOptions={{
            allowClose: false,
            dialogProps: { maxWidth: 'xs' },
            cancellationButtonProps: { color: 'inherit' },
            confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
            buttonOrder: ['confirm', 'cancel']
          }}
        >
          <CssBaseline />
          <App />
          <ToastContainer position="bottom-left" theme="colored" />
        </ConfirmProvider>
      </CssVarsProvider>
    </Provider>
  </BrowserRouter>
)
