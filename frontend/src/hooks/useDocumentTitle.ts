import { useEffect } from "react";

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const defaultTitle = "TaskManager";
    document.title = title ? `TaskManager | ${title}` : defaultTitle;

    return () => {
      document.title = defaultTitle;
    };
  }, [title]);
};
