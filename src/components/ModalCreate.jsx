import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setDesc, setPriority, setTodoName, setEndDate } from '../store/todoSlice'
import { setModalCreate } from '../store/modalsSlice';
import useLocalStorage from '../customHooks/useLocalStorage';

function ModalCreate() {
  const { updateLocalStorageAndState, clearInputs } = useLocalStorage()
  const [isFormValid, setIsFormValid] = useState(false);
  const priority = useSelector(state => state.todo.priority);
  const endDate = useSelector(state => state.todo.endDate);
  const modalCreate = useSelector(state => state.modals.modalCreate)
  const datePicker = new Date().toISOString().split('T')[0];
  const dispatch = useDispatch();

  function createTask(e) {
    e.preventDefault()
    clearInputs();
    updateLocalStorageAndState('taskCreate')
    dispatch(setModalCreate(false))
  }


  return (
    modalCreate && <div className="todo__modal">
      <form className="todo__modal-container" onChange={(e) => e.target.form.checkValidity() ? setIsFormValid(true) : setIsFormValid(false)}>
        <div className="todo__modal-header">
          <h2 className="todo__modal-title">Создать задачу</h2>
          <p className="todo__modal-close" onClick={() => dispatch(setModalCreate(false))}>x</p>
        </div>
        <fieldset className="todo__modal-input-container">
          <h3 className="todo__modal-input-title">Название</h3>
          <input type="text" className="todo__input todo__modal-input" placeholder="Название задачи" required minLength="2" maxLength="30"  onChange={(e) => dispatch(setTodoName(e.target.value))} />
          <h3 className="todo__modal-input-title">Описание*</h3>
          <textarea rows="4" cols="20" name="myText" className="todo__input todo__modal-input todo__modal-input-desc" placeholder="Описание задачи" onChange={(e) => dispatch(setDesc(e.target.value))} />
          <h3 className="todo__modal-input-title">Приоритет*</h3>
          <div className="todo__modal-priority-container">
            <div className={`todo__board-item-priority red ${priority === 'red' ? 'selected' : ''}`} onClick={() => dispatch(setPriority('red'))}></div>
            <div className={`todo__board-item-priority yellow ${priority === 'yellow' ? 'selected' : ''}`} onClick={() => dispatch(setPriority('yellow'))}></div>
            <div className={`todo__board-item-priority green ${priority === 'green' ? 'selected' : ''}`} onClick={() => dispatch(setPriority('green'))}></div>
          </div>
          <h3 className="todo__modal-input-title">Время окончания</h3>
          <input type="date" className={`todo__modal-date ${!endDate ? 'invalid' : ''}`} min={datePicker} onChange={(e) => dispatch(setEndDate(e.target.value))} required></input>
        </fieldset>
        <button className="todo__modal-button" disabled={isFormValid ? false : true} onClick={(e) => createTask(e)}>Создать</button>
      </form>
    </div>
  );
}

export default ModalCreate;