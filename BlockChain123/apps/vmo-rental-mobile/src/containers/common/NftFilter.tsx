import Images from '@images';
import { Colors } from '@namo-workspace/themes';
import Button from '@namo-workspace/ui/Button';
import InputField from '@namo-workspace/ui/form/InputField';
import { Body2, Body3 } from '@namo-workspace/ui/Typography';
import View from '@namo-workspace/ui/view/View';
import { Formik } from 'formik';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import priceSchema from '@namo-workspace/yupSchema/priceSchema';
import styled, { css } from 'styled-components/native';

const { IcFilter } = Images;
export interface ParamsFilter {
  status?: string;
  isVisible?: boolean;
  price?: string;
  updatedAt?: string;
}
export interface ValueStatus {
  label: string;
  value: string;
}

const spliceValueParam = (list: string, value: string) => {
  return list.replace(new RegExp(',?' + value + ',?'), (match) => {
    const begin_comma = match.charAt(0) === ',';
    if (begin_comma && match.charAt(match.length - 1) === ',') {
      return ',';
    }
    return '';
  });
};

interface Price {
  min: string;
  max: string;
}

interface Props {
  valueStatus?: ValueStatus[];
  showVisibility?: boolean;
  myProfile?: boolean;
  filter?: ParamsFilter;
  onSubmit: (params: ParamsFilter) => void;
  onReset?: () => void;
  hidden?: boolean;
  sortOnly?: boolean;
  myGallery?: boolean;
  initialValue?: Price;
}

const valueStatusDefault = [
  { label: 'For rent', value: 'FORRENT' },
  { label: 'Rented', value: 'RENTED' },
  { label: 'Ordered', value: 'ORDERED' },
  { label: 'Unavailable', value: 'UNAVAILABLE' },
];

const NftFilter = ({
  onSubmit,
  onReset,
  valueStatus,
  showVisibility,
  hidden,
  sortOnly,
  myGallery,
  initialValue,
}: Props) => {
  const filterOptions = useMemo(() => {
    const filter = [
      {
        title: 'Status',
        name: 'status',
        isMulti: true,
        values: valueStatus ? [...valueStatus] : valueStatusDefault,
      },
      {
        title: 'Visibility',
        name: 'isVisible',
        values: showVisibility
          ? [
              { label: 'Visible', value: true },
              { label: 'Invisible', value: false },
            ]
          : [],
      },
      {
        title: 'Sort',
        name: 'price',
        values: [
          { label: 'Price: Highest to lowest', value: 'DESC PRICE' },
          { label: 'Price: Lowest to highest', value: 'ASC PRICE' },
          {
            label: 'Date: Newest to oldest',
            value: 'DESC DATE',
          },
          {
            label: 'Date: Oldest to newest',
            value: 'ASC DATE',
          },
        ],
      },
    ];

    if (sortOnly) {
      return filter.slice(-1);
    }
    if (myGallery) {
      return [...filter.slice(1, 2), ...filter.slice(-1)];
    }
    return filter;
  }, [valueStatus, showVisibility, sortOnly, myGallery]);

  const [selected, setSelected] = useState<ParamsFilter>({});
  const actionSheetRef = useRef<ActionSheet>();

  const handleSelectFilter = useCallback(
    (property: string, value: string, isMulti?: boolean) => {
      const selectedTemp = { ...selected };
      if (
        isMulti &&
        selectedTemp[property] &&
        !selectedTemp[property]?.includes(value)
      ) {
        selectedTemp[property] += `,${value}`;
      } else if (
        isMulti &&
        selectedTemp[property] &&
        selectedTemp[property]?.includes(value)
      ) {
        const newSelected = spliceValueParam(selectedTemp[property], value);
        selectedTemp[property] = newSelected;
      } else {
        selectedTemp[property] = value;
      }
      setSelected({ ...selectedTemp });
    },
    [selected]
  );

  const handleResetFilter = useCallback(() => {
    setSelected({});
  }, []);

  const handleClose = useCallback(() => {
    actionSheetRef?.current?.hide();
  }, [actionSheetRef]);

  const handleApplyFilter = useCallback(() => {
    if (Object.keys(selected).length === 0) {
      onReset?.();
      handleClose();
      return;
    }
    const submitValue = {
      ...selected,
      status: selected.status || undefined,
      updatedAt: selected.updatedAt || 'DESC',
    };
    onSubmit(submitValue);
    handleClose();
  }, [selected, onSubmit, handleClose, onReset]);

  const handleToggleFilter = useCallback(() => {
    actionSheetRef?.current?.show();
  }, [actionSheetRef]);

  const renderMulti = useMemo(() => {
    return filterOptions.slice(0, 1).map((item, index) => {
      return item.values.length ? (
        <ItemFilter
          key={index}
          style={filterOptions.length - 1 === index && styles.border_none}
        >
          <ItemTitle fontWeight="700">{item.title}</ItemTitle>
          <ItemActions>
            {item.values.map((ele, i) => {
              return (
                <View flexRow alignCenter mt={2} key={i}>
                  <CheckboxSquare
                    isSelect={selected[item.name]
                      ?.toString()
                      ?.includes(ele.value?.toString())}
                    onPress={() =>
                      handleSelectFilter(item.name, ele.value, item.isMulti)
                    }
                  />
                  <ItemText>{ele.label}</ItemText>
                </View>
              );
            })}
          </ItemActions>
        </ItemFilter>
      ) : null;
    });
  }, [filterOptions, handleSelectFilter, selected]);

  const renderSingle = useMemo(() => {
    return filterOptions.slice(-1).map((item, index) => {
      return item.values.length ? (
        <ItemFilter
          key={index}
          style={filterOptions.length - 1 === index && styles.border_none}
        >
          <ItemTitle fontWeight="700">{item.title}</ItemTitle>
          <ItemActions>
            {item.values.map((ele, i) => {
              return (
                <View flexRow alignCenter mt={2} key={i}>
                  <CheckboxCircle
                    isSelect={selected[item.name]
                      ?.toString()
                      ?.includes(ele.value?.toString())}
                    onPress={() =>
                      handleSelectFilter(item.name, ele.value, item.isMulti)
                    }
                  />
                  <ItemText>{ele.label}</ItemText>
                </View>
              );
            })}
          </ItemActions>
        </ItemFilter>
      ) : null;
    });
  }, [filterOptions, handleSelectFilter, selected]);

  return (
    <Container hidden={hidden}>
      <FilterButton onPress={handleToggleFilter}>
        <IcFilter />
        <FilterText fontWeight="600">Filter</FilterText>
      </FilterButton>
      <ActionSheet ref={actionSheetRef} onClose={handleClose} gestureEnabled>
        <FilterTitle fontWeight="600">Filter</FilterTitle>
        {renderMulti}
        <Formik
          initialValues={initialValue}
          validationSchema={priceSchema}
          validateOnBlur={true}
          onSubmit={() => console.log('A')}
        >
          {({ values, dirty }) => (
            <>
              <View flexRow pa={4} alignCenter>
                <Body2 fontWeight="800" color={Colors.foreground} pr={4} mx={1}>
                  USD
                </Body2>
                <InputField
                  name="min"
                  placeholder="Min"
                  inputStyle={{ textAlign: 'center' }}
                  style={{ flex: 1, fontSize: 11 }}
                />
                <Body2 fontWeight="800" color={Colors.foreground} mx={1}>
                  to
                </Body2>
                <InputField
                  name="max"
                  placeholder="Max"
                  inputStyle={{ textAlign: 'center' }}
                  style={{ flex: 1 }}
                />
              </View>
              {renderSingle}
              <GroupAction>
                <Button
                  size="medium"
                  style={styles.btn_edit}
                  color="white"
                  onPress={handleResetFilter}
                >
                  Reset
                </Button>
                <Button
                  size="medium"
                  style={styles.btn_edit}
                  onPress={handleApplyFilter}
                >
                  Apply
                </Button>
              </GroupAction>
            </>
          )}
        </Formik>
      </ActionSheet>
    </Container>
  );
};

