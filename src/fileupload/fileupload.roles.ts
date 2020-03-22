import { RolesBuilder} from 'nest-access-control';
import { FileUploadService } from './fileupload.service';

export enum FileUploadRoles {
    BASIC_USER = 'BASIC_USER',
    USERS_ADMINISTRATOR = 'USERS_ADMINISTRATOR'
  }
  
  export function loadRoles (roles: RolesBuilder) {
    roles
    .grant (FileUploadRoles.BASIC_USER)
    .createAny('tempfile')
    .grant (FileUploadRoles.USERS_ADMINISTRATOR)
    .extend(FileUploadRoles.BASIC_USER);
  }