import React, { useEffect, useState } from 'react';
import './App.css';
import Todo, { TodoType } from './Todo';

function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [title, setTitle] = useState<string>("default");
  const [description, setDescrip] = useState<string>("default");
  const [flag, setFlag] = useState<boolean>(true);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const item: TodoType = {title, description};

    try{
      const response = await fetch('http://localhost:8080/addtodo', {
        method: 'POST',
        body: JSON.stringify(item)
      });

      if (response.ok){
        console.log("Success!");
        setFlag(() => !flag)
      }
      else{
        console.error("Error", response.statusText)
      }
    } catch(error){
      console.error(error);
    }
  }

  // Initially fetch todo
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await fetch('http://localhost:8080/todosget');
        if (todos.status !== 200) {
          console.log('Error fetching data');
          return;
        }

        setTodos(await todos.json());
      } catch (e) {
        console.log('Could not connect to server. Ensure it is running. ' + e);
      }
    }

    fetchTodos()
  }, [flag]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <div className="todo-list">
        {todos != null && todos.map((todo) =>
          <Todo
            key={todo.title + todo.description}
            title={todo.title}
            description={todo.description}
          />
        )}
      </div>

      <h2>Add a Todo</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" name="title" autoFocus={true} onChange={(e) => setTitle(e.target.value)}/>
        <input placeholder="Description" name="description" onChange={(e) => setDescrip(e.target.value)}/>
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}

export default App;
