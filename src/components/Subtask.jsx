import React from 'react'
import useLocalStorage from '../customHooks/useLocalStorage';

const Subtask = (props) => {
    const { subtask } = props;
    const { updateLocalStorageAndState } = useLocalStorage() 

    function deleteSubtask(e, subtask) {
        e.stopPropagation();
        updateLocalStorageAndState('subtaskDelete', subtask)
    }

    return (
        <div className={subtask.status === "underway" ? "task-modal__subtask" : "task-modal__subtask task-modal__subtask-ready"} onClick={() => updateLocalStorageAndState('changeSubtaskStatus', subtask)}>
            <h3 className="task-modal__subtask-title">{subtask.title}</h3>
            <div className='task__modal__subtask-container'>
                <p className="task-modal__subtask-status">{subtask.status === 'underway' ? 'В процессе' : 'Готово'}</p>
                <img className='task-modal__subtask-delete' src='trash-icon.png' alt='Удалить' onClick={(e) => deleteSubtask(e, subtask)} />
            </div>
        </div>
    )
}

export default Subtask