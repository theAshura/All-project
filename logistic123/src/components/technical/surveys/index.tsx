import Container from 'components/common/container/ContainerPage';
import SurveyClassInfo from './survey-class-info/SurveyClassInfo';
import TableConditionOfClass from './condition-of-class/TableConditionOfClass';

const SurveysListContainer = () => (
  <div>
    <Container className="pt-2">
      <TableConditionOfClass />
      <SurveyClassInfo />
    </Container>
  </div>
);
export default SurveysListContainer;
