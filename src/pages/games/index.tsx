import './index.scss'
import IconFont from '../../components/Icon/index';
import { Link } from 'react-router-dom';

function Games() {
  const gamesList = [
    {
      name: '贪吃蛇',
      icon: 'icon-she',
      params: 'she'
    },
    {
      name: '俄罗斯方块',
      icon: 'icon-Tetris',
      params: 'tetris'
    }
  ]
  return (
    <div id='games'>
      {
        gamesList.map((item,index)=>{
          return (
            <div key={index} className='item'>
              <Link to={'/games/container/'+item.params} className='itemVessels'>
                <div className='icon'>
                  <IconFont type={item.icon} />
                </div>
                <div className='name'>{item.name}</div>
              </Link>
            </div>
          )
        })
      }
    </div>
  )
}

export default Games