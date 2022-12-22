import { Link, useParams } from 'react-router-dom'
import Snake from '../snake';
import './index.scss'
import Tetris from '../tetris/index';

function GamesContainer() {
  const {g} = useParams();
  return (
    <div id='GamesContainer'>
      {
        g==='she'&&<Snake />
      }
      {
        g==='tetris'&&<Tetris />
      }
      <Link to='/games' className='close'>×</Link>
    </div>
  )
}

export default GamesContainer