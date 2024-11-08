import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'
import { response } from 'express';
interface Projects {
  boards: []
  _id: string,
  name: String,
  columns: [{
    name: String,
    tasks: [{
      title: String,
      description: String,
      status: String,
      subtasks: [{
        title: String,
        isCompleted: Boolean
      }]
    }],
  }]


}
function App() {
  const [projects, setProjects] = useState<Projects[]>([])

  useEffect(() => {
    axios.get('https://kanban-task-server-7zl1.onrender.com/projects')
      .then(response => {
        setProjects(response.data[0].boards || [])
      })
  })
  return (
    <div className="App">
      {projects && projects.map((project) => {
        return <div>
          <p>{project?.name}</p>
        </div>
      })}
    </div>
  );
}

export default App;
