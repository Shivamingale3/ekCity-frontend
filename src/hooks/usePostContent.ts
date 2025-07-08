import { useState, useEffect } from "react";
import { getFormattedText } from "../utils/universalFunctions";

export const usePostContent = (content: string, wordLimit: number = 100) => {
  const [expanded, setExpanded] = useState(false);
  const [displayContent, setDisplayContent] = useState("");

  const shouldTruncate = content.split(" ").length > wordLimit;

  useEffect(() => {
    if (shouldTruncate) {
      setDisplayContent(
        expanded ? content : getFormattedText({ text: content, limit: 250 })
      );
    } else {
      setDisplayContent(content);
    }
  }, [content, expanded, shouldTruncate]);

  return {
    displayContent,
    expanded,
    setExpanded,
    shouldTruncate,
  };
};
