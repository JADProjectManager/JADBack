import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserDTO, UserRO, UserCredentialsDTO } from './user.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import 'dotenv/config';
import { create } from 'domain';

describe('UserService', () => {
  let userService: UserService;
  let testUserId;

  const MONGODB_URL = process.env.MONGODB_URL_TEST || 'mongodb://localhost/nest-jadback';
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
      imports: [
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: MONGODB_URL,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
          })
        }),
        MongooseModule.forFeature([{name: 'User',schema: UserSchema}]),
      ]
    }).compile();

    userService = module.get<UserService>(UserService);
    try {
      const user: UserRO = await userService.getUserByUsername ('test');
      
      if (user) {
        await userService.delete (user.id);
      }

    } catch (error) {}

  });

  it('Should be defined', () => {
    expect(userService).toBeDefined();
  });

  it ('Should create user', async (done) => {

    const user = new UserDTO ();
    
    user.username = 'test';
    user.name = 'The test user';
    user.password = 'testpassword';
    user.email = 'test@test.com'

    const createdUser: UserRO = await userService.create(user);
    testUserId = createdUser.id;
    expect.assertions(5);

    expect(createdUser.username).toEqual('test');
    expect(createdUser.name).toEqual('The test user');
    expect(createdUser.email).toEqual('test@test.com');
    expect(createdUser.created).toBeDefined();
    expect(createdUser.roles.length).toBe(1); //The default role
    done(); 
  });

  it ('Update user data', async (done) => {

    const changeData = {"email": "test@test.es"};

    const updatedUser: UserRO = await userService.update(testUserId,changeData);
    expect.assertions(4);

    expect(updatedUser.username).toEqual('test');
    expect(updatedUser.name).toEqual('The test user');
    expect(updatedUser.email).toEqual('test@test.es');
    expect(updatedUser.created).toBeDefined();
    done(); 
  });

  it ('Update should return an error if the userid doesn\'t exist' , async (done) => {
  const changeData = {"email": "some@data.es"};

    try {
      await userService.update('the invented id',changeData);
      done ('Invalid id wasn\'t detected');

    } catch (error){
      done ();
    } 
  });
 

  it ('should find a username', async () => {
    const user = await userService.getUserByUsername('test');
    expect(user.name).toEqual('The test user');
  });

  it ('Should fire an exception if user not found', async (done) => {
    try {
      const user = await userService.getUserByUsername('nonexistinguser');
      done ('Error is not fired when asked for an unexisting user')
    } catch (exception) {
      done();
    }
  });

  it ('Should find user by id', async () => {
    const user = await userService.getUser(testUserId);
    expect(user.name).toEqual('The test user');
  });

  it ('Should fire an exception if user not found', async (done) => {
    try {
      const user = await userService.getUser('testUserId');
      done ('Error is not fired when asked for an unexisting user')
    } catch (exception) {
      done();
    }
  });

  it ('login method shoud authenticate with correct username and password', async () => {
    const credentials: UserCredentialsDTO  = new UserCredentialsDTO();
    credentials.username = "test";
    credentials.password = "testpassword";

    const user = await userService.login(credentials);    
    expect(user.username).toEqual('test');
    expect(user.name).toEqual('The test user');
    expect(user.email).toEqual('test@test.es');
    expect(user.created).toBeDefined();
    expect(user.updated).toBeDefined();
    expect(user.roles).toBeDefined();
    expect(user.token).toBeDefined();
  });

  it ('Login with bad password should fire an exception', async (done) => {
    const credentials: UserCredentialsDTO  = new UserCredentialsDTO();
    credentials.username = "test";
    credentials.password = "badpassword";
    
    try {
      await userService.login (credentials);
      done ('Bad password is not detected on login');
    } catch (exception) {
      done();
    }
  });

  it ('Login with bad username should fire an exception', async (done) => {
    const credentials: UserCredentialsDTO  = new UserCredentialsDTO();
    credentials.username = "inventeduser";
    credentials.password = "testpassword";
    
    try {
      await userService.login (credentials);
      done ('Bad username is not detected on login');
    } catch (exception) {
      done();
    }
  });

  it ('Should change password without check', async (done) => {
    const credentials: UserCredentialsDTO  = new UserCredentialsDTO();
    credentials.username = "test";
    credentials.password = "the new password";
    
    try {
      await userService.changePassword (testUserId, false, credentials.password );
      const user = await userService.login(credentials);   
      expect.assertions(2);
      expect(user.username).toEqual('test');
      expect(user.name).toEqual('The test user');
      done ();
    } catch (error ) {
      done ('Password change failed');
    }

  }); 

  it ('Should change password with check and good password', async (done) => {
    const credentials: UserCredentialsDTO  = new UserCredentialsDTO();
    credentials.username = "test";
    credentials.password = "the new new password";
    
    const oldPassword = "the new password";

    try {
      await userService.changePassword (testUserId, true, credentials.password, oldPassword);
      const user = await userService.login(credentials);   
      expect.assertions(2);
      expect(user.username).toEqual('test');
      expect(user.name).toEqual('The test user');
      done ();
    } catch (error ) {
      done ('Password change failed');
    }

  });


  it ('Should fail change password with check and bad password', async (done) => {
    const credentials: UserCredentialsDTO  = new UserCredentialsDTO();
    credentials.username = "test";
    credentials.password = "some password";
    const oldPassword = "wrong password";

    try {
      await userService.changePassword (testUserId, true, credentials.password, oldPassword);
      done ('Wrong old password not detected');
    } catch (error ) {
      done ();
    }

  }); 

  it ('Should grant a role', async (done) => {

    const user = await userService.grantRole (testUserId,"USERS_ADMINISTRATOR");
    expect.assertions(2);
      expect(user.roles).toContain('BASIC_USER');
      expect(user.roles).toContain('USERS_ADMINISTRATOR');
      done();
  }); 


  it ('Should revoke a role', async (done) => {

    const user = await userService.revokeRole (testUserId,"USERS_ADMINISTRATOR");
    expect.assertions(2);
      expect(user.roles).toContain('BASIC_USER');
      expect(user.roles).not.toContain ('USERS_ADMINISTRATOR');
      done();
  }); 

});
