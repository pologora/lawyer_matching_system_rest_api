/* eslint-disable sort-keys */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../../users/types/userTypes';
import { CreateLawyerService, LawyerModel, UpdateLawyerService } from '../types/lawyersTypes';
import { LawyerController } from '../LawyerController';
import { RowDataPacket } from 'mysql2';

describe('LawyerController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction>;
  let createLawyerService: jest.MockedFunction<CreateLawyerService>;
  let updateLawyerService: jest.MockedFunction<UpdateLawyerService>;
  let lawyerModel: jest.Mocked<LawyerModel>;
  let userModel: jest.Mocked<UserModel>;
  let controller: LawyerController;

  beforeEach(() => {
    req = {
      body: {
        userId: 1,
        licenseNumber: '123456',
        bio: 'Experienced lawyer',
        specializations: [1, 2, 3],
      },
      params: { id: '1' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    createLawyerService = jest.fn();
    updateLawyerService = jest.fn();
    lawyerModel = {
      create: jest.fn(),
      update: jest.fn(),
      getOne: jest.fn(),
      updateLawyerSpecializations: jest.fn(),
    } as unknown as jest.Mocked<LawyerModel>;

    userModel = {
      setRole: jest.fn(),
    } as unknown as jest.Mocked<UserModel>;

    controller = new LawyerController({
      createLawyerService,
      updateLawyerService,
      createLawyerSpecializationsQuery: 'Create Lawyer Specializations',
      deleteLawyerSpecializationsQuery: 'Delete Lawyer Specializations',
      updateUserRoleQuery: 'Update User Role',
      User: userModel,
      Lawyer: lawyerModel,
      getLawyerByIdQuery: 'Get Lawyer',
      buildGetManyLawyersQuery: jest.fn(),
    });
  });

  describe('create', () => {
    it('should create a lawyer profile and return the correct response', async () => {
      const mockLawyer = { lawyerId: 1, firstName: 'John', lastName: 'Doe' };
      createLawyerService.mockResolvedValue(mockLawyer as RowDataPacket);

      await controller.create(req as Request, res as Response, next as NextFunction);

      expect(createLawyerService).toHaveBeenCalledWith({
        LawyersProfile: lawyerModel,
        User: userModel,
        buildInsertQuery: expect.any(Function),
        createLawyerSpecializationsQuery: 'Create Lawyer Specializations',
        data: req.body,
        getLawyerByIdQuery: 'Get Lawyer',
        updateUserRoleQuery: 'Update User Role',
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: mockLawyer,
        message: 'Successfully created lawyer profile',
        status: 'success',
      });
    });
  });

  describe('update', () => {
    it('should update a lawyer profile and return the correct response', async () => {
      const mockUpdatedLawyer = { lawyerId: 1, firstName: 'John', lastName: 'Doe' };
      updateLawyerService.mockResolvedValue(mockUpdatedLawyer as RowDataPacket);

      await controller.update(req as Request, res as Response, next as NextFunction);

      expect(updateLawyerService).toHaveBeenCalledWith({
        LawyersProfile: lawyerModel,
        buildUpdateQuery: expect.any(Function),
        createLawyerSpecializationsQuery: 'Create Lawyer Specializations',
        data: req.body,
        deleteLawyerSpecializationsQuery: 'Delete Lawyer Specializations',
        getLawyerByIdQuery: 'Get Lawyer',
        id: 1,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockUpdatedLawyer,
        message: 'Successfully updated lawyer profile',
        status: 'success',
      });
    });
  });
});
