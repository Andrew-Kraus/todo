import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Projects = () => {
  const [modalActive, setModalActive] = useState(false)
  const [inputValue, setInputValue] = useState("");
  const [projects, setProjects] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false)
  let uid = uuidv4()


  useEffect(() => {
    setProjects([]);
    let data = JSON.parse(localStorage.getItem('Projects'))
    if (data !== null) {
      console.log(data[0].items)
      setProjects(data[0].items)
    } else {
      setProjects([]);
    }
  }, [])

  const createProject = () => {
    setModalActive(false);
    let projects = JSON.parse(localStorage.getItem('Projects'))
    if (projects == null) {
      const arr = [{
        id: uid, name: 'ProjectsList', items: [{
          id: uid, name: inputValue, items: [
            { id: 1, title: 'Сделать', items: [] },
            { id: 2, title: 'В процессе', items: [] },
            { id: 3, title: 'Готово', items: [] },
          ]
        }]
      }];
      localStorage.setItem('Projects', JSON.stringify(arr))
      setProjects(arr[0].items)
    } else {
      let newItem = {
        id: uid, name: inputValue, items: [
          { id: 1, title: 'Сделать', items: [] },
          { id: 2, title: 'В процессе', items: [] },
          { id: 3, title: 'Готово', items: [] },
        ]
      }
      projects[0].items.push(newItem);
      localStorage.setItem('Projects', JSON.stringify(projects));
      setProjects(projects[0].items)
    }
  }

  function projectDelete(e, project) {
    e.stopPropagation();
    e.preventDefault();
    let data = JSON.parse(localStorage.getItem('Projects'))
    let projectIndex = data[0].items.findIndex((p) => p.id === project.id)
    data[0].items.splice(projectIndex, 1);
    localStorage.setItem('Projects', JSON.stringify(data));
    setProjects(data[0].items);
  }

  function checkValid(e) {
    e.target.form.checkValidity() ? setIsFormValid(true) : setIsFormValid(false);
    setIsFormTouched(true);
  }

  return (
    <div className="projects">
      <h1 className="projects__title">Ваши проекты</h1>
      <button className="projects__button" onClick={() => setModalActive(true)}>Создать новый</button>
      <div className="projects__container">
        {projects && projects.map((project, index) => {
          return (
            <Link to='/todo' key={index}>
              <div className="projects__item" onClick={() => localStorage.setItem('Active project', JSON.stringify(project))}>
                <h2 className="projects__item-title">{project.name}</h2>
                <p className="projects__item-delete" onClick={(e) => projectDelete(e, project)}>x</p>
              </div>
            </Link>
          )
        })}
      </div>
      {modalActive && <div className="modal">
        <div className="modal__container">
          <div className="modal__header">
            <h2 className="modal__title">Создать проект</h2>
            <p className="modal__close" onClick={() => setModalActive(false)}>x</p>
          </div>
          <form className="modal__input-container" onChange={(e) => checkValid(e)}>
            <input type="text" className="modal__input" placeholder="Название проекта" minLength="2" maxLength="25" required={isFormTouched ? 'required' : ''} onChange={(e) => setInputValue(e.target.value)}></input>
            <button className="modal__button" disabled={isFormValid ? false : true} onClick={() => createProject()}>Создать</button>
          </form>
        </div>
      </div>}
    </div>
  )
}

export default Projects