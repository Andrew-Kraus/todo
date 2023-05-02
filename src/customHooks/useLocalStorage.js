import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { setComments, setSearchInput, setSubtaskInput, setUploadedFile } from "../store/taskSlice";
import dayjs from 'dayjs';
import { setCurrentData, setCurrentSubtasks, setCurrentFiles, setCurrentTask, setCurrentBoard } from "../store/currentInfoSlice";
import { setDesc, setEndDate, setPriority, setTodoName } from '../store/todoSlice';
import { setEditDesc, setEditEndDate, setEditPriority, setEditTodoName } from '../store/todoEditSlice';
import { setModalTask } from '../store/modalsSlice';
import { findGap, getBase64 } from '../helpers/helpers';

function useLocalStorage() {
    const dispatch = useDispatch();
    const todoName = useSelector(state => state.todo.todoName)
    const desc = useSelector(state => state.todo.desc)
    const endDate = useSelector(state => state.todo.endDate)
    const priority = useSelector(state => state.todo.priority)
    const editTodoName = useSelector(state => state.todoEdit.editTodoName);
    const editDesc = useSelector(state => state.todoEdit.editDesc)
    const editEndDate = useSelector(state => state.todoEdit.editEndDate)
    const editPriority = useSelector(state => state.todoEdit.editPriority)
    const currentBoard = useSelector(state => state.info.currentBoard)
    const subtaskInput = useSelector(state => state.task.subtaskInput)
    const currentTask = useSelector(state => state.info.currentTask)
    const searchInput = useSelector(state => state.task.searchInput)
    const currentProject = useSelector(state => state.info.currentProject)
    const uid = uuidv4()

    function clearInputs() {
        dispatch(setTodoName(''))
        dispatch(setDesc(''))
        dispatch(setEndDate(''))
        dispatch(setPriority(''))
        dispatch(setEditTodoName(''))
        dispatch(setEditDesc(''))
        dispatch(setEditEndDate(''))
        dispatch(setEditPriority(''))
        dispatch(setSubtaskInput(''));
        dispatch(setSearchInput(''));
    }

    function taskRender(item, board, subtasks, files, taskComments) {
        clearInputs();
        dispatch(setCurrentTask(item));
        dispatch(setCurrentBoard(board));
        dispatch(setCurrentSubtasks(subtasks));
        dispatch(setCurrentFiles(files));
        dispatch(setModalTask(true))
        dispatch(setComments(taskComments))
    }



    function updateLocalStorageAndState(key, item) {
        let data = JSON.parse(localStorage.getItem('Projects'));
        let index = data[0].items.findIndex(e => e.id === currentProject.id);
        const date = dayjs().format('YYYY-MM-DDHH:mm:ss')
        if (key === 'taskEdit') {
            let taskIndex = data[0].items[index].items[currentBoard.id - 1].items.findIndex(e => e.id === currentTask.id)
            data[0].items[index].items[currentBoard.id - 1].items[taskIndex].title = editTodoName;
            data[0].items[index].items[currentBoard.id - 1].items[taskIndex].desc = editDesc;
            data[0].items[index].items[currentBoard.id - 1].items[taskIndex].endDate = editEndDate;
            data[0].items[index].items[currentBoard.id - 1].items[taskIndex].priority = editPriority;
            localStorage.setItem('Projects', JSON.stringify(data));
            dispatch(setCurrentTask(data[0].items[index].items[currentBoard.id - 1].items[taskIndex]))
            dispatch(setCurrentData(data[0].items[index].items))
        } if (key === 'createSubtask') {
            let taskIndex = data[0].items[index].items[currentBoard.id - 1].items.findIndex(e => e.id === currentTask.id)
            data[0].items[index].items[currentBoard.id - 1].items[taskIndex].subtasks.push({ id: uid, title: subtaskInput, status: 'underway' })
            localStorage.setItem('Projects', JSON.stringify(data))
            dispatch(setCurrentSubtasks(data[0].items[index].items[currentBoard.id - 1].items[taskIndex].subtasks))
            dispatch(setCurrentData(data[0].items[index].items))
        } if (key === 'updateCurrentData') {
            data[0].items[index].items.splice(0, 3, item[0], item[1], item[2])
            localStorage.setItem('Projects', JSON.stringify(data))
            dispatch(setCurrentData(data[0].items[index].items))
        } if (key === 'taskCreate') {
            let numArr = []
            for (let i = 0; i < 3; i++) {
                data[0].items[index].items[i].items.forEach((task) => {
                    numArr.push(task.todoNum)
                })
            }
            numArr.sort((a, b) => a - b)
            let taskNum = findGap(numArr)
            data[0].items[index].items[0].items.push({ id: uid, title: todoName, desc: desc, endDate: endDate, currentDate: date, priority: priority, todoNum: taskNum, files: [], subtasks: [], comments: [] });
            localStorage.setItem('Projects', JSON.stringify(data));
            dispatch(setCurrentData(data[0].items[index].items));
        } if (key === 'taskSearch') {
            let obj = data[0].items.find(e => e.id === currentProject.id);
            let tasks = []
            obj.items.forEach((item) => {
                item.items.forEach((item) => {
                    tasks.push(item)
                })
            })
            let task = tasks.find(e => e.title === searchInput)
            if (task !== undefined) {
                taskRender(task, currentBoard, task.subtasks, task.files);
            } if (task === undefined) {
                let taskNum = tasks.find(e => e.todoNum.toString() === searchInput.toString())
                if (taskNum !== undefined) {
                    taskRender(taskNum, currentBoard, taskNum.subtasks, taskNum.files)
                } if (taskNum === undefined) {
                    console.log('Задача не найдена')
                }
            }
        } if (key === 'changeSubtaskStatus') {
            let taskIndex = data[0].items[index].items[currentBoard.id - 1].items.findIndex(e => e.id === currentTask.id)
            let subtaskIndex = data[0].items[index].items[currentBoard.id - 1].items[taskIndex].subtasks.findIndex(e => e.id === item.id)
            if (item.status !== 'ready') {
                data[0].items[index].items[currentBoard.id - 1].items[taskIndex].subtasks[subtaskIndex].status = 'ready'
            } else {
                data[0].items[index].items[currentBoard.id - 1].items[taskIndex].subtasks[subtaskIndex].status = 'underway'
            }
            localStorage.setItem('Projects', JSON.stringify(data))
            dispatch(setCurrentSubtasks(data[0].items[index].items[currentBoard.id - 1].items[taskIndex].subtasks))
            dispatch(setCurrentData(data[0].items[index].items))
        } if (key === 'fileSubmit') {
            getBase64(item).then(base64 => {
                let taskIndex = data[0].items[index].items[currentBoard.id - 1].items.findIndex(e => e.id === currentTask.id)
                data[0].items[index].items[currentBoard.id - 1].items[taskIndex].files.push(base64);
                localStorage.setItem('Projects', JSON.stringify(data));
                setCurrentData(data[0].items[index].items);
                dispatch(setCurrentFiles(data[0].items[index].items[currentBoard.id - 1].items[taskIndex].files));
                dispatch(setUploadedFile(null))
            })
                .catch((err) => console.log(err))
        } if (key === 'taskDelete') {
            let taskIndex = data[0].items[index].items[currentBoard.id - 1].items.findIndex(e => e.id === currentTask.id)
            data[0].items[index].items[currentBoard.id - 1].items.splice(taskIndex, 1);
            localStorage.setItem('Projects', JSON.stringify(data));
            dispatch(setCurrentTask(null))
            dispatch(setCurrentData(data[0].items[index].items))
        } if (key === 'subtaskDelete') {
            let taskIndex = data[0].items[index].items[currentBoard.id - 1].items.findIndex(e => e.id === currentTask.id)
            let subtaskIndex = data[0].items[index].items[currentBoard.id - 1].items[taskIndex].subtasks.findIndex(e => e.id === item.id)
            data[0].items[index].items[currentBoard.id - 1].items[taskIndex].subtasks.splice(subtaskIndex, 1);
            localStorage.setItem('Projects', JSON.stringify(data))
            dispatch(setCurrentSubtasks(data[0].items[index].items[currentBoard.id - 1].items[taskIndex].subtasks))
            dispatch(setCurrentData(data[0].items[index].items))
        } if (key === 'commentCreateAndDelete') {
            let taskIndex = data[0].items[index].items[currentBoard.id - 1].items.findIndex(e => e.id === currentTask.id);
            delete data[0].items[index].items[currentBoard.id - 1].items[taskIndex].comments;
            data[0].items[index].items[currentBoard.id - 1].items[taskIndex].comments = [...item];
            localStorage.setItem('Projects', JSON.stringify(data));
            dispatch(setComments(data[0].items[index].items[currentBoard.id - 1].items[taskIndex].comments))
            dispatch(setCurrentData(data[0].items[index].items))
        }
    }

    return { updateLocalStorageAndState, taskRender, clearInputs }
}

export default useLocalStorage;