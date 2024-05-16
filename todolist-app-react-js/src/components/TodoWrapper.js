import React, { useState, useEffect } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { EditTodoForm } from "./EditTodoForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import mixpanel from 'mixpanel-browser';


export const TodoWrapper = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:1000/api/v2/getTasks/${userId}`);
        setTodos(response.data.list || []);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    fetchTasks();
  }, [userId, navigate]);

  const addTodo = async (todo) => {
    try {
      const response = await axios.post('http://localhost:1000/api/v2/addTask', { title: todo, id: userId });
      if (response.status === 200 && response.data && response.data.list) {
        const newTodo = response.data.list;
        setTodos([...todos, newTodo]);
        mixpanel.track('Task Added', { userId: userId, taskId: newTodo._id, taskTitle: newTodo.title });
      } else {
        throw new Error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const editTask = async (task, id) => {
    try {
      const response = await axios.put(`http://localhost:1000/api/v2/updateTask/${id}`, { task });
      if (response.status === 200) {
        setTodos(
          todos.map((todo) =>
            todo._id === id ? { ...todo, title:task,isEditing:false,completed:true } : todo
          )
        );
        mixpanel.track('Task Edited', { userId: userId, taskId: id, newTaskTitle: task });
      } else {
        console.error('Failed to edit task');
      }
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const toggleEdit = (id) => {
    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, isEditing: true } : todo
      )
    );
  };

  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:1000/api/v2/deleteTask/${id}`, { data: { id: userId }, });
      if (response.status === 200) {
        setTodos(todos.filter((todo) => todo._id !== id));
        mixpanel.track('Task Deleted', { userId: userId, taskId: id });
      } else {
        console.error('Failed to delete task. Server returned status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };  

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('id');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div>
       <button onClick={handleLogout}>Logout</button>
    
    <div className="TodoWrapper">
      <h1>Get Things Done!</h1>
     
      <TodoForm addTodo={addTodo} />
      {todos.map((item, index) =>
        item.isEditing ? (
          <EditTodoForm key={index} editTodo={editTask} task={item} />
        ) : (
          <Todo
            key={index}
            task={item.title}
            id={item._id}
            editTodo={() => toggleEdit(item._id)}
            deleteTodo={() => deleteTask(item._id)}
          />
        )
      )}
    </div>
    </div>
  );
};

