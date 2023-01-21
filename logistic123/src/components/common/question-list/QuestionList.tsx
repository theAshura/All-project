import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import cx from 'classnames';
import images from 'assets/images/images';
import ItemQuestion from './item/ItemQuestion';
import style from './question.module.scss';

interface Props {
  listQuestion: { title: string; id: string; description: string }[];
}
export default function QuestionList(props: Props) {
  const { listQuestion } = props;
  return (
    <div className={style.questionList}>
      <div className={style.title}>
        <div className={style.textTitle}>
          <span>Question List</span>
        </div>
        <div className={style.wrapButton}>
          <Button
            buttonType={ButtonType.Primary}
            buttonSize={ButtonSize.XSmall}
          >
            <img src={cx(images.icons.icPlusCircle)} alt="result" />
          </Button>
        </div>
      </div>
      <hr />

      <div className={style.listItems}>
        {listQuestion.map((item) => (
          <>
            <ItemQuestion
              id={item.id}
              description={item.description}
              title={item.title}
            />
            <hr />
          </>
        ))}
      </div>
    </div>
  );
}
