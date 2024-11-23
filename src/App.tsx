import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Switch, Card, Button, Modal, Input } from "antd";
import TextArea from "antd/es/input/TextArea";

interface Task {
  title: string;
  description: string;
  status: string;
  subtasks: { title: string; isCompleted: boolean }[];
}

interface Board {
  name: string;
  columns: {
    name: string;
    tasks: Task[];
  }[];
}

function App() {
  const [allBoards, setAllBoards] = useState<Board[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<Board | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [headerModal, setHeaderModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Task>({
    title: "",
    description: "",
    status: "",
    subtasks: [],
  });
  const [newBoard, setNewBoard] = useState<Board>({
    name: "",
    columns: [
      {
        name: "",
        tasks: [],
      },
    ],
  });

  const onChange = (checked: boolean) => {
    //console.log(`switch to ${checked}`);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsNewTaskModalOpen(false);
  };
  useEffect(() => {
    axios.get("https://kanban-task-server-7zl1.onrender.com/projects").then((response) => {
      setAllBoards(response.data[0].boards || []);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newBoard.name.trim() === "") {
      return alert("Board name is required!");
    }
    if (newBoard.columns.map((column) => column.name.trim() === "")) {
      return;
    }
    try {
      const response = await axios.post("https://kanban-task-server-7zl1.onrender.com/projects", {
        boards: [
          {
            name: newBoard.name,
            columns: [
              {
                name: newBoard.columns,
              },
            ],
          },
        ],
      });
      console.log("new board = ", response.data);
      setNewBoard({
        name: "",
        columns: [
          {
            name: "",
            tasks: [],
          },
        ],
      }); // Reset the form
      alert("Board created successfully!");
    } catch (error) {
      console.error("Error creating board:", error);
      alert("Failed to create board. Please try again.");
    }
  };

  console.log(newTask)

  return (
    <div className="container">
      {isSidebarOpen && (
        <div className="sidebar">
          <div className="nav-list">
            <div className="logo">
              <img src="/images/logo-light.svg" alt="logo" />
            </div>

            <div className="all-boards">
              <p>{`All boards (${allBoards.length})`}</p>
              {allBoards &&
                allBoards.map((board) => {
                  return (
                    <div
                      key={board.name}
                      onClick={() => setSelectedBoard(board)}
                      className={`boards-list ${"selectedBoard.boardName" === board.name ? "selected-board" : ""}`}
                    >
                      <div className="single-board">
                        <img src="/images/sidebarIcon.svg" alt="view board" />
                        <p>{board.name}</p>
                      </div>
                    </div>
                  );
                })}
              <div className="new-board">
                <img src="/images/sidebarIcon.svg" alt="view board" height={16} />
                <Button type="primary" onClick={showModal} ghost>
                  + Create New Board
                </Button>
              </div>
            </div>
          </div>

          {isSidebarOpen && (
            <div className="theme-wrapper">
              <div className="sidebar-btn">
                <img src="/images/light-theme.svg" alt="light-theme" className="light" />
                <Switch defaultChecked onChange={onChange} />
                <img src="/images/dark-theme.svg" alt="dark-theme" className="dark" />
              </div>
              <div className="hide-sidebar" onClick={() => setIsSidebarOpen(false)}>
                <img src="/images/hide-icon.svg" alt="hide sidebar icon" />
                <p>Hide Sidebar</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="right-div">
        <header className="header">
          <h1>{selectedBoard?.name}</h1>
          <div className="menu-div">
            <button className="header-btn" onClick={() => setIsNewTaskModalOpen(true)}>
              + Add New Task
            </button>
            <img
              src="images/menu-icon.svg"
              alt="menu-icon"
              className="menu-icon"
              onClick={() => setHeaderModal(!headerModal)}
            />
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
                {newTask.subtasks.map((subtask, index) => {
                  return (
                    <div key={index} className="new-columns">
                      <Input
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            subtasks: newTask.subtasks.map((_subtask) => {
                              if (_subtask === subtask) {
                                return {
                                  title: e.target.value,
                                  isCompleted: subtask.isCompleted,
                                };
                              } else {
                                return _subtask;
                              }
                            }),
                          })
                        }
                        value={subtask.title}
                      />
                      <p
                        onClick={() =>
                          setNewTask({
                            ...newTask,
                            subtasks: newTask.subtasks.filter((_subtask) => {
                              if (_subtask === subtask) {
                                return false;
                              } else {
                                return true;
                              }
                            }),
                          })
                        }
                        className="removeColumn"
                      >
                        X
                      </p>
                    </div>
                  );
                })}
              </div>
            </label>
            <Button
              type="primary"
              onClick={() =>
                setNewTask({ ...newTask, subtasks: [...newTask.subtasks, { isCompleted: false, title: "" }] })
              }
            >
              Add New Subtask
            </Button>
            <label htmlFor="">
              <p>Status</p>
              <input />
            </label>
            <select>
              <option value="fruit">Todo</option>

              <option value="vegetable">Doing</option>

              <option value="meat">Done</option>
            </select>
            <Button type="primary" >
              {" "}
              Create Task{" "}
            </Button>
          </form>
        </Modal>

        {headerModal && (
          <div className="headerModal">
            <p style={{ color: "#828FA3" }}>Edit Board</p>
            <p style={{ color: "#EA5555" }}>Delete Board</p>
          </div>
        )}
        <main>
          <div className="cards-container">
            <Modal
              open={isModalOpen}
              onCancel={handleCancel}
              cancelText={"Create Board"}
              okText={"Add Columns"}
              footer={null}
            >
              <h2>Add New Board</h2>
              <form onSubmit={handleSubmit}>
                <label htmlFor="">
                  <p>Name</p>
                  <Input
                    placeholder="Enter Board Name"
                    value={newBoard.name}
                    onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
                    required
                  />
                </label>
                <div>
                  {newBoard.columns.map((column, index) => {
                    return (
                      <div key={index} className="new-columns">
                        <Input
                          type="text"
                          onChange={(e) =>
                            setNewBoard({
                              ...newBoard,
                              columns: newBoard.columns.map((_column) => {
                                if (_column === column) {
                                  return { ...column, name: e.target.value };
                                } else {
                                  return _column;
                                }
                                // return _column === column ? { ...column, name: e.target.value } : _column;
                              }),
                            })
                          }
                          value={column.name}
                          placeholder="Enter Column Name"
                        />
                        <p
                          onClick={() =>
                            setNewBoard({
                              ...newBoard,
                              columns: newBoard.columns.filter((_column) => {
                                return _column !== column;
                              }),
                            })
                          }
                          className="removeColumn"
                        >
                          X
                        </p>
                      </div>
                    );
                  })}
                </div>
                <Button
                  type="primary"
                  onClick={() =>
                    setNewBoard({
                      ...newBoard,
                      columns: [...newBoard.columns, { name: "", tasks: [] }],
                    })
                  }
                >
                  Add Columns
                </Button>
                <button type="submit" className="submit-btn">
                  Create Board{" "}
                </button>
              </form>
            </Modal>
            <div className="columns">
              {selectedBoard?.columns.map((column, index) => {
                return (
                  <div key={index}>
                    <p>{column.name}</p>
                    {column.tasks?.map((task, taskIndex) => {
                      return (
                        <Card style={{ width: 248 }} key={index}>
                          <h2 className="cardTitle">{task.title}</h2>
                        </Card>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          {!isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(true)} className="hidden-sidebar">
              <img src="/images/show-sidebar.svg" alt="show-icon" />
            </button>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
