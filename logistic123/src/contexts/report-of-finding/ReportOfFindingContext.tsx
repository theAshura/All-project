import { createContext, useState, Dispatch, SetStateAction } from 'react';

interface ReportOfFindingProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  officeComment: string;
  handleSetOfficeComment: (value: string) => void;
}

export const ReportOfFindingContext = createContext<
  ReportOfFindingProps | undefined
>(undefined);

const ReportOfFindingProvider = ({ children }) => {
  const [content, setContent] = useState('');
  const [officeComment, setOfficeComment] = useState('');

  const handleSetOfficeComment = (value: string) => {
    setOfficeComment(value);
  };

  const themeContextData = {
    content,
    setContent,
    officeComment,
    handleSetOfficeComment,
  };

  return (
    <ReportOfFindingContext.Provider value={themeContextData}>
      {children}
    </ReportOfFindingContext.Provider>
  );
};
export default ReportOfFindingProvider;
