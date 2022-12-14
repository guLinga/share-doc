import './index.scss'
import {useState} from 'react';
import { Dropdown, MenuProps, Space } from 'antd';
import FriendAllList from '../friendAllList/index';
import FriendNotRead from '../friendNotRead/index';
import MyFriendRequest from '../myFriendRequest/index';
import GetFriendQuest from '../getFriendQuest';
import IconFont from '../Icon/index';
import { Socket } from 'socket.io-client';
import { props } from './type';

// 不同菜单对应的信息
const ALL = '全部';
const NOT_READ = '未读';
const MY_FRIEND_REQUEST = '我的好友请求';
const GET_FRIEND_REQUEST = '收到的好友请求';

// 选择不同消息的菜单
const items: MenuProps['items'] = [
  {
    label: '全部',
    key: ALL
  },
  {
    label: '我的好友请求',
    key: MY_FRIEND_REQUEST
  },
  {
    label: '收到的好友请求',
    key: GET_FRIEND_REQUEST
  }
];

function FriendsList({socket,userMessage}:props) {

  // 菜单key值的保存
  const [key,setKey] = useState(ALL);

  const onClick: MenuProps['onClick'] = ({ key }) => {
    setKey(key);
  };

  return (
    <div id='friendsList'>
      <Dropdown menu={{ items, onClick }}>
        <a className='a item' onClick={(e) => e.preventDefault()}>
          <Space>
            <IconFont type='icon-zhankai' />{key}
          </Space>
        </a>
      </Dropdown>
      <div className='main'>
        {
          key === ALL && <FriendAllList />
        }
        {
          key === NOT_READ && <FriendNotRead />
        }
        {
          key === MY_FRIEND_REQUEST && <MyFriendRequest />
        }
        {
          key === GET_FRIEND_REQUEST && <GetFriendQuest socket={socket} userMessage={userMessage} />
        }
      </div>
    </div>
  )
}

export default FriendsList
