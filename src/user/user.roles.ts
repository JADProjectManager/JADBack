import { RolesBuilder} from 'nest-access-control';

export enum UserRoles {
    USERS_ADMINISTRATOR = 'USERS_ADMINISTRATOR',
    BASIC_USER = 'BASIC_USER',
  }
  
  export const roles: RolesBuilder = new RolesBuilder();
  
  roles
    .grant (UserRoles.BASIC_USER)
    .grant(UserRoles.USERS_ADMINISTRATOR) 
    .createAny('users') 
    .deleteAny('users')
    .createAny('users')
    .updateAny('users');
   