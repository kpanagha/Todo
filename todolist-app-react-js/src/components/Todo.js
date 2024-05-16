import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'; // Corrected icon imports

export const Todo = ({task,id,deleteTodo,editTodo,toggleComplete}) => {
  return (
    <div className="Todo">
        <p className={`${task.completed ? "completed" : "incompleted"}`} >{task}</p>
        <div>
        <FontAwesomeIcon className="edit-icon" icon={faPen} onClick={() => editTodo(id)} />
        <FontAwesomeIcon className="delete-icon" icon={faTrash} onClick={() => deleteTodo(id)} />
        </div>
    </div>
  )
}
