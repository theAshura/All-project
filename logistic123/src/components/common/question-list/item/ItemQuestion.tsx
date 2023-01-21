import { useEffect, useMemo, useState, useCallback } from 'react';
import Tooltip from 'antd/lib/tooltip';
import images from 'assets/images/images';
import cx from 'classnames';
import { Question } from 'models/store/audit-checklist/audit-checklist.model';
import Dropdown, { MenuOption } from 'components/ui/drop-down/Dropdowns';
import { MasterDataId } from 'constants/common.const';
import { OverflowList } from 'react-overflow-list';
import { ACDataPackage } from 'components/audit-checklist/common/form-helper/useFormHelper';
import { getQuestionReferencesDetailApi } from 'api/audit-checklist.api';

import style from './itemQuestion.module.scss';

export const ReferencesCategoryList = [
  {
    name: MasterDataId.TOPIC_ID,
    title: 'Topic',
    iconInActive: images.icons.master.icMasterTopicInActive,
    icActive: images.icons.master.icMasterTopicActive,
  },
  {
    name: 'hint',
    title: 'Hint',
    iconInActive: images.icons.master.icMasterHintInActive,
    icActive: images.icons.master.icMasterHintActive,
  },

  // General Information
  {
    name: MasterDataId.LOCATION,
    title: 'Location',
    iconInActive: images.icons.master.icMasterLocationInActive,
    icActive: images.icons.master.icMasterLocationActive,
  },
  {
    name: MasterDataId.VESSEL_TYPE,
    title: 'Vessel type',
    iconInActive: images.icons.master.icMasterVesselTypeInActive,
    icActive: images.icons.master.icMasterVesselTypeActive,
  },
  {
    name: MasterDataId.DEPARTMENT,
    title: 'Department',
    iconInActive: images.icons.master.icMasterShipDepartmentInActive,
    icActive: images.icons.master.icMasterShipDepartmentActive,
  },

  // Reference
  {
    name: MasterDataId.CDI,
    title: 'CDI',
    iconInActive: images.icons.master.icMasterCDIInActive,
    icActive: images.icons.master.icMasterCDIActive,
  },
  {
    name: MasterDataId.CHARTER_OWNER,
    title: 'Charter/Owner',
    iconInActive: images.icons.master.icMasterCharterInActive,
    icActive: images.icons.master.icMasterCharterActive,
  },
  {
    name: MasterDataId.VIQ,
    title: 'VIQ',
    iconInActive: images.icons.master.icMasterVIQInActive,
    icActive: images.icons.master.icMasterVIQActive,
  },

  // Category
  {
    name: MasterDataId.MAIN_CATEGORY,
    title: 'Main Category',
    iconInActive: images.icons.master.icMasterCategoryInActive,
    icActive: images.icons.master.icMasterCategoryActive,
  },
  {
    name: MasterDataId.THIRD_CATEGORY,
    title: 'Third Category',
    iconInActive: images.icons.master.icMasterCategoryInActive,
    icActive: images.icons.master.icMasterCategoryActive,
  },
  {
    name: MasterDataId.SECOND_CATEGORY,
    title: 'Second Category',
    iconInActive: images.icons.master.icMasterCategoryInActive,
    icActive: images.icons.master.icMasterCategoryActive,
  },

  // Information
  {
    name: MasterDataId.SHIP_DEPARTMENT,
    title: 'Ship department',
    iconInActive: images.icons.master.icMasterShipDepartmentInActive,
    icActive: images.icons.master.icMasterShipDepartmentActive,
  },
  {
    name: MasterDataId.SHIP_RANK,
    title: 'Ship Ranks',
    iconInActive: images.icons.master.icMasterShipRankInActive,
    icActive: images.icons.master.icMasterShipRankActive,
  },
  {
    name: MasterDataId.SHORE_DEPARTMENT,
    title: 'Shore Department',
    iconInActive: images.icons.master.icMasterShoreDepartmentInActive,
    icActive: images.icons.master.icMasterShoreDepartmentActive,
  },
  {
    name: MasterDataId.SHORE_RANK,
    title: 'Shore Rank',
    iconInActive: images.icons.master.icMasterShoreRankInActive,
    icActive: images.icons.master.icMasterShoreRankActive,
  },

  // {
  //   name: MasterDataId.CRITICALITY,
  // title: '',
  //   iconInActive: images.icons.icEllipse,
  //   icActive: images.icons.icEllipse,
  // },

  // {
  //   name: MasterDataId.POTENTIAL_RISK,
  // title: '',
  //   iconInActive: images.icons.icWorkBlue,
  //   icActive: images.icons.icWorkBlue,
  // },
  // {
  //   name: MasterDataId.SDR,
  // title: '',
  //   iconInActive: images.icons.icSwitchCross,
  //   icActive: images.icons.icSwitchCross,
  // },

  // {
  //   name: MasterDataId.SMS,
  // title: '',
  //   iconInActive: images.icons.icRecall,
  //   icActive: images.icons.icRecall,
  // },
];

