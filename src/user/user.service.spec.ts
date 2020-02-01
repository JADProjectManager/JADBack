import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserDTO, UserRO } from './user.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import 'dotenv/config';

describe('UserService', () => {
  let userService: UserService;


  const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost/nest';
  
  

  beforeEach(async () => {
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

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it ('Create User', async (done) => {

    const user = new UserDTO ();
    
    user.username = 'test';
    user.name = 'The test user';
    user.password = 'testpassword';
    user.email = 'test@test.com'

    const createdUser: UserRO = await userService.create(user);
    expect.assertions(4);

    expect(createdUser.username).toEqual('test');
    expect(createdUser.name).toEqual('The test user');
    expect(createdUser.email).toEqual('test@test.com');
    expect(createdUser.created).toBeDefined();
    done(); 
  });

});
