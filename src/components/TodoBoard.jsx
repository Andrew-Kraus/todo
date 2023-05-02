import React, { useState } from 'react';
import { setCurrentData, setCurrentBoard } from '../store/currentInfoSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { cloneDeep } from 'lodash';
import useLocalStorage from '../customHooks/useLocalStorage';

function TodoBoard() {
    const { updateLocalStorageAndState, taskRender } = useLocalStorage()
    const [currentItem, setCurrentItem] = useState(null)

    const currentData = useSelector(state => state.info.currentData)
    const currentBoard = useSelector(state => state.info.currentBoard)
    const dispatch = useDispatch()

    function dragOverHandler(e) {
        e.preventDefault();
    }

    function dragStartHandler(e, board, item) {
        dispatch(setCurrentBoard(board))
        setCurrentItem(item)
    }


    function dropHandler(e, board, item) {
        e.preventDefault()
        e.stopPropagation()
        const boardCopy = cloneDeep(board)
        const currentBoardCopy = cloneDeep(currentBoard)
        const currentDataCopy = cloneDeep(currentData)

        const currentBoardIndex = currentDataCopy.findIndex(b => b.id === currentBoard.id)
        const boardIndex = currentDataCopy.findIndex(b => b.id === board.id)
        const currentItemIndex = currentBoard.items.findIndex(i => i.id === currentItem.id)
        const dropIndex = board.items.findIndex(i => i.id === item.id)

        if (board.id === currentBoard.id) {
            currentBoardCopy.items.splice(currentItemIndex, 1)
            currentBoardCopy.items.splice(dropIndex, 0, currentItem)
        } else {
            currentBoardCopy.items.splice(currentItemIndex, 1)
            boardCopy.items.splice(dropIndex + 1, 0, currentItem)
        }

        const updatedData = currentDataCopy.map((b, index) => {
            if (index === currentBoardIndex) {
                return currentBoardCopy
            } else if (index === boardIndex) {
                return boardCopy
            } else {
                return b
            }
        })

        dispatch(setCurrentData(updatedData))
        updateLocalStorageAndState('updateCurrentData', updatedData);
        e.target.style.boxShadow = 'none'
    }


    function dropCardHandler(e, board) {
        const boardCopy = cloneDeep(board)
        const currentBoardCopy = cloneDeep(currentBoard)
        const currentDataCopy = cloneDeep(currentData)

        const currentIndex = currentBoard.items.findIndex(b => b.id === currentItem.id)

        if (board.id === currentBoard.id) {
            boardCopy.items.splice(currentIndex, 1)
            boardCopy.items.push(currentItem)
        } else {
            currentBoardCopy.items.splice(currentIndex, 1)
            boardCopy.items.push(currentItem)
        }


        const updatedData = currentDataCopy.map(b => {
            if (b.id === board.id) {
                return boardCopy
            }
            if (b.id === currentBoard.id) {
                return currentBoardCopy
            }
            return b
        })
        dispatch(setCurrentData(updatedData))
        updateLocalStorageAndState('updateCurrentData', updatedData);
        e.target.style.boxShadow = 'none'
    }


    return (
        currentData.map((board, index) => {
            return (
                <div
                    className="todo__board"
                    onDragOver={(e) => dragOverHandler(e)}
                    onDrop={(e) => dropCardHandler(e, board)}
                    key={index}
                >
                    <div className="todo__board-title no-select">{board.title}</div>
                    {board.items.map((item, index) => {
                        return (
                            <div
                                onDragOver={(e) => dragOverHandler(e)}
                                onDragStart={(e) => dragStartHandler(e, board, item)}
                                onDrop={(e) => dropHandler(e, board, item)}
                                draggable={true}
                                key={index}
                                className="todo__board-item"
                                onClick={() => taskRender(item, board, item.subtasks, item.files, item.comments)}
                            >
                                <p className='todo__board-text'>{`${item.todoNum}. ${item.title}`}</p>
                                {item.priority && <div className={`todo__board-item-priority ${item.priority}`}></div>}
                            </div>
                        )
                    }
                    )}
                </div>
            )
        }
        )
    );
}

export default TodoBoard;