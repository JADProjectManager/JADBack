import { RolesBuilder, AccessControlModule} from 'nest-access-control';

export enum ProjectRequestRoles {
  PR_MANAGE_OWN = 'PR_MANAGE_OWN',
  PR_MANAGE_ANY = 'PR_MANAGE_ANY'
};
  
  //export const roles: RolesBuilder = AccessControlModule.  new RolesBuilder();
  
  export function loadRoles (roles: RolesBuilder): RolesBuilder {

    roles
    .grant (ProjectRequestRoles.PR_MANAGE_OWN)
    .read ('projectrequest')
    .createOwn ('projectrequest')
    .updateOwn ('projectrequest')
    .deleteOwn ('projectrequest')
 
    .grant(ProjectRequestRoles.PR_MANAGE_ANY)
    .extend (ProjectRequestRoles.PR_MANAGE_OWN) 
    .createAny('projectrequest') 
    .updateAny('projectrequest')
    .deleteAny('projectrequest');

    return roles;
  }; 

  

   