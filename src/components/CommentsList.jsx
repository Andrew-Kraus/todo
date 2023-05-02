import React from 'react';
import Comment from './Comment';


const CommentList = (props) => {
    const {
        comments,
      } = props;
    return (
        <div className="task-modal__comment-list">
            {comments.map((comment, index) => (
                <Comment key={index} comment={comment} comments={comments} />
            ))}
        </div>
    );
};

export default CommentList;