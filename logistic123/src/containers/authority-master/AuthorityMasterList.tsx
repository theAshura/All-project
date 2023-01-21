import AuthorityMasterListContainer from 'components/authority-master/list/index';
import WrapComponentRole from 'components/wrap-component-role/WrapComponentRole';
import './authority-master.scss';

const AuthorityMasterList = () => (
  <WrapComponentRole
    componentContainer={
      <div className="authority-master">
        <AuthorityMasterListContainer />
      </div>
    }
  />
);

export default AuthorityMasterList;
