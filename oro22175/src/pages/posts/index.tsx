/* PAGE: POST_LIST
   ========================================================================== */

import { TStore, actions, useDispatch, useSelector } from "store";
import { useEffect, useMemo } from "react";
import classes from "./posts.module.scss";
import { NavLink } from "react-router-dom";

const Posts = () => {
  const posts = useSelector((state: TStore) => state.postList.data);
  // const newPosts = useSelector((state: TStore) => state.postList.newData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.postList.fetchList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(actions.postList.fetchListData());
  }, [dispatch]);

  const renderPosts = useMemo(() => {
    return posts?.map((post) => {
      return (
        <NavLink key={post.id} to={`/posts/${post.id}`}>
          Post: {post.name}
        </NavLink>
      );
    });
  }, [posts]);

  return (
    <div>
      <div>{renderPosts}</div>
      <div className={classes.aaaaaaaaa}>213</div>
    </div>
  );
};

export default Posts;
