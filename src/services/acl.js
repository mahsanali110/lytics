import { VALID_ROUTES_BY_ROLE } from 'constants/config';

class AclService {
  constructor(role, userAccess = false) {
    this.role = role;
    this.userAccess = userAccess ? userAccess : VALID_ROUTES_BY_ROLE[this.role];
  }

  get redirectUrl() {
    return this.userAccess?.redirectUrl ?? '/not-found';
  }

  get landingPage() {
    return this.userAccess?.landingPage ?? '/not-found';
  }

  hasPermission(path) {
    return this.userAccess?.paths.includes(path);
  }
}

export default AclService;
