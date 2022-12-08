import './index.scss'
import { Button, Input, Modal, message } from 'antd';
import { useRef, useState } from 'react';
import { Dropdown, Space, MenuProps } from 'antd';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import axios from '../../utils/axios';
import DifferentAlert from '../../WrappedComponent/Alerts';

const SEARCH_USER_WHIT_NAME = '通过对方的用户名查询'

// 点击加号的下拉菜单
const items: MenuProps['items'] = [
  {
    label: '加好友',
    key: SEARCH_USER_WHIT_NAME,
  },
  {
    label: '加群',
    key: '加群',
  },
  {
    label: '创建群',
    key: '创建群',
  },
];


function FriendSearch() {

  // 输入框
  const [val, setVal] = useState('');
  // 点击后的key值
  const [key, setKey] = useState('');
  // 弹窗中搜索的输入框
  const [addVal,setAddVal] = useState('');
  // 查询数据列表
  const [userList,setUserList] = useState<{id:number,name:string}[]>([]);
  // 是否查询用户
  const [isSearch,setIsSearch] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null);

  // 点击菜单，弹出弹窗
  const onClick: MenuProps['onClick'] = ({ key }) => {
    setOpen(true);
    setKey(key);
  };

  // 关闭弹窗
  const handleCancel = () => {
    setOpen(false);
    setKey('');
    setAddVal('');
    setIsSearch(false);
  };

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  // 根据用户名搜索用户
  const searchUser = async () => {
    if(addVal.trim().length===0)return message.error('用户名不能为空');
    let result = await axios({
      url: '/users/searchName',
      params: {
        name: addVal
      }
    })
    if(result.data.code===200){
      setUserList(result.data.data);
    }
    setIsSearch(true);
  }

  // 添加好友
  const addFriend = async (friendName:string) => {
    let result = await axios({
      url: '/friend/quest',
      method: 'POST',
      data: {
        friendName
      }
    })
    // 添加好友的处理
    if(result.data.code===200){
      message.success(result.data.msg);
    }
  }

  return (
    <div id='friendSearch'>
      <div className="search">
        <Input className='searchIpt' placeholder="搜索" allowClear onChange={(e) => { setVal(e.target.value) }} />
      </div>
      <div className="add">
        <Dropdown menu={{ items, onClick }}>
          <a className='a item' onClick={(e) => e.preventDefault()}>
            <Space>
              ➕
            </Space>
          </a>
        </Dropdown>
      </div>
      <Modal
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move',
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            onFocus={() => { }}
            onBlur={() => { }}
          >
            {key}
          </div>
        }
        footer={null}
        open={open}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <div className='searchVessels'>
          <Input className='searchIpt' placeholder={key} allowClear value={addVal} onChange={(e) => { setAddVal(e.target.value) }} />
          <Button type='primary' className='searchBtn' onClick={searchUser}>查询</Button>
        </div>
        {
          isSearch && 
          <div className='searchResult'>
            {
              userList.map((item) => {
                return (
                  <div key={item.id} className='item'>
                    <div className='name'>{item.name}</div>
                    <Button type='default' className='btns' onClick={()=>{
                      addFriend(item.name)
                    }}>加好友</Button>
                  </div>
                )
              })
            }
            {
              userList.length===0 &&
              DifferentAlert('info','没有找到符合搜索条件的用户')()
            }
          </div>
        }
      </Modal>
    </div >
  )
}

export default FriendSearch
