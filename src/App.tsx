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

function App() {
  const [projects, setProjects] = useState<Projects[]>([])

  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  useEffect(() => {
    axios.get('https://kanban-task-server-7zl1.onrender.com/projects')
      .then(response => {
        setProjects(response.data[0].boards || [])

      })
  }, [])

  useEffect(() => {
    // return projects ? console.log(projects[0].columns.map(column=> column.name)) : console.log("Fetching")
    // return projects ? console.log(projects.map(project=> project.name)) : console.log("Fetching")
    //return projects ? console.log(projects.length) : console.log("Fetching")
  }, [projects])

  return (
    <div className="App">
      <div className='sidebar'>
        <div className='nav-list'>
          <img src="/images/logo-light.svg" alt="logo" />
          <p>{`All boards (${projects.length})`}</p>

          {projects &&
            projects.map((project) => {
              return <div key={project._id} className='boards-list'>
                <img src="/images/viewIcon.png" alt="view board" />
                <p>{project.name}</p>
              </div>
            })
          }
          < div className='boards-list'>
            <img src="/images/viewIcon.png" alt="view board" />
            <p>+ Create New Board</p>
          </div>
        </div>
        <div className="theme-wrapper">
          <img src="/images/light-theme.svg" alt="light-theme" />
          <Switch defaultChecked onChange={onChange} />
          <img src="/images/dark-theme.svg" alt="dark-theme" />
        </div>
      </div>
    </div>
  );
}

export default App;
