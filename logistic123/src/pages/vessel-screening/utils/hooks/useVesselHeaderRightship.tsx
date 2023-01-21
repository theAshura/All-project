import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import MetadataRightship from 'components/common/metadata/metadataRightship';

const useVesselHeaderRightShip = (
  className?: string,
  withRequestNo = false,
) => {
  const { vesselDetail } = useSelector((state) => state.vessel);
  const { vesselScreeningDetail } = useSelector(
    (state) => state.vesselScreening,
  );
  const metadata = useMemo(
    () => [
      <p key={vesselDetail?.name}>
        <span style={{ color: '#615E69' }}>Vessel :</span>{' '}
        {vesselDetail?.name || '-'}
      </p>,
      <p key={vesselDetail?.imoNumber}>
        <span style={{ color: '#615E69' }}>IMO:</span>{' '}
        {vesselDetail?.imoNumber || '-'}
      </p>,
      <p key={vesselDetail?.vesselType?.name}>
        <span style={{ color: '#615E69' }}>Vessel type:</span>{' '}
        {vesselDetail?.vesselType?.name || '-'}
      </p>,
      <p key={vesselDetail?.company?.name}>
        <span style={{ color: '#615E69' }}>Company:</span>{' '}
        {vesselDetail?.company?.name || '-'}
      </p>,
    ],
    [
      vesselDetail?.company?.name,
      vesselDetail?.imoNumber,
      vesselDetail?.name,
      vesselDetail?.vesselType?.name,
    ],
  );

  return (
    <MetadataRightship
      data={metadata}
      className={className}
      requestNo={withRequestNo ? vesselScreeningDetail?.requestNo : null}
    />
  );
};

export default useVesselHeaderRightShip;