interface Props {
  title: string;
  id: string;
  description: string;
  disabled?: boolean;
  isRequired?: boolean;
  expand?: boolean;
  dataQuestion?: Question;
  dataPackage?: ACDataPackage;
  iconActives?: string[];
  onViewMore?: (
    data?: {
      name: string;
      value: string;
    }[],
  ) => void;
  referencesCategoryData?: string[];
  isFocused?: boolean;
  handleClick?: (() => void) | null;
  handleEdit?: (() => void) | null;
  handleDuplicate?: (() => void) | null;
  handleDelete?: (() => void) | null;
}
export default function ItemQuestion(props: Props) {
  const {
    title,
    dataQuestion,
    dataPackage,
    expand,
    description,
    isRequired,
    isFocused,
    onViewMore,
    handleClick = undefined,
    handleEdit,
    handleDuplicate,
    iconActives,
    handleDelete,
    disabled,
  } = props;
  const [masterDetail, setMasterDetail] = useState<
    {
      name: string;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    if (dataQuestion?.auditChecklistId && dataQuestion?.id && expand) {
      getQuestionReferencesDetailApi({
        idAuditChecklist: dataQuestion?.auditChecklistId,
        idQuestion: dataQuestion?.id,
      }).then((res) => {
        const { data } = res;
        const topicList = dataPackage?.topic || [];
        const topicItem = topicList?.find(
          (item) => item.value === dataQuestion?.topicId,
        );

        const result = [
          {
            name: MasterDataId.MAIN_CATEGORY,
            value: data?.main_category,
          },
          {
            name: 'hint',
            value: dataQuestion?.hint,
          },
          { name: MasterDataId.LOCATION, value: data?.location },
          { name: MasterDataId.TOPIC_ID, value: topicItem?.label },
          {
            name: MasterDataId.VESSEL_TYPE,
            value: data?.vessel_type,
          },
          { name: MasterDataId.VIQ, value: data?.viq },
          { name: MasterDataId.SHIP_RANK, value: data?.ship_rank },
          {
            name: MasterDataId.SECOND_CATEGORY,
            value: data?.second_category,
          },
          {
            name: MasterDataId.THIRD_CATEGORY,
            value: data?.third_category,
          },
          {
            name: MasterDataId.SHIP_DEPARTMENT,
            value: data?.ship_department,
          },
          { name: MasterDataId.SHORE_RANK, value: data?.shore_rank },
          {
            name: MasterDataId.SHORE_DEPARTMENT,
            value: data?.shore_department,
          },
          {
            name: MasterDataId.DEPARTMENT,
            value: data?.department,
          },
          {
            name: MasterDataId.CHARTER_OWNER,
            value: data?.charter_owner,
          },
          { name: MasterDataId.CDI, value: data?.cdi },
        ];

        setMasterDetail(result?.filter((item) => item.value));
      });
    }
  }, [dataQuestion, dataPackage, expand]);

  const menuOptions = useMemo<MenuOption[]>(() => {
    let newMenuOptions: MenuOption[] = [
      {
        label: 'Duplicate',
        onClick: handleDuplicate,
      },
    ];

    if (handleEdit) {
      newMenuOptions = [
        ...newMenuOptions,
        {
          label: 'Edit',
          onClick: handleEdit,
        },
      ];
    }
    if (handleDelete) {
      newMenuOptions = [
        ...newMenuOptions,
        {
          label: 'Delete',
          onClick: handleDelete,
        },
      ];
    }
    return newMenuOptions;
  }, [handleDelete, handleEdit, handleDuplicate]);

  const listIcons = useMemo(
    () =>
      iconActives?.filter((item) => {
        const findingItem = masterDetail?.find((i) => i.name === item);
        return findingItem;
      }),
    [iconActives, masterDetail],
  );

  const populateData = useCallback((value) => {
    if (value?.location) {
      return value?.location;
    }
    if (value?.acronym) {
      return value?.acronym;
    }
    return value;
  }, []);

  const ItemRenderer = (item, index) => {
    const findingItem = masterDetail?.find((i) => i.name === item);
    const findingMasterType = ReferencesCategoryList?.find(
      (i) => i.name === item,
    );
    const findingValue = populateData(findingItem?.value);
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className={cx(style.infoMaster, ' me-1 px-2 py-1')}
      >
        <Tooltip
          placement="bottomLeft"
          title={findingMasterType?.title}
          color="#3B9FF3"
        >
          <img src={findingMasterType?.icActive} alt="icon_master-data" />
        </Tooltip>
        <Tooltip placement="bottomLeft" title={findingValue} color="#3B9FF3">
          <span className={cx(style.text, style.content, 'ms-1')}>
            {findingValue?.length <= 43
              ? findingValue
              : `${findingValue?.slice(0, 40)}...`}
          </span>
        </Tooltip>
      </div>
    );
  };

  const overflowRenderer = (items) => {
    const { length } = items;
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onViewMore(masterDetail);
        }}
        className={cx(style.moreData, 'me-1 px-2 py-1')}
      >
        +{length}
      </div>
    );
  };

  return (
    <div
      className={cx('py-2', style.itemQuestion, {
        [style.focused]: isFocused,
      })}
      onClick={handleClick}
    >
      <div className={style.title}>
        <div className="d-flex align-items-start ">
          <div className={cx('fw-bold limit-line-text', style.textTitle)}>
            {title}
            {isRequired && (
              <img
                className={style.required}
                src={images.icons.icRequiredAsterisk}
                alt="required"
              />
            )}
            {expand ? `: ${description}` : ''}
          </div>
        </div>

        {!disabled && (
          <div className={cx('ps-2 ', style.actions)}>
            <Dropdown menuOptions={menuOptions}>
              <img
                src={images.icons.icOption}
                alt="more"
                className={style.moreAction}
              />
            </Dropdown>
          </div>
        )}
      </div>
      {expand && (
        <div className={cx('d-flex align-items-center', style.text)}>
          {dataQuestion?.companyMixCode}{' '}
          <span className={cx(style.stick, 'mx-1')} />
          {dataQuestion?.vesselTypeMixCode}
        </div>
      )}

      {expand && masterDetail?.length > 0 && listIcons?.length > 0 && (
        <div className={cx('inline-block py-1', style.wrapperInfo)}>
          <div className={cx({ 'mt-1': listIcons?.length }, 'd-flex')}>
            <OverflowList
              collapseFrom="end"
              items={listIcons}
              itemRenderer={ItemRenderer}
              overflowRenderer={overflowRenderer}
            />
          </div>
        </div>
      )}
    </div>
  );
}
