import { useEffect } from 'react';

const DetectEsc = ({ close }) => {
  useEffect(() => {
    const handleClose = (e) => {
      if (e.keyCode === 27) {
        if (close) {
          close();
        }
      }
    };
    window.addEventListener('keydown', handleClose);
    return () => window.removeEventListener('keydown', handleClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

export default DetectEsc;
