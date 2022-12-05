import './index.scss'
import { Input, Modal } from 'antd'
import { useRef, useState } from 'react';
import { Dropdown, message, Space } from 'antd';
import type { MenuProps } from 'antd';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';

// 点击加号的下拉菜单
const items: MenuProps['items'] = [
  {
    label: '加好友',
    key: '加好友',
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

  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null);

  const onClick: MenuProps['onClick'] = ({ key }) => {
    message.info(`Click on item ${key}`);
    setOpen(true);
    setKey(key);
  };

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    console.log("确定");
    setOpen(false);
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log("取消");
    setOpen(false);
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
        open={open}
        onOk={handleOk}
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
        <p>
          {key}
        </p>
      </Modal>
    </div >
  )
}

export default FriendSearch