export default NftFilter;

export const styles = StyleSheet.create({
  border_none: {
    borderBottomWidth: 0,
  },
  btn_edit: {
    width: '48%',
  },
});

const Container = styled.View`
  width: 90px;
  position: absolute;
  bottom: 8px;
  right: 8px;

  ${(props) =>
    props.hidden &&
    css`
      opacity: 0;
      height: 0;
    `};
`;

const FilterButton = styled.TouchableOpacity`
  background-color: ${Colors.primaryOrange};
  flex-direction: row;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
`;

const FilterText = styled(Body3)`
  color: ${Colors.white};
  margin-left: 5px;
`;

const FilterTitle = styled(Body2)`
  color: ${Colors.textLevel1};
  text-align: center;
  margin: 8px 16px;
`;

const ItemFilter = styled.View`
  padding: 16px;
`;

const ItemTitle = styled(Body3)`
  color: ${Colors.textLevel1};
`;

const ItemActions = styled.View``;

const CheckboxSquare = styled.TouchableOpacity<{ isSelect: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 5px;

  ${({ isSelect }) => {
    if (isSelect) {
      return css`
        background-color: ${Colors.secondary};
        border: 1px solid ${Colors.primaryOrange};
      `;
    } else {
      return css`
        background-color: ${Colors.background2};
        border: 1px solid ${Colors.strokeLevel3};
      `;
    }
  }};
`;
const CheckboxCircle = styled.TouchableOpacity<{ isSelect: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;

  ${({ isSelect }) => {
    if (isSelect) {
      return css`
        background-color: ${Colors.secondary};
        border: 1px solid ${Colors.primaryOrange};
      `;
    } else {
      return css`
        background-color: ${Colors.background2};
        border: 1px solid ${Colors.strokeLevel3};
      `;
    }
  }};
`;

const ItemText = styled(Body3)`
  color: ${Colors.textLevel2};
  margin-left: 6px;
`;

const GroupAction = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 24px 16px;
`;
