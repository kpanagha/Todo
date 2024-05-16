import React, {useState} from 'react'

export const EditTodoForm = ({editTodo, task}) => {
  //console.log(task,"taskkk");
    const [value, setValue] = useState(task.title);

    const handleSubmit = (e) => {
      // prevent default action
        e.preventDefault();
        // edit todo
        editTodo(value, task._id,);
      };
  return (
    <form onSubmit={handleSubmit} className="TodoForm">
    <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="todo-input" placeholder='Update task' />
    <button type="submit" className='todo-btn'>Update Task</button>
  </form>
  )
}