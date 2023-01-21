import { useCallback, useMemo } from 'react';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { DATA_SPACE } from 'constants/components/ag-grid.const';
import NoDataImg from 'components/common/no-data/NoData';
import TableCp from 'components/common/table/TableCp';
import { RowComponentWithoutAction } from 'components/common/table/row/rowWithoutAction';

interface TablePastCommentsProps {
  data: any[];
  loading: boolean;
  className?: string;
}

const TablePastComments = ({
  data,
  loading,
  className,
}: TablePastCommentsProps) => {
  const { t } = useTranslation(I18nNamespace.SELF_ASSESSMENT);

  const rowLabels = useMemo(
    () => [
      {
        id: 'standard',
        label: t('table.standard'),
        sort: false,
        width: '100',
      },
      {
        id: 'element',
        label: t('table.element'),
        sort: false,
        width: '175',
      },
      {
        id: 'stage',
        label: t('table.stage'),
        sort: false,
        width: '175',
      },
      {
        id: 'questionNo',
        label: t('table.questionNo'),
        sort: false,
        width: '175',
      },
      {
        id: 'companyComments',
        label: t('table.companyComments'),
        sort: false,
      },
    ],
    [t],
  );

  const sanitizeData = (item) => {
    const finalData = {
      id: item.id,
      standard:
        item?.selfDeclaration?.elementMaster?.standardMaster?.code ||
        DATA_SPACE,
      element: item?.selfDeclaration?.elementMaster?.name || DATA_SPACE,
      stage: item?.selfDeclaration?.elementMaster?.stage || DATA_SPACE,
      questionNo:
        item?.selfDeclaration?.elementMaster?.questionNumber || DATA_SPACE,
      companyComments: item?.comment || DATA_SPACE,
    };
    return finalData;
  };

  const renderRow = useCallback(() => {
    if (loading || !data?.length) {
      return null;
    }
    return (
      <tbody>
        {data?.map((item) => {
          const finalData = sanitizeData(item);
          return (
            <RowComponentWithoutAction
              key={item?.id}
              isScrollable
              data={finalData}
            />
          );
        })}
      </tbody>
    );
  }, [loading, data]);

  return (
    <div className={cx(className)}>
      {!loading && (!data || data?.length === 0) ? (
        <NoDataImg />
      ) : (
        <TableCp
          isHiddenAction
          rowLabels={rowLabels}
          renderRow={renderRow}
          loading={loading}
          scrollVertical
          isEmpty={undefined}
        />
      )}
    </div>
  );
};

export default TablePastComments;
