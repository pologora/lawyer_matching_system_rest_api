/* eslint-disable max-lines-per-function */
/* eslint-disable sort-keys */
/* eslint-disable no-magic-numbers */
import { UserModel } from '../../users/types/userTypes';
import { createLawyerService, updateLawyerService } from '../lawyerService';
import { LawyerModel } from '../types/lawyersTypes';

describe('lawyerService', () => {
  describe('createLawyerService', () => {
    let mockCreateLawyer: jest.Mock;
    let mockGetLawyer: jest.Mock;
    let mockSetRole: jest.Mock;
    let mockLawyer: LawyerModel;
    let mockUser: UserModel;
    let mockBuildInsertQuery: jest.Mock;

    beforeEach(() => {
      mockCreateLawyer = jest.fn();
      mockGetLawyer = jest.fn();
      mockSetRole = jest.fn();
      mockLawyer = { create: mockCreateLawyer, getOne: mockGetLawyer } as unknown as LawyerModel;
      mockUser = { setRole: mockSetRole } as unknown as UserModel;
      mockBuildInsertQuery = jest.fn();
    });

    const mockCreateLawyerSpecializationsQuery = 'Create Lawyer';
    const mockGetLawyerByIdQuery = 'Get Lawyer';
    const mockUpdateUserRoleQuery = 'Update Role';
    const mockData = {
      userId: 1,
      licenseNumber: '234',
      bio: 'test',
      experience: 2,
      firstName: 'John',
      lastName: 'Doe',
      cityId: 1,
      regionId: 2,
      specializations: [1, 2, 3],
    };

    it('should return created lawyer and set lawyer role to the user', async () => {
      const query = 'Insert query';
      const values = [1, 2, 3];
      const newLawyerId = 1;
      const newLawyer = { lawyerId: 1, firstName: 'Name' };

      mockBuildInsertQuery.mockReturnValue({ query, values });
      mockCreateLawyer.mockResolvedValue(newLawyerId);
      mockSetRole.mockResolvedValue(undefined);
      mockGetLawyer.mockResolvedValue(newLawyer);

      const result = await createLawyerService({
        buildInsertQuery: mockBuildInsertQuery,
        createLawyerSpecializationsQuery: mockCreateLawyerSpecializationsQuery,
        data: mockData,
        getLawyerByIdQuery: mockGetLawyerByIdQuery,
        LawyersProfile: mockLawyer as unknown as LawyerModel,
        updateUserRoleQuery: mockUpdateUserRoleQuery,
        User: mockUser as unknown as UserModel,
      });

      expect(mockBuildInsertQuery).toHaveBeenCalledWith(
        {
          userId: 1,
          licenseNumber: '234',
          bio: 'test',
          experience: 2,
          firstName: 'John',
          lastName: 'Doe',
          cityId: 1,
          regionId: 2,
        },
        'LawyerProfile',
      );
      expect(mockCreateLawyer).toHaveBeenCalledWith({
        createLawyerSpecializationsQuery: mockCreateLawyerSpecializationsQuery,
        getLawyerByIdQuery: mockGetLawyerByIdQuery,
        query,
        specializations: mockData.specializations,
        values,
      });
      expect(mockSetRole).toHaveBeenCalledWith({
        id: mockData.userId,
        role: 'lawyer',
        updateUserRoleQuery: mockUpdateUserRoleQuery,
      });
      expect(mockGetLawyer).toHaveBeenCalledWith({ id: newLawyerId, query: mockGetLawyerByIdQuery });
      expect(result).toEqual(newLawyer);
    });
  });

  describe('updateLawyerService', () => {
    let mockBuildUpdateQuery: jest.Mock;
    let mockCreateLawyerSpecializationsQuery: string;
    let mockGetLawyerByIdQuery: string;
    let mockDeleteLawyerSpecializationsQuery: string;
    let mockData: {
      specializations: number[];
      bio: string;
      experience: number;
      firstName: string;
      lastName: string;
      cityId: number;
      regionId: number;
    };
    let mockUpdateLawyer: jest.Mock;
    let mockGetLawyer: jest.Mock;
    let mockUpdateLawyerSpecializations: jest.Mock;
    let mockLawyer: LawyerModel;

    beforeEach(() => {
      mockBuildUpdateQuery = jest.fn();
      mockCreateLawyerSpecializationsQuery = 'Create Lawyer Specializations';
      mockGetLawyerByIdQuery = 'Get Lawyer';
      mockDeleteLawyerSpecializationsQuery = 'Delete Lawyer Specializations';
      mockData = {
        specializations: [1, 2, 3],
        bio: 'Updated bio',
        experience: 5,
        firstName: 'John',
        lastName: 'Doe',
        cityId: 2,
        regionId: 3,
      };

      mockUpdateLawyer = jest.fn();
      mockGetLawyer = jest.fn();
      mockUpdateLawyerSpecializations = jest.fn();
      mockLawyer = {
        update: mockUpdateLawyer,
        getOne: mockGetLawyer,
        updateLawyerSpecializations: mockUpdateLawyerSpecializations,
      } as unknown as LawyerModel;
    });
    it('should update lawyer specializations and return updated lawyer', async () => {
      const query = 'Update query';
      const values = [2, 3, 5, 'Updated bio', 'John', 'Doe'];
      const lawyerId = 1;
      const updatedLawyer = { lawyerId: 1, firstName: 'John', lastName: 'Doe' };

      mockGetLawyer.mockResolvedValue(updatedLawyer);
      mockBuildUpdateQuery.mockReturnValue({ query, values });

      const result = await updateLawyerService({
        LawyersProfile: mockLawyer as unknown as LawyerModel,
        buildUpdateQuery: mockBuildUpdateQuery,
        getLawyerByIdQuery: mockGetLawyerByIdQuery,
        deleteLawyerSpecializationsQuery: mockDeleteLawyerSpecializationsQuery,
        createLawyerSpecializationsQuery: mockCreateLawyerSpecializationsQuery,
        data: mockData,
        id: lawyerId,
      });

      expect(mockGetLawyer).toHaveBeenCalledWith({ id: lawyerId, query: mockGetLawyerByIdQuery });
      expect(mockUpdateLawyerSpecializations).toHaveBeenCalledWith({
        createLawyerSpecializationsQuery: mockCreateLawyerSpecializationsQuery,
        deleteLawyerSpecializationsQuery: mockDeleteLawyerSpecializationsQuery,
        lawyerId: lawyerId,
        specializationsIds: [1, 2, 3],
      });
      expect(mockBuildUpdateQuery).toHaveBeenCalledWith(
        {
          bio: 'Updated bio',
          experience: 5,
          firstName: 'John',
          lastName: 'Doe',
          cityId: 2,
          regionId: 3,
        },
        'LawyerProfile',
      );
      expect(mockUpdateLawyer).toHaveBeenCalledWith({
        id: lawyerId,
        query,
        values,
      });
      expect(mockGetLawyer).toHaveBeenCalledWith({ id: lawyerId, query: mockGetLawyerByIdQuery });
      expect(result).toEqual(updatedLawyer);
    });

    it('should update lawyer details without specializations and return updated lawyer', async () => {
      const query = 'Update query';
      const values = [2, 3, 5, 'Updated bio', 'John', 'Doe'];
      const lawyerId = 1;
      const updatedLawyer = { lawyerId: 1, firstName: 'John', lastName: 'Doe' };

      mockGetLawyer.mockResolvedValue(updatedLawyer);
      mockBuildUpdateQuery.mockReturnValue({ query, values });

      const dataWithoutSpecializations = {
        bio: 'Updated bio',
        experience: 5,
        firstName: 'John',
        lastName: 'Doe',
        cityId: 2,
        regionId: 3,
      };

      const result = await updateLawyerService({
        LawyersProfile: mockLawyer as unknown as LawyerModel,
        buildUpdateQuery: mockBuildUpdateQuery,
        getLawyerByIdQuery: mockGetLawyerByIdQuery,
        deleteLawyerSpecializationsQuery: mockDeleteLawyerSpecializationsQuery,
        createLawyerSpecializationsQuery: mockCreateLawyerSpecializationsQuery,
        data: dataWithoutSpecializations,
        id: lawyerId,
      });

      expect(mockGetLawyer).toHaveBeenCalledWith({ id: lawyerId, query: mockGetLawyerByIdQuery });
      expect(mockUpdateLawyerSpecializations).not.toHaveBeenCalled();
      expect(mockBuildUpdateQuery).toHaveBeenCalledWith(
        {
          bio: 'Updated bio',
          experience: 5,
          firstName: 'John',
          lastName: 'Doe',
          cityId: 2,
          regionId: 3,
        },
        'LawyerProfile',
      );
      expect(mockUpdateLawyer).toHaveBeenCalledWith({
        id: lawyerId,
        query,
        values,
      });
      expect(mockGetLawyer).toHaveBeenCalledWith({ id: lawyerId, query: mockGetLawyerByIdQuery });
      expect(result).toEqual(updatedLawyer);
    });

    it('should return lawyer without updating when no data is provided', async () => {
      const lawyerId = 1;
      const initialLawyer = { lawyerId: 1, firstName: 'John', lastName: 'Doe' };

      mockGetLawyer.mockResolvedValue(initialLawyer);

      const result = await updateLawyerService({
        LawyersProfile: mockLawyer as unknown as LawyerModel,
        buildUpdateQuery: mockBuildUpdateQuery,
        getLawyerByIdQuery: mockGetLawyerByIdQuery,
        deleteLawyerSpecializationsQuery: mockDeleteLawyerSpecializationsQuery,
        createLawyerSpecializationsQuery: mockCreateLawyerSpecializationsQuery,
        data: {},
        id: lawyerId,
      });

      expect(mockGetLawyer).toHaveBeenCalledWith({ id: lawyerId, query: mockGetLawyerByIdQuery });
      expect(mockUpdateLawyerSpecializations).not.toHaveBeenCalled();
      expect(mockBuildUpdateQuery).not.toHaveBeenCalled();
      expect(mockUpdateLawyer).not.toHaveBeenCalled();
      expect(result).toEqual(initialLawyer);
    });
  });
});
