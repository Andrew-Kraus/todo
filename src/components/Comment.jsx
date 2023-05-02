import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { setComments } from "../store/taskSlice";
import useLocalStorage from "../customHooks/useLocalStorage";

const Comment = (props) => {
    const {
        comment,
        comments,
    } = props;

    const { updateLocalStorageAndState } = useLocalStorage()
    const [commentText, setCommentText] = useState();
    const [isReplyOpen, setIsReplyOpen] = useState(false)
    const [isFormValid, setIsFormValid] = useState(false);
    const dispatch = useDispatch()
    const date = dayjs().format('DD/MM/YYYY HH:mm')

    function createComment(comment, e) {
        e.preventDefault()
        const newComment = {
            id: uuidv4(),
            text: commentText,
            date: date,
            comments: [],
        }
        comment.comments.push(newComment)
        const newComments = [...comments]
        updateLocalStorageAndState('commentCreateAndDelete', newComments);
        dispatch(setComments(newComments))
        setIsReplyOpen(false)
    }
    function deleteComment(id) {
        const newComments = comments.filter(comment => {
            if (comment.id === id) {
                return false;
            } else if (comment.comments) {
                comment.comments = deleteCommentRecursive(comment.comments, id);
            }
            return true;
        });
        dispatch(setComments(newComments))
        updateLocalStorageAndState('commentCreateAndDelete', newComments);
    }

    function deleteCommentRecursive(comments, id) {
        return comments.filter(comment => {
            if (comment.id === id) {
                return false;
            } else if (comment.comments) {
                comment.comments = deleteCommentRecursive(comment.comments, id);
            }
            return true;
        });
    }
    return (
        <div className="task-modal__comment">
            <div className="task-modal__comment-container">
                <p className="task-modal__comment-date">{comment.date}</p>
                <p className="task-modal__comment-delete" onClick={() => deleteComment(comment.id)}>x</p>
            </div>
            <p className="task-modal__comment-text">{comment.text}</p>
            {isReplyOpen ? <form className="task-modal__comment-reply-container" onChange={(e) => e.target.form.checkValidity() ? setIsFormValid(true) : setIsFormValid(false)}>
                <textarea className='task-modal__comment-input' placeholder='Введите текст' minLength="1" maxLength="1000" required onChange={(e) => setCommentText(e.target.value)}></textarea>
                <button className='task-modal__comment-add' disabled={isFormValid ? false : true} onClick={(e) => createComment(comment, e)}>✓</button>
                <button className='task-modal__comment-add' onClick={() => setIsReplyOpen(false)}>X</button>
            </form> : <button className="task-modal__comment-reply" onClick={() => setIsReplyOpen(true)}><span className="task-modal__comment-reply-span">Ответить</span></button>}
            {comment.comments && (
                <div className="task-modal__comment-replies">
                    {comment.comments.map((reply) => (
                        <Comment key={reply.id} comment={reply} comments={comments} updateLocalStorageAndState={updateLocalStorageAndState} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comment;