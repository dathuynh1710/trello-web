import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { deepOrange, orange, cyan, teal } from '@mui/material/colors'
// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: '48px',
    boardBarHeight: '58px'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange
      }
    },
    dark: {
      palette: {
        main: cyan,
        secondary: orange
      }
    }
  }
})

export default theme
