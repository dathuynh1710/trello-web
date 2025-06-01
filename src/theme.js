import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { deepOrange, orange, cyan, teal } from '@mui/material/colors'
// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px'
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
