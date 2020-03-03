import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { GroupDTO, GroupRO } from './group.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupSchema } from './group.model';
import 'dotenv/config';
import { create } from 'domain';
import { UserSchema } from '../user/user.model';
import { UserService } from '../user/user.service';
import { UserRO, UserDTO } from '../user/user.dto';
import { async } from 'rxjs/internal/scheduler/async';

describe('GroupService', () => {
  let groupService: GroupService;
  let testUserId, testGroupId : string;

  const MONGODB_URL = process.env.MONGODB_URL_TEST || 'mongodb://localhost/nest-jadback';
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupService, UserService],
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
        MongooseModule.forFeature([{name: 'Group',schema: GroupSchema}]),
        MongooseModule.forFeature([{name: 'User',schema: UserSchema}]),
      ]
    }).compile();

    
      
    let userService = module.get<UserService>(UserService);
    groupService = module.get<GroupService>(GroupService);

    let user;

    //Create a test user
    try {
       user = await userService.getUserByUsername ('testgroupuser');
      
      if (user) {
        console.log ("borra");
        await userService.delete (user.id);
      }

    } catch (error) {}
    
    try {
      user = new UserDTO ();

      user.username = 'testgroupsuser';
      user.name = 'The test user';
      user.password = 'testpassword';
      user.email = 'testgroup@test.com'
  
      const createdUser: UserRO = await userService.create(user);
      testUserId = createdUser.id;

    } catch (error) {}


    //Delete all the objects created for testing purpose 
    afterAll (async ()=> {
      try {
        userService.delete(testUserId);
      } catch (error) {}

      try {
        groupService.delete(testGroupId);
      } catch (error) {}
    });

  });

  it('Should be defined', () => {
    expect(groupService).toBeDefined();
  });

  it ('Should create a group', async (done) => {

    const group = new GroupDTO ();
    
    group.name = 'test';
    group.description = 'The test group';
    group.type = 'testGroup'

    const createdGroup: GroupRO = await groupService.create(testUserId, group);
    testGroupId = createdGroup.id;
    
    expect.assertions(4);

    expect(createdGroup.name).toEqual('test');
    expect(createdGroup.description).toEqual('The test group');
    expect(createdGroup.type).toEqual('testGroup');
    expect(createdGroup.members.length).toBe(0); //Nobody is there
    done(); 
  });

  it ('Update group data', async (done) => {

    const changeData = {"description": "The new description"};

    const updatedGroup: GroupRO = await groupService.update(testGroupId, testUserId, changeData);
    expect.assertions(3);

    expect(updatedGroup.name).toEqual('test');
    expect(updatedGroup.description).toEqual('The new description');
    expect(updatedGroup.type).toEqual('testGroup');
    done(); 
  });

  it ('Update should return an error if the userid doesn\'t exist' , async (done) => {
  const changeData = {"type": "anotherTest"};

    try {
      
      await groupService.update('the invented id',testUserId,changeData);
      done ('Invalid id wasn\'t detected');

    } catch (error){
      done ();
    } 
  });
 

  it ('Should find user by id', async () => {
    const group = await groupService.getGroup(testGroupId, false);
    expect(group.name).toEqual('test');
  });

  it ('Should fire an exception if user not found', async (done) => {
    try {
      await groupService.getGroup('testGroupId',false);
      done ('Error is not fired when asked for an unexisting user')
    } catch (exception) {
      done();
    }
  });


});
