import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CatFoodRepository } from './catFoodRepo';
import { NotFoundError } from '../utils/errors';

vi.mock('../db/sqlite', () => ({
  getDatabase: vi.fn(),
}));

import { getDatabase } from '../db/sqlite';

describe('CatFoodRepository', () => {
  let repository: CatFoodRepository;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      db: {} as any,
      run: vi.fn(),
      get: vi.fn(),
      all: vi.fn(),
      close: vi.fn(),
    };

    (getDatabase as any).mockResolvedValue(mockDb);
    repository = new CatFoodRepository(mockDb);
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all cat food products', async () => {
      const mockRows = [
        {
          id: 1,
          name: 'Whiskas Kurczak',
          description: 'Karma z kurczakiem',
          category: 'wet',
          protein_source: 'chicken',
          img_name: 'whiskas.png',
          nutritional_info: '{"protein":"10%"}',
        },
        {
          id: 2,
          name: 'Royal Canin',
          description: 'Sucha karma',
          category: 'dry',
          protein_source: 'chicken',
          img_name: null,
          nutritional_info: null,
        },
      ];
      mockDb.all.mockResolvedValue(mockRows);

      const result = await repository.findAll();

      expect(mockDb.all).toHaveBeenCalledWith('SELECT * FROM cat_food_products ORDER BY id');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('Whiskas Kurczak');
      expect(result[0].proteinSource).toBe('chicken');
      expect(result[1].id).toBe(2);
    });

    it('should return empty array when no products exist', async () => {
      mockDb.all.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return cat food product when found', async () => {
      const mockRow = {
        id: 1,
        name: 'Sheba Łosoś',
        description: 'Filety z łososia',
        category: 'wet',
        protein_source: 'salmon',
        img_name: 'sheba_salmon.png',
        nutritional_info: '{"protein":"9%"}',
      };
      mockDb.get.mockResolvedValue(mockRow);

      const result = await repository.findById(1);

      expect(mockDb.get).toHaveBeenCalledWith(
        'SELECT * FROM cat_food_products WHERE id = ?',
        [1],
      );
      expect(result?.id).toBe(1);
      expect(result?.name).toBe('Sheba Łosoś');
      expect(result?.proteinSource).toBe('salmon');
    });

    it('should return null when product not found', async () => {
      mockDb.get.mockResolvedValue(undefined);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findByIds', () => {
    it('should return products for given IDs', async () => {
      const mockRows = [
        { id: 1, name: 'Product A', description: 'Desc A', category: 'wet', protein_source: 'chicken', img_name: null, nutritional_info: null },
        { id: 3, name: 'Product C', description: 'Desc C', category: 'dry', protein_source: 'salmon', img_name: null, nutritional_info: null },
      ];
      mockDb.all.mockResolvedValue(mockRows);

      const result = await repository.findByIds([1, 3]);

      expect(mockDb.all).toHaveBeenCalledWith(
        'SELECT * FROM cat_food_products WHERE id IN (?, ?) ORDER BY id',
        [1, 3],
      );
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    it('should return empty array for empty IDs list', async () => {
      const result = await repository.findByIds([]);

      expect(mockDb.all).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('exists', () => {
    it('should return true when product exists', async () => {
      mockDb.get.mockResolvedValue({ count: 1 });

      const result = await repository.exists(1);

      expect(result).toBe(true);
    });

    it('should return false when product does not exist', async () => {
      mockDb.get.mockResolvedValue({ count: 0 });

      const result = await repository.exists(999);

      expect(result).toBe(false);
    });
  });
});
