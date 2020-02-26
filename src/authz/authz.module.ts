import { Module, DynamicModule } from '@nestjs/common';
import { AccessControlModule, RolesBuilder } from 'nest-access-control';


@Module({
  
})
export class AuthzModule {
 
  private static roles: RolesBuilder = new RolesBuilder();


  static forRoot(rolesLoader, options?): DynamicModule {
    
    rolesLoader(this.roles); 
    
    return {
        module: AuthzModule,
        imports: [ 
            AccessControlModule.forRoles(this.roles)
        ],
        providers: [],
        exports: [],
    };
      
      
    }
}