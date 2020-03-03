import { RolesBuilder} from 'nest-access-control';

export enum UserRoles {
    USERS_ADMINISTRATOR = 'USERS_ADMINISTRATOR',
    BASIC_USER = 'BASIC_USER',
  }
  
  export function loadRoles (roles: RolesBuilder) {
    roles
    .grant (UserRoles.BASIC_USER)
    .grant(UserRoles.USERS_ADMINISTRATOR) 
    .read('users') 
    .deleteAny('users')
    .createAny('users')
    .updateAny('users');
  }
  
   