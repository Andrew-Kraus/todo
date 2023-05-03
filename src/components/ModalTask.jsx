import React, { useState } from 'react';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import CommentList from './CommentsList';
import { v4 as uuidv4 } from "uuid";
import { setEditDesc, setEditEndDate, setEditPriority, setEditTodoName } from '../store/todoEditSlice';
import { setUploadedFile, setComments, setSubtaskInput } from '../store/taskSlice';
import { setModalEdit, setModalTask } from '../store/modalsSlice';
import { useDispatch, useSelector } from 'react-redux';
import useLocalStorage from '../customHooks/useLocalStorage';
import { declension, dateDiff } from '../helpers/helpers';
import Subtask from './Subtask';

function ModalTask() {
  const { updateLocalStorageAndState } = useLocalStorage()
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false)
  const [commentText, setCommentText] = useState('');
  const date = dayjs().format('DD/MM/YYYY HH:mm')
  const dispatch = useDispatch();

  const uploadedFile = useSelector(state => state.task.uploadedFile)
  const comments = useSelector(state => state.task.comments)
  const modalTask = useSelector(state => state.modals.modalTask)
  const changeableComments = cloneDeep(comments);
  const subtaskInput = useSelector(state => state.task.subtaskInput)
  const currentSubtasks = useSelector(state => state.info.currentSubtasks)
  const currentTask = useSelector(state => state.info.currentTask)
  const currentFiles = useSelector(state => state.info.currentFiles)


  function formValidation(event) {
    setIsFormTouched(true);
    event.target.form.checkValidity() ? setIsFormValid(true) : setIsFormValid(false);
  }


  function fileLoading(e) {
    if (e.target.files[0]) {
      dispatch(setUploadedFile(e.target.files[0]))
    }
  }

  function fileDelete(e, file) {
    e.preventDefault()
    e.stopPropagation()
    updateLocalStorageAndState('fileDelete', file)
  }

  function openModalAndSaveValue() {
    dispatch(setEditTodoName(currentTask.title))
    dispatch(setEditDesc(currentTask.desc))
    dispatch(setEditPriority(currentTask.priority))
    dispatch(setEditEndDate(currentTask.endDate))
    dispatch(setModalEdit(true))
  }

  function createSubtask(e) {
    e.preventDefault();
    updateLocalStorageAndState('createSubtask');
    dispatch(setSubtaskInput(''));
    setIsFormTouched(false);
  }

  function createComment(e) {
    e.preventDefault()
    const newComment = {
      id: uuidv4(),
      text: commentText,
      date: date,
      comments: [],
    }
    const newComments = [...comments, newComment];
    dispatch(setComments(newComments))
    updateLocalStorageAndState('commentCreateAndDelete', newComments);
    setCommentText('')
  }

  return (
    modalTask && currentTask && <div className="task-modal">
      <div className="task-modal__container">
        <div className="task-modal__header">
          <div className="task-modal__header-container">
            <h2 className="task-modal__title">{`${currentTask.todoNum}. ${currentTask.title}`}</h2>
            <button className="task-modal__button-edit" onClick={() => openModalAndSaveValue()}>Редактировать</button>
            <button className="task-modal__button-edit task-modal__button-delete" onClick={() => updateLocalStorageAndState('taskDelete')}>Удалить</button>
          </div>
          <p className="task-modal__close" onClick={() => dispatch(setModalTask(false))}>x</p>
        </div>
        <div className="task-modal__columns">
          <div className="task-modal__info-container">
            <h3 className="task-modal__subtitle">Описание:</h3>
            <p className="task-modal__info">{currentTask.desc}</p>
            <h3 className="task-modal__subtitle">Даты:</h3>
            <h3 className="task-modal__info">Задача была создана: {dayjs(currentTask.currentDate).format('DD/MM/YYYY')}</h3>
            {currentTask.endDate && <h3 className="task-modal__info">Задача должна быть выполнена: {dayjs(currentTask.endDate).format('DD/MM/YYYY')}</h3>}
            <h3 className="task-modal__info">Время в работе: {dateDiff(currentTask) + ' ' + declension(dateDiff(currentTask), 'день')}</h3>
            <div className="task-modal__priority">
              <h3 className="task-modal__subtitle task-modal__subtitle-priority">Приоритет:</h3>
              <div className={`todo__board-item-priority ${currentTask.priority}`}></div>
            </div>
            <h3 className="task-modal__subtitle">Прикрепить файлы</h3>
            <label className="input-file">
              <input type="file" name="file" onChange={(e) => fileLoading(e)}></input>
              <span className="task-modal__button-upload">Выберите файл</span>
              <button className="task-modal__button-submit" disabled={uploadedFile ? false : true} onClick={() => updateLocalStorageAndState('fileSubmit', uploadedFile)}>Прикрепить</button>
            </label>
            <div className="task-modal__files">
              {currentFiles && currentFiles.map((file, index) => {
                return (
                  <a className='task-modal__image-container' href={file} download key={index}>
                    <p className='task-modal__image-delete' onClick={(e) => fileDelete(e, file)}>x</p>
                    <img className="task-modal__image" alt="" src={file} onError={e => { e.currentTarget.src = "error.png" }}/>
                  </a>)
              })}
            </div>
            <h3 className='task-modal__subtitle'>Комментарии:</h3>
            <form className='task-modal__comments-form'>
              <textarea className='task-modal__comments-text' minLength="1" maxLength="1000" required placeholder='Напишите комментарий' value={commentText} onChange={(e) => setCommentText(e.target.value)}></textarea>
              <button className='task-modal__comments-button' disabled={commentText !== '' ? false : true} onClick={(e) => createComment(e)}>✓</button>
            </form>
            {comments && <CommentList comments={changeableComments} updateLocalStorageAndState={updateLocalStorageAndState} />}
          </div>
          <div className="task-modal__subtasks">
            <h2 className="task-modal__subtitle">Подзадачи:</h2>
            <form className="task-modal__subtasks-create" onChange={(e) => formValidation(e)}>
              <input className="task-modal__input" type="text" required={isFormTouched ? 'required' : ''} value={subtaskInput} minLength="2" maxLength="100" placeholder="Название" onChange={(e) => dispatch(setSubtaskInput(e.target.value))}></input>
              <button className="task-modal__button" disabled={isFormValid && subtaskInput ? false : true} onClick={(e) => createSubtask(e)}>Создать</button>
            </form>
            {currentSubtasks && currentSubtasks.map((subtask, index) => {
              return <Subtask subtask={subtask} key={index} />
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalTask;