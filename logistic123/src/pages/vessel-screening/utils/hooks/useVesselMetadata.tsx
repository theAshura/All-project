import { useSelector } from 'react-redux';
import Metadata from 'components/common/metadata/metadata';
import { useMemo } from 'react';
import { convertToAgeDecimal } from 'helpers/utils.helper';

const useVesselMetadata = (className?: string, withRequestNo = false) => {
  const { vesselDetail } = useSelector((state) => state.vessel);
  const { vesselScreeningDetail } = useSelector(
    (state) => state.vesselScreening,
  );

  const metadata = useMemo(() => {
    const ageDecimal = vesselDetail?.buildDate
      ? convertToAgeDecimal(vesselDetail?.buildDate)
      : '-';
    return [
      `${vesselDetail?.name || '-'} (${vesselDetail?.imoNumber || '-'})`,
      vesselDetail?.classificationSociety?.code || '-',
      vesselDetail?.countryFlag || '-',
      `${'Age:'}${' '}${ageDecimal}${' '}${'yrs'}`,
      vesselDetail?.vesselDocHolders
        ?.filter((item) => item?.status === 'active')
        ?.map((item) => item?.company?.name || '-')
        ?.join(', ') || '-',
    ];
  }, [vesselDetail]);

  return (
    <Metadata
      data={metadata}
      className={className}
      requestNo={withRequestNo ? vesselScreeningDetail?.requestNo : null}
    />
  );
};

export default useVesselMetadata;
