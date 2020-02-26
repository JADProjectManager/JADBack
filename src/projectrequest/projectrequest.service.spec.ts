import { Test, TestingModule } from '@nestjs/testing';
import { ProjectRequestService } from './projectrequest.service';
import { ProjectRequestDTO, ProjectRequestRO } from './projectrequest.dto';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectRequestSchema } from './projectrequest.model';
import 'dotenv/config';
import { GroupSchema } from '../group/group.model';
import { UserSchema } from '../user/user.model';
import { UserService } from '../user/user.service';
import { GroupService } from '../group/group.service';
import { UserDTO, UserRO } from '../user/user.dto';
import { GroupRO, GroupDTO } from '../group/group.dto';

describe('ProjectRequestService', () => {
  let projectRequestService: ProjectRequestService;

  let testUserId, testGroupId, testPRId;

  const MONGODB_URL = process.env.MONGODB_URL_TEST || 'mongodb://localhost/nest-jadback';
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectRequestService, UserService, GroupService],
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
        MongooseModule.forFeature([{name: 'ProjectRequest', schema: ProjectRequestSchema}]),
        MongooseModule.forFeature([{name: 'Group',schema: GroupSchema}]),
        MongooseModule.forFeature([{name: 'User',schema: UserSchema}]),
      ]
    }).compile();

    //Create a user for test
    let userService = module.get<UserService>(UserService);
    
    //Create a group for test
    let groupService = module.get<GroupService>(GroupService);
    projectRequestService = module.get<ProjectRequestService>(ProjectRequestService);

    //Create a test user
    let user;

    try {
      user = await userService.getUserByUsername ('testpruser');
      
      if (user) {
        await userService.delete (user.id);
      }
    }catch (error) {}

    try {
      user = new UserDTO ();

      user.username = 'testpruser';
      user.name = 'The test user';
      user.password = 'testpassword';
      user.email = 'testpr@test.com';
  
      const createdUser: UserRO = await userService.create(user);
      testUserId = createdUser.id;

    } catch (error) {
      console.log (error);
    }

    //Create a test group
    try{
      const group = new GroupDTO ();
    
      group.name = 'testprgroup';
      group.description = 'The test group';
      group.type = 'testGroup'
  
      const createdGroup: GroupRO = await groupService.create(testUserId, group);
      testGroupId = createdGroup.id;
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
    expect(projectRequestService).toBeDefined();
  });

  it ('Should create a project requests', async (done) => {

    const projectRequest : ProjectRequestDTO = {
      name: 'Pr Name',
      additionalInformation: 'Additional Information',
      affectedDepartments: 'Affected Departments',
      applicant: testUserId,
      benefitedMemberGroups: 'Benefited MemberGroups',
      desiredFeatures: 'Desired Features',
      functionalManager: testUserId,
      functionalManagerName: 'Whatever, we already have an id',
      need: 'All I need is love',
      neededIntegrations: 'Ohh man, we need all integrations',
      notDoingConsequences: 'Death',
      sponsor: testGroupId,
      strategicGoals: 'Strategic Goals',
      strategicGoalsExplanation: 'It speaks for itself',
      unit: 'Where I belong to'
    };

    const createdPR: ProjectRequestRO = await projectRequestService.create(testUserId, projectRequest);
    testPRId = createdPR.id;

    expect(createdPR.name).toEqual('Pr Name'),
    expect(createdPR.additionalInformation).toEqual('Additional Information');
    expect(createdPR.affectedDepartments).toEqual('Affected Departments');
    expect(createdPR.applicant == testUserId).toEqual(true);
    expect(createdPR.benefitedMemberGroups).toEqual('Benefited MemberGroups');
    expect(createdPR.desiredFeatures).toEqual('Desired Features');
    expect(createdPR.functionalManager == testUserId).toEqual(true);
    expect(createdPR.functionalManagerName).toEqual('Whatever, we already have an id');
    expect(createdPR.need).toEqual('All I need is love');
    expect(createdPR.neededIntegrations).toEqual('Ohh man, we need all integrations');
    expect(createdPR.notDoingConsequences).toEqual('Death');
    expect(createdPR.sponsor == testGroupId).toEqual(true);
    expect(createdPR.strategicGoals).toEqual('Strategic Goals');
    expect(createdPR.strategicGoalsExplanation).toEqual('It speaks for itself');
    expect(createdPR.unit).toEqual('Where I belong to');
    done(); 
  });

  it ('Update Project Request data', async (done) => {

    const changeData = {"additionalInformation": "Another additiona Information"};

    const updatedPR: ProjectRequestRO = await projectRequestService.update(testPRId, testUserId, changeData);
    expect.assertions(3);
    expect(updatedPR.name).toEqual('Pr Name');
    expect(updatedPR.additionalInformation).toEqual('Another additiona Information');
    expect(updatedPR.affectedDepartments).toEqual('Affected Departments');
    done(); 
  });

  it ('Should find a project request by id', async () => {
    const pr = await projectRequestService.getProjectRequest(testPRId);
    expect(pr.name).toEqual('Pr Name');
  });

  it ('Should fire an exception if user not found', async (done) => {
    try {
      await projectRequestService.getProjectRequest('newTestPRId');
      done ('Error is not fired when asked for an unexisting user')
    } catch (exception) {
      done();
    }
  });

});
