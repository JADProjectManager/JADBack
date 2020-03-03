import { RolesBuilder, AccessControlModule} from 'nest-access-control';

export enum GroupRoles {
  GROUP_ADMIN = 'GROUP_ADMIN',
};
  
  //export const roles: RolesBuilder = AccessControlModule.  new RolesBuilder();
  
  export function loadRoles (roles: RolesBuilder): RolesBuilder {

    roles
    .grant (GroupRoles.GROUP_ADMIN)
    .readAny ('group')
    .createAny('group') 
    .updateAny('group')
    .deleteAny('group');

    return roles;
  }; 

  

   