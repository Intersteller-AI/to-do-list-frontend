// @ts-nocheck
import { useState } from "react";

import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { HOST } from "@/utils/server";

const createNewComment = async ({ desc, _id, parent, replyOnUser }) => {
  try {
    // const { data } = await axios.post(
    //   `${HOST}/api/comments`,
    //   {
    //     desc,
    //     slug,
    //     parent,
    //     replyOnUser,
    //   },
    //   { withCredentials: true }
    // );

    const res = await fetch(`${HOST}/api/comments`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        desc,
        _id,
        parent,
        replyOnUser,
      }),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

const updateComment = async ({ desc, commentId }) => {
  try {
    const res = await fetch(`${HOST}/api/comments/${commentId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        desc,
      }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

const deleteComment = async ({ commentId }) => {
  try {
    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    //   withCredentials: true,
    // };

    // const { data } = await axios.delete(
    //   `${HOST}/api/comments/${commentId}`,
    //   config
    // );

    const res = await fetch(`${HOST}/api/comments/${commentId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

const CommentsContainer = ({
  className,
  logginedUserId,
  comments,
  taskId,
  postUserId,
  refetch,
}) => {
  const [affectedComment, setAffectedComment] = useState(null);

  const { mutate: mutateNewComment, isLoading: isLoadingNewComment } =
    useMutation({
      mutationFn: ({ desc, _id, parent, replyOnUser }) => {
        return createNewComment({ desc, _id, parent, replyOnUser });
      },
      onSuccess: () => {
        toast.success("Your comment is sent successfully");
        refetch();
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const { mutate: mutateUpdateComment } = useMutation({
    mutationFn: ({ desc, commentId }) => {
      return updateComment({ desc, commentId });
    },
    onSuccess: () => {
      toast.success("Your comment is updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const { mutate: mutateDeleteComment } = useMutation({
    mutationFn: ({ commentId }) => {
      return deleteComment({ commentId });
    },
    onSuccess: () => {
      toast.success("Your comment is deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const addCommentHandler = (value, parent = null, replyOnUser = null) => {
    mutateNewComment({
      desc: value,
      parent,
      replyOnUser,
      _id: taskId,
    });
    setAffectedComment(null);
  };

  const updateCommentHandler = (value, commentId) => {
    mutateUpdateComment({
      desc: value,
      commentId,
    });
    setAffectedComment(null);
  };

  const deleteCommentHandler = (commentId) => {
    mutateDeleteComment({ commentId });
  };

  return (
    <div className={`${className}`}>
      {logginedUserId && (
        <CommentForm
          btnLabel="Send"
          formSubmitHanlder={(value) => addCommentHandler(value)}
          loading={isLoadingNewComment}
        />
      )}
      <div className="mt-8 space-y-4">
        {comments
          ?.map((comment) => (
            <Comment
              postUserId={postUserId}
              key={comment._id}
              comment={comment}
              logginedUserId={logginedUserId}
              affectedComment={affectedComment}
              setAffectedComment={setAffectedComment}
              addComment={addCommentHandler}
              updateComment={updateCommentHandler}
              deleteComment={deleteCommentHandler}
              replies={comment.replies}
            />
          ))
          ?.reverse()}
      </div>
    </div>
  );
};

export default CommentsContainer;
