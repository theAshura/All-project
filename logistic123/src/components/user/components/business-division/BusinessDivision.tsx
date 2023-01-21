import { useContext, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import Container from 'components/common/container/Container';
import { useDispatch, useSelector } from 'react-redux';
// import SelectUI from 'components/ui/select/Select';
import { StatusPage, UserContext } from 'contexts/user/UserContext';
import { CompanyLevelEnum } from 'constants/common.const';
import { getListDivisionActions } from 'pages/division/store/action';
import AsyncSelectResultForm from 'components/react-hook-form/async-select/AsyncSelectResultForm';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './business-division.module.scss';

// const APPLY_FOR_OPTIONS = [
//   {
//     label: 'All',
//     value: 'All',
//   },
//   {
//     label: 'Inspection',
//     value: 'Inspection',
//   },
//   {
//     label: 'QA',
//     value: 'QA',
//   },
// ];

const BusinessDivision = ({
  control,
  errors,
  childCompanySelected,
  dynamicLabels,
}) => {
  const { statusPage, setChildCompanySelected } = useContext(UserContext);
  const { listDivision } = useSelector((state) => state.division);
  const dispatch = useDispatch();

  useEffect(() => {
    if (childCompanySelected) {
      setChildCompanySelected(childCompanySelected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childCompanySelected, setChildCompanySelected]);
  if (
    childCompanySelected?.companyLevel === CompanyLevelEnum.EXTERNAL_COMPANY
  ) {
    return null;
  }

  return (
    <Container>
      <div>
        <div className={styles.title}>
          {renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Business division'],
          )}{' '}
        </div>
        <Row>
          {/* <Col xs={4} md={4}>
            <SelectUI
              disabled={statusPage === StatusPage.VIEW}
              name="accountInformation.applyFor"
              control={control}
              isRequired
              messageRequired={errors?.accountInformation?.applyFor?.message}
              labelSelect="Apply for"
              placeholder="Please Select"
              data={APPLY_FOR_OPTIONS}
              className="w-100"
            />
          </Col> */}

          <Col xs={4} md={4}>
            <AsyncSelectResultForm
              multiple
              disabled={statusPage === StatusPage.VIEW}
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Selected division'],
              )}
              control={control}
              name="accountInformation.divisionIds"
              isRequired={
                childCompanySelected?.companyLevel !==
                CompanyLevelEnum.EXTERNAL_COMPANY
              }
              id="divisionIds"
              titleResults={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Selected,
              )}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              textSelectAll={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Select all'],
              )}
              messageRequired={
                errors?.accountInformation?.divisionIds?.message || ''
              }
              onChangeSearch={(value: string) => {
                dispatch(
                  getListDivisionActions.request({
                    pageSize: -1,
                    isLeftMenu: false,
                    content: value || '',
                    status: 'active',
                  }),
                );
              }}
              options={
                listDivision?.data?.length
                  ? listDivision?.data?.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))
                  : []
              }
              dynamicLabels={dynamicLabels}
            />
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default BusinessDivision;
