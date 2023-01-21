import SelectUI from 'components/ui/select/Select';
import { TIME_TRENDS_SELECT } from 'constants/dashboard.constant';
import { Dispatch, FC, SetStateAction } from 'react';
import styles from './score-date-filter.module.scss';

interface ScoreDateFilterProps {
  images: {
    link: string;
    bgColor: string;
  };
  content: {
    totalPoint: string | number;
    body: string;
    titleColor: string;
  };
  value: string;
  setValueFilter: Dispatch<SetStateAction<string>>;
}

const ScoreDateFilter: FC<ScoreDateFilterProps> = ({
  content,
  images,
  value,
  setValueFilter,
}) => (
  <div className={styles.container}>
    <div className={styles.imgContainer}>
      <div style={{ backgroundColor: images.bgColor }}>
        <img alt={images.link} src={images.link} />
      </div>
    </div>
    <div className={styles.contentContainer}>
      <div>
        <span style={{ color: content.titleColor }} className={styles.title}>
          {content.totalPoint}
        </span>
        <div className={styles.selectContainer}>
          <SelectUI
            data={TIME_TRENDS_SELECT}
            defaultValue={value}
            value={value}
            onChange={(currentValue) => setValueFilter(String(currentValue))}
            notAllowSortData
          />
        </div>
      </div>
      <p>{content.body}</p>
    </div>
  </div>
);

export default ScoreDateFilter;
