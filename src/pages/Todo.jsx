import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import ModalEdit from "../components/ModalEdit";
import ModalTask from "../components/ModalTask";
import ModalCreate from "../components/ModalCreate";
import TodoBoard from "../components/TodoBoard";
import { setSearchInput } from "../store/taskSlice";
import { setModalCreate } from "../store/modalsSlice";
import { setCurrentData, setCurrentProject } from "../store/currentInfoSlice";
import useLocalStorage from "../customHooks/useLocalStorage";

const Todo = () => {
  const { updateLocalStorageAndState } = useLocalStorage()
  const dispatch = useDispatch();
  const searchInput = useSelector(state => state.task.searchInput)

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem('Projects'));
    let activeProject = JSON.parse(localStorage.getItem('Active project'))
    let obj = data[0].items.find(e => e.id === activeProject.id);
    let index = data[0].items.findIndex(e => e.id === obj.id);
    dispatch(setCurrentProject(obj))
    dispatch(setCurrentData(data[0].items[index].items))
  }, [])



  return (
    <div className="todo">
      <div className="todo__buttons">
        <button className="todo__button" onClick={() => dispatch(setModalCreate(true))}>Создать задачу</button>
        <div className="todo__search">
          <input className="todo__input" type="text" placeholder="Найти задачу" value={searchInput} onChange={(e) => dispatch(setSearchInput(e.target.value))}></input>
          <button className="todo__search-button" onClick={() => updateLocalStorageAndState('taskSearch')}>Найти</button>
        </div>
      </div>
      <div className="todo__container">
        <TodoBoard />
      </div>
      <ModalCreate />
      <ModalTask />
      <ModalEdit />
    </div>
  )
}

export default Todo