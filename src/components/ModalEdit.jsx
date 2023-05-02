import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditDesc, setEditPriority, setEditTodoName, setEditEndDate } from '../store/todoEditSlice'
import { setModalEdit } from '../store/modalsSlice';
import useLocalStorage from '../customHooks/useLocalStorage';

function ModalEdit() {
  const { updateLocalStorageAndState, clearInputs } = useLocalStorage()
  const [isFormValid, setIsFormValid] = useState(true);
  const editPriority = useSelector(state => state.todoEdit.editPriority)
  const editEndDate = useSelector(state => state.todoEdit.editEndDate)
  const modalEdit = useSelector(state => state.modals.modalEdit)
  const currentTask = useSelector(state => state.info.currentTask)

  const datePicker = new Date().toISOString().split('T')[0];
  const dispatch = useDispatch()

  function editTask(e) {
    e.preventDefault();
    updateLocalStorageAndState('taskEdit');
    dispatch(setModalEdit(false));
    clearInputs();
  }


  return (
    modalEdit && (
      <div className="todo__modal">
        <form className="todo__modal-container" onChange={(e) => e.target.form.checkValidity() ? setIsFormValid(true) : setIsFormValid(false)}>
          <div className="todo__modal-header">
            <h2 className="todo__modal-title">Редактировать задачу</h2>
            <p className="todo__modal-close" onClick={() => dispatch(setModalEdit(false))}>x</p>
          </div>
          <fieldset className="todo__modal-input-container">
            <h3 className="todo__modal-input-title">Название</h3>
            <input
              type="text"
              className="todo__input todo__modal-input"
              placeholder={currentTask.title.length === 0 ? 'Название задачи' : currentTask.title}
              defaultValue={currentTask.title}
              required
              minLength="2"
              maxLength="30"
              onChange={(e) => dispatch(setEditTodoName(e.target.value))}
            />
            <h3 className="todo__modal-input-title">Описание*</h3>
            <textarea
              rows="4"
              cols="20"
              name="myText"
              className="todo__input todo__modal-input todo__modal-input-desc"
              placeholder={currentTask.desc.length === 0 ? 'Описание задачи' : currentTask.desc}
              defaultValue={currentTask.desc}
              onChange={(e) => dispatch(setEditDesc(e.target.value))}
            />
            <h3 className="todo__modal-input-title">Приоритет*</h3>
            <div className="todo__modal-priority-container">
              <div className={`todo__board-item-priority red ${editPriority === 'red' ? 'selected' : ''}`} onClick={() => dispatch(setEditPriority('red'))}></div>
              <div className={`todo__board-item-priority yellow ${editPriority === 'yellow' ? 'selected' : ''}`} onClick={() => dispatch(setEditPriority('yellow'))}></div>
              <div className={`todo__board-item-priority green ${editPriority === 'green' ? 'selected' : ''}`} onClick={() => dispatch(setEditPriority('green'))}></div>
            </div>
            <h3 className="todo__modal-input-title">Время окончания</h3>
            <input
              type="date"
              className={`todo__modal-date ${!editEndDate ? 'invalid' : ''}`}
              min={datePicker}
              defaultValue={currentTask.endDate}
              required
              onChange={(e) => dispatch(setEditEndDate(e.target.value))}
            ></input>
          </fieldset>
          <button className="todo__modal-button" disabled={isFormValid ? false : true} onClick={(e) => editTask(e)}>Подтвердить</button>
        </form>
      </div>
    )
  );
}

export default ModalEdit;