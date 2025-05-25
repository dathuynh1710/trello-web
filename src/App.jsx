import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import DeleteIcon from '@mui/icons-material/Delete'
import AlarmIcon from '@mui/icons-material/Alarm'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
function App() {
  return (
    <>
      <div>dathuynh</div>
      <Button variant='text'>Text</Button>
      <Button variant='contained'>Contained</Button>
      <Button variant='outlined'>Outlined</Button>
      <Stack direction='row' spacing={1}>
        <IconButton aria-label='delete'>
          <DeleteIcon />
        </IconButton>
        <IconButton aria-label='delete' disabled color='primary'>
          <DeleteIcon />
        </IconButton>
        <IconButton color='secondary' aria-label='add an alarm'>
          <AlarmIcon />
        </IconButton>
        <IconButton color='primary' aria-label='add to shopping cart'>
          <AddShoppingCartIcon />
        </IconButton>
      </Stack>
    </>
  )
}

export default App
