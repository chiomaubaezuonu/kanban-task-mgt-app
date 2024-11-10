import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'
import { Switch } from 'antd';



interface Projects {
  boards: []
  _id: string,
  name: string,
  columns: [{
    name: string,
    tasks: [{
      title: string,
      description: string,
      status: string,
      subtasks: [{
        title: string,
        isCompleted: Boolean
      }]
    }],
  }]
}

interface ProjectData {
  projectName: string,
  projectStatus: string
}
function App() {
  const [projects, setProjects] = useState<Projects[]>([])
  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: "Platform Launch",
    projectStatus: ""
  })

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  useEffect(() => {
    axios.get('https://kanban-task-server-7zl1.onrender.com/projects')
      .then(response => {
        setProjects(response.data[0].boards || [])

      })
  }, [])

  const handleSelectedProject = (selectedProjectName: any) => {
    if (projects) {
      const projectName = projects.find(project => selectedProjectName === project.name)
      setProjectData({ ...projectData, projectName: projectName?.name || "" })
    }
  }

  useEffect(() => {
    setProjectData({ ...projectData, projectName: "Platform Launch" })
    console.log(projects.flatMap(project => project.columns.map(column => column.name)))
  }, [projects])

  // console.log(projects.map(project => project.columns.map(column => column.name)))
  console.log(isSidebarOpen)
  return (
    <div className="container">
      {isSidebarOpen &&
        <div className='sidebar'>
          <div className='nav-list'>
            <div className="logo">
              <img src="/images/logo-light.svg" alt="logo" />
            </div>

            <div className="all-boards">
              <p>{`All boards (${projects.length})`}</p>
              {projects &&
                projects.map((project) => {
                  return <div key={project._id} onClick={() => handleSelectedProject(project.name)} className='boards-list'>
                    <a href="">
                      <img src="/images/sidebarIcon.svg" alt="view board" />
                      <p>{project.name}</p>
                    </a>
                  </div>
                })
              }
              < div className='new-board'>
                <img src="/images/sidebarIcon.svg" alt="view board" />
                <p>+ Create New Board</p>
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
              <div className="hide-sidebar" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <img src="/images/hide-icon.svg" alt="hide sidebar icon" />
                <p>Hide Sidebar</p>
              </div>
            </div>
          }
        </div>
      }

      <div className='right-div'>
        <header className="header">
          <h1>{projectData.projectName}</h1>
          <button className='header-btn'>+ Add New Task</button>
        </header>
        <main>
          <div className='status'>
            <p >{projects && projects.map(project => project.columns.map(column => column.name))}</p>
          </div>
          {!isSidebarOpen &&
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className='hidden-sidebar'>
              <img src="/images/show-sidebar.svg" alt="show-icon" />
            </button>}
        </main>

      </div>
    </div>
  );
}

export default App;
