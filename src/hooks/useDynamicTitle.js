import { useEffect } from 'react'

export const useDynamicTitle = (title, defaultTitle = "Purity Plants") => {
  useEffect(() => {
    document.title = title;

    return() => {
      document.title = defaultTitle;
    }
  }, [title, defaultTitle]);
}
 