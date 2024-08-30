/* eslint-disable max-lines-per-function */
/* eslint-disable no-shadow */
/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sort-keys */
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { Lawyer } from '../Lawyer';
import { AppError } from '../../../core/AppError';

jest.mock('../../../core/CRUDModel');

describe('Lawyer Model', () => {
  let mockGetConnection: jest.Mock;
  let mockExecute: jest.Mock;
  let mockQuery: jest.Mock;
  let mockRelease: jest.Mock;
  let mockBeginTransaction: jest.Mock;
  let mockCommit: jest.Mock;
  let mockRollback: jest.Mock;

  beforeEach(() => {
    mockExecute = jest.fn();
    mockQuery = jest.fn();
    mockRelease = jest.fn();
    mockBeginTransaction = jest.fn();
    mockCommit = jest.fn();
    mockRollback = jest.fn();
    mockGetConnection = jest.fn().mockResolvedValue({
      execute: mockExecute,
      release: mockRelease,
      beginTransaction: mockBeginTransaction,
      commit: mockCommit,
      rollback: mockRollback,
    });

    Lawyer.pool = {
      getConnection: mockGetConnection,
      query: mockQuery,
    } as any;

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a lawyer and specializations successfully', async () => {
      const mockQuery = 'INSERT INTO lawyers ...';
      const mockValues = ['John Doe', 'johndoe@example.com'];
      const mockSpecializations = [1, 2];
      const mockCreateLawyerSpecializationsQuery = 'INSERT INTO lawyer_specializations ...';

      mockExecute.mockResolvedValue([{ insertId: 1, affectedRows: 1 } as ResultSetHeader]);

      const lawyerId = await Lawyer.create({
        query: mockQuery,
        values: mockValues,
        specializations: mockSpecializations,
        createLawyerSpecializationsQuery: mockCreateLawyerSpecializationsQuery,
        getLawyerByIdQuery: 'Query',
      });

      expect(mockGetConnection).toHaveBeenCalled();
      expect(mockBeginTransaction).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalledWith(mockQuery, mockValues);
      expect(mockExecute).toHaveBeenCalledWith(mockCreateLawyerSpecializationsQuery, [1, 1]);
      expect(mockExecute).toHaveBeenCalledWith(mockCreateLawyerSpecializationsQuery, [1, 2]);
      expect(mockCommit).toHaveBeenCalled();
      expect(mockRelease).toHaveBeenCalled();
      expect(lawyerId).toEqual(1);
    });

    it('should rollback the transaction if an error occurs', async () => {
      const mockQuery = 'INSERT INTO lawyers ...';
      const mockValues = ['John Doe', 'johndoe@example.com'];
      const mockSpecializations = [1, 2];
      const mockCreateLawyerSpecializationsQuery = 'INSERT INTO lawyer_specializations ...';

      mockExecute.mockRejectedValue(new Error('Database error'));

      await expect(
        Lawyer.create({
          query: mockQuery,
          values: mockValues,
          specializations: mockSpecializations,
          createLawyerSpecializationsQuery: mockCreateLawyerSpecializationsQuery,
          getLawyerByIdQuery: 'Query',
        }),
      ).rejects.toThrow(AppError);

      expect(mockRollback).toHaveBeenCalled();
      expect(mockRelease).toHaveBeenCalled();
    });
  });

  describe('getOneByUserId', () => {
    it('should retrieve a lawyer by user ID', async () => {
      const mockGetLawyerByUserIdQuery = 'SELECT * FROM lawyers WHERE userId = ?';
      const mockUserId = 1;
      const mockLawyer = { lawyerId: 1, name: 'John Doe' };

      mockQuery.mockResolvedValue([[mockLawyer] as RowDataPacket[]]);

      const result = await Lawyer.getOneByUserId({
        userId: mockUserId,
        getLawyerByUserIdQuery: mockGetLawyerByUserIdQuery,
      });

      expect(mockQuery).toHaveBeenCalledWith(mockGetLawyerByUserIdQuery, [mockUserId]);
      expect(result).toEqual(mockLawyer);
    });
  });

  describe('updateRating', () => {
    it("should update a lawyer's rating", async () => {
      const mockUpdateRatingQuery = 'UPDATE lawyers SET rating = ... WHERE lawyerId = ?';
      const mockLawyerId = 1;

      mockQuery.mockResolvedValue([{ affectedRows: 1 } as ResultSetHeader]);

      const result = await Lawyer.updateRating({ id: mockLawyerId, updateRatingQuery: mockUpdateRatingQuery });

      expect(mockQuery).toHaveBeenCalledWith(mockUpdateRatingQuery, [mockLawyerId, mockLawyerId]);
      expect(result).toEqual({ affectedRows: 1 });
    });
  });

  describe('updateLawyerSpecializations', () => {
    it("should update a lawyer's specializations successfully", async () => {
      const mockLawyerId = 1;
      const mockSpecializationsIds = [1, 2];
      const mockDeleteLawyerSpecializationsQuery = 'DELETE FROM lawyer_specializations WHERE lawyerId = ?';
      const mockCreateLawyerSpecializationsQuery = 'INSERT INTO lawyer_specializations ...';

      mockExecute.mockResolvedValue([{ affectedRows: 1 } as ResultSetHeader]);

      await Lawyer.updateLawyerSpecializations({
        lawyerId: mockLawyerId,
        specializationsIds: mockSpecializationsIds,
        deleteLawyerSpecializationsQuery: mockDeleteLawyerSpecializationsQuery,
        createLawyerSpecializationsQuery: mockCreateLawyerSpecializationsQuery,
      });

      expect(mockGetConnection).toHaveBeenCalled();
      expect(mockExecute).toHaveBeenCalledWith(mockDeleteLawyerSpecializationsQuery, [mockLawyerId]);
      expect(mockExecute).toHaveBeenCalledWith(mockCreateLawyerSpecializationsQuery, [mockLawyerId, 1]);
      expect(mockExecute).toHaveBeenCalledWith(mockCreateLawyerSpecializationsQuery, [mockLawyerId, 2]);
      expect(mockCommit).toHaveBeenCalled();
      expect(mockRelease).toHaveBeenCalled();
    });

    it('should rollback the transaction if an error occurs', async () => {
      const mockLawyerId = 1;
      const mockSpecializationsIds = [1, 2];
      const mockDeleteLawyerSpecializationsQuery = 'DELETE FROM lawyer_specializations WHERE lawyerId = ?';
      const mockCreateLawyerSpecializationsQuery = 'INSERT INTO lawyer_specializations ...';

      mockExecute.mockRejectedValue(new Error('Database error'));

      await expect(
        Lawyer.updateLawyerSpecializations({
          lawyerId: mockLawyerId,
          specializationsIds: mockSpecializationsIds,
          deleteLawyerSpecializationsQuery: mockDeleteLawyerSpecializationsQuery,
          createLawyerSpecializationsQuery: mockCreateLawyerSpecializationsQuery,
        }),
      ).rejects.toThrow(AppError);

      expect(mockRollback).toHaveBeenCalled();
      expect(mockRelease).toHaveBeenCalled();
    });
  });
});
