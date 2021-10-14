import React from 'react';
import './TodoItem.css'

const TodoItem = ({ todo, removeHandler, updateTodo }) => {
    return (
        <div className='itemContainer'>
            <div>
                <input 
                    type='checkbox' 
                    name={`checkbox-${todo.id}`} 
                    checked={todo.completed} 
                    data-testid={`checkbox-${todo.id}`} 
                    onChange={() => updateTodo(todo.id)} 
                />
                <label 
                    htmlFor={`checkbox-${todo.id}`}
                    onClick={() => updateTodo(todo.id)} 
                    className={todo.completed ? 'completed' : ''} 
                >
                    {todo.title}
                </label>
            </div>
            <button className={'closeBtn'} data-testid={`close-btn-${todo.id}`} onClick={() => removeHandler(todo.id)}>X</button>
        </div>
    );
}

export default TodoItem;