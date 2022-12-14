import './index.scss'
import FriendSearch from '../friendSearch/index';
import FriendsList from '../friendsList/index';
import { props } from './type';

function FriendsListVessles({socket,userMessage}:props) {
  return (
    <div id='friendsListVessels'>
      <FriendSearch socket={socket} userMessage={userMessage} />
      <FriendsList socket={socket} userMessage={userMessage} />
    </div>
  )
}

export default FriendsListVessles
