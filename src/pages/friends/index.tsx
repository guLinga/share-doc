import { Resizable } from 're-resizable';
import './index.scss';
import FriendsListVessles from '../../components/friendsListVessels/index';

function Friends() {
  return (
    <div id="friends">
      <Resizable
        defaultSize={{
          width: 320,
          height: '',
        }}
        style={{height: '100vh', overflow: 'hidden', backgroundColor: 'white', padding: "0", borderRight: '2px solid #e5e5ee'}}
        minWidth="260"
        maxHeight="100%"
        maxWidth="60%"
        minHeight="100%"
      >
        <FriendsListVessles />
      </Resizable>
      <div className='right'>

      </div>
    </div>
  )
}

export default Friends
