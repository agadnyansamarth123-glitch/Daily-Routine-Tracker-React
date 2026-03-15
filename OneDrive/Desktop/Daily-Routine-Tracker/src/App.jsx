import { useState , useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import './App.css'

function Header({name,today}){
  return(
    <div className="header">
      <h1>Daily Routine Tracker</h1>
      <p className='date'>{today.toDateString()}</p>
      <p className='name'>👤 {name}</p>
    </div>
  )

}

function QuoteCard({quote}){
  return(
    <div className="quote-card">
     {
      quote?(<>
      <div className="quote-text">{quote.text}</div>
      <div className="quote-Author">{quote.author}</div>
      </>)
      :
     ( <p>Loading Quote.....</p>)
     }

    </div>
  )
}

function AddTask({inputText,setInputText,addTask})
{
  return(
    <div className="add-class">
      <input type="text" placeholder='Enter your task' value={inputText} onChange={(e)=>setInputText(e.target.value)} onKeyPress={(e)=>e.key==="Enter" && addTask()}/>
      <button onClick={addTask}>+</button>
    </div>
  )
}

function TaskList({tasks,deleteTask,toggleTask})
{
  return(
    <div className="tasks-list">
      {
        tasks.length===0?(<p className="empty">Enter Some Task Brooooo</p>):(
          <ol>
           { tasks.map((task) => (
              <li key={task.id} className={task.completed?"completed":""}> 
              <input type="checkbox" checked={task.completed} onChange={()=>toggleTask(task.id)}/>
             <span>{task.text}</span>
             <button onClick={() => deleteTask(task.id)}>
                  <Trash2 size={16} /> </button>
            </li>
            ))}
          </ol>
        )
      }


    </div>
  )
}

function ProgressBar({ tasks }) {
  let total = tasks.length
  let completed = tasks.filter(task => task.completed).length
  let percent = total > 0 ? Math.round((completed / total) * 100) : 0

  let message
  if (percent === 100) {
    message = " All Done!"
  } else if (percent >= 50) {
    message = " Great Progress!"
  } else {
    message = "Keep Going!"
  }

  return (
    <div className="progress">
      <p>Progress: {percent}%</p>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: percent + "%",
            backgroundColor:
              percent === 100 ? "gold" :
              percent >= 50  ? "#4CAF50" :
                               "#ff9800"
          }}
        />
      </div>
      <p className="progress-message">{message}</p>
    </div>
  )
}





function App()
{
  const [inputText,setInputText] = useState("")
  const [tasks,setTasks] = useState([{id:1,text:"Reading",completed:false},{id:2,text:"Gym",completed:false}])
  const [quote,setQuote] = useState(null)
  let name ="Samarth"
  let today = new Date()

  function addTask ()
  { 
    let newTask
    if(inputText==="")return
    newTask={id:Date.now(),text:inputText,completed:false}
    setTasks([...tasks,newTask])
    setInputText("")  
  }

  function toggleTask(id)
  {
   setTasks( tasks.map((task)=>(
      id===task.id? {...task,completed:!task.completed}:task
    )))
  }

  function deleteTask (id)
  {
    setTasks(tasks.filter((task)=>task.id!==id))
  }
  
  useEffect(()=>{
    async function getQuote() {
      try{
      let response= await fetch("https://dummyjson.com/quotes/random")
      let data = await response.json()
      setQuote({
        text: data.quote,
        author: data.author
      })}
      catch(error){
        console.log("Quote fetch failed:", error)
      }
   }
   getQuote()
  },[])


   return (
    <div className="container">
      <Header name={name} today={today}/>
      <QuoteCard quote={quote}/>
       <AddTask
      inputText={inputText}
      setInputText={setInputText}
      addTask={addTask}
      />
      <TaskList
      tasks={tasks}
      toggleTask={toggleTask}
      deleteTask={deleteTask}
    />
     <ProgressBar tasks={tasks} />
      
    </div>
  )


}


export default App
