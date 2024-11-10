import deepEqual from "deep-equal";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { selectors as draftSelector } from "@/redux/slices/draft";
import useQuillContentChange from "./useQuillContentChange";

const useQuillValueIsChange = (quill) => {
  const changingDelta = useQuillContentChange(quill);
  const [change, setChange] = useState(false);
  const [editorDelta, setEditorDelta] = useState([]);
  const {
    item: { blogPost = [{ insert: "\n" }] },
  } = useSelector(draftSelector.getDraftBlogs());

  useEffect(() => {
    if (quill) {
      const delta = quill.getContents().ops;
      setEditorDelta(delta);
    }
  }, [quill]);

  useEffect(() => {
    setEditorDelta(changingDelta);
  }, [changingDelta]);

  useEffect(() => {
    const formattedBlogPost = Array.isArray(blogPost)
      ? blogPost
      : JSON.parse(blogPost);
    const isEqual = deepEqual(editorDelta, formattedBlogPost);
    setChange(!isEqual);
  }, [blogPost, editorDelta]);

  return { isEditorChange: change };
};

export default useQuillValueIsChange;
