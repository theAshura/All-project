import { createContext } from 'react';

interface Props {
  isEditVessel: boolean;
}

export const VesselScreeningContext = createContext<Props | undefined>(
  undefined,
);

const VesselScreeningProvider = ({ children, isEditVessel }) => {
  const contextValue = {
    isEditVessel,
  };
  return (
    <VesselScreeningContext.Provider value={contextValue}>
      {children}
    </VesselScreeningContext.Provider>
  );
};

export default VesselScreeningProvider;
