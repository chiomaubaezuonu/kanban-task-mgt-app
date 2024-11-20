import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'
import { Switch, Card, Button, Modal, Input, MenuProps, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';



// interface AllBoards {
//   boards: []
//   _id: string,
//   name: string,
//   columns: [{
//     name: string,
//     tasks: [{
//       title: string,
//       description: string,
//       status: string,
//       subtasks: [{
//         title: string,
//         isCompleted: Boolean
//       }]
//     }],
//   }]
// }

interface Board {
  _id: string,
  name: string,
  columns: [{
    name: string,
    tasks: [{
      title: string,
      description: string,
      status: string,
      subtask: [{ title: string, isCompleted: boolean }]
    }]
  }]
}
function App() {
  const [allBoards, setAllBoards] = useState<Board[]>([])
  const [selectedBoard, setSelectedBoard] = useState<Board | undefined>(undefined)
  const [updatedColumnCount, setUpdatedColumnCount] = useState([]);
  const [newInput, setNewInput] = useState<string[]>([""])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [headerModal, setHeaderModal] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)



  const onChange = (checked: boolean) => {
    //console.log(`switch to ${checked}`);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const removeColumn = (inputIndex: number) => {
    setNewInput(newInput.filter((input, index) => inputIndex !== index))
  }

  const AddInput = () => {
    setNewInput([...newInput, ""])

  };

  const handleCancel = () => {
    setIsModalOpen(false)
    setIsNewTaskModalOpen(false)
  };
  useEffect(() => {
    axios.get('https://kanban-task-server-7zl1.onrender.com/projects')
      .then(response => {
        setAllBoards(response.data[0].boards || [])

      })
  }, [])




  return (

    <div className="container">
      {isSidebarOpen &&
        <div className='sidebar'>
          <div className='nav-list'>
            <div className="logo">
              <img src="/images/logo-light.svg" alt="logo" />
            </div>

            <div className="all-boards">
              <p>{`All boards (${allBoards.length})`}</p>
              {allBoards &&
                allBoards.map((board) => {
                  return <div key={board.name} onClick={() => setSelectedBoard(board)} className={`boards-list ${"selectedBoard.boardName" === board.name ? 'selected-board' : ''}`}>
                    <div className='single-board'>
                      <img src="/images/sidebarIcon.svg" alt="view board" />
                      <p>{board.name}</p>

                    </div>
                  </div>
                })
              }
              < div className='new-board'>
                <img src="/images/sidebarIcon.svg" alt="view board" height={16} />
                <Button type="primary" onClick={showModal} ghost>
                  + Create New Board
                </Button>
              </div>
            </div>
          </div>

          {isSidebarOpen &&
            <div className='theme-wrapper' >
              <div className="sidebar-btn">
                <img src="/images/light-theme.svg" alt="light-theme" className='light' />
                <Switch defaultChecked onChange={onChange} />
                <img src="/images/dark-theme.svg" alt="dark-theme" className='dark' />
              </div>
              <div className="hide-sidebar" onClick={() => setIsSidebarOpen(false)}>
                <img src="/images/hide-icon.svg" alt="hide sidebar icon" />
                <p>Hide Sidebar</p>
              </div>
            </div>
          }
        </div>
      }

      <div className='right-div'>
        <header className="header">
          <h1>{selectedBoard?.name}</h1>
          <div className='menu-div'>
            <button className='header-btn' onClick={() => setIsNewTaskModalOpen(true)}>+ Add New Task</button>
            <img src="images/menu-icon.svg" alt="menu-icon" className='menu-icon' onClick={() => setHeaderModal(!headerModal)} />
          </div>
        </header>

        <Modal open={isNewTaskModalOpen} onCancel={handleCancel} footer={null}>
          <h2>Add New Task</h2>
          <form action="">
            <label htmlFor="">
              <p>Title</p>
              <Input placeholder="E.G Table Coffee Break" />
            </label>
            <label htmlFor="">
              <p>Description</p>
              <TextArea placeholder="E.G It's Always Good to Take A Break. This 15 Minutes Break Will Recharge The Batteries A Little." />
            </label>
            <label htmlFor="">
              <p>Subtasks</p>
              <div className="subtasks-input">
                {newInput.map((newColumn, index) => {
                  return <div key={index} className="new-columns">
                    <Input type='text' />
                    <p onClick={() => removeColumn(index)} className='removeColumn'>X</p>
                  </div>
                })}
              </div>
            </label>
            <Button type='primary' onClick={AddInput}>Add New Tasks </Button>
            <label htmlFor="">
              <p>Status</p>
              <input />
            </label>
            <select>

              <option value="fruit">Todo</option>

              <option value="vegetable">Doing</option>

              <option value="meat">Done</option>

            </select>
            <Button type='primary' onClick={AddInput}> Create Task </Button>
          </form>
        </Modal>

        {headerModal &&
          <div className='headerModal'>
            <p style={{ color: '#828FA3' }}>Edit Board</p>
            <p style={{ color: '#EA5555' }}>Delete Board</p>
          </div>
        }
        <main>
          <div className='cards-container'>
            <Modal title="Basic Modal" open={isModalOpen} onOk={AddInput} onCancel={handleCancel} cancelText={"Create Board"} okText={"Add Columns"} >
              <h2>Add New Board</h2>
              <form action="">
                <label htmlFor="">
                  <p>Name</p>
                  <Input placeholder="E.G Web Design" />
                </label>
                <div>
                  {newInput.map((newColumn, index) => {
                    return <div key={index} className="new-columns">
                      <Input type='text' />
                      <p onClick={() => removeColumn(index)} className='removeColumn'>X</p>
                    </div>
                  })}
                </div>
              </form>
            </Modal>
            <div className='columns'>
              {selectedBoard?.columns.map((column, index) => {
                return <div key={index}>
                  <p >{column.name}</p>
                  {column.tasks?.map((task, taskIndex) => {
                    return <Card style={{ width: 248 }} key={index}>
                      <h2 className='cardTitle'>{task.title}</h2>
                    </Card>
                  })}
                </div>
              })}
            </div>

          </div>
          {!isSidebarOpen &&
            <button onClick={() => setIsSidebarOpen(true)} className='hidden-sidebar'>
              <img src="/images/show-sidebar.svg" alt="show-icon" />
            </button>}

        </main>

      </div>
    </div>
  );
}

export default App;
