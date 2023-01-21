type LogoutFunction = () => void;
type LoginFunction = (token: string) => void;

interface TokenManager {
  token: string;
  login?: LoginFunction;
  logout: Array<LogoutFunction>;
  setToken: (token: string) => void;
  setLoginMethod: (login: LoginFunction) => void;
  setLogoutMethod: (logout: LogoutFunction) => void;
  doLogout: () => void;
}

const tokenManager: TokenManager = {
  token: '',
  login: undefined,
  logout: [],

  setToken(t: string) {
    this.token = t;
    this.login?.(t);
  },

  setLoginMethod(m) {
    this.login = m;
  },

  setLogoutMethod(m) {
    this.logout = [m];
  },

  doLogout() {
    this.token = '';
    this.logout.forEach((i: LogoutFunction) => i());
  },
};

export default tokenManager;
