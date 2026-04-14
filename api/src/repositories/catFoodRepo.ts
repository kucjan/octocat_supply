/**
 * Repository for cat food products data access
 */

import { getDatabase, DatabaseConnection } from '../db/sqlite';
import { CatFood } from '../models/catFood';
import { handleDatabaseError, NotFoundError } from '../utils/errors';
import { objectToCamelCase, mapDatabaseRows, DatabaseRow } from '../utils/sql';

export class CatFoodRepository {
  private db: DatabaseConnection;

  constructor(db: DatabaseConnection) {
    this.db = db;
  }

  /**
   * Get all cat food products
   */
  async findAll(): Promise<CatFood[]> {
    try {
      const rows = await this.db.all<DatabaseRow>('SELECT * FROM cat_food_products ORDER BY id');
      return mapDatabaseRows<CatFood>(rows);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Get cat food product by ID
   */
  async findById(id: number): Promise<CatFood | null> {
    try {
      const row = await this.db.get<DatabaseRow>('SELECT * FROM cat_food_products WHERE id = ?', [id]);
      return row ? objectToCamelCase<CatFood>(row) : null;
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Get multiple cat food products by IDs
   */
  async findByIds(ids: number[]): Promise<CatFood[]> {
    if (ids.length === 0) return [];
    try {
      const placeholders = ids.map(() => '?').join(', ');
      const rows = await this.db.all<DatabaseRow>(
        `SELECT * FROM cat_food_products WHERE id IN (${placeholders}) ORDER BY id`,
        ids,
      );
      return mapDatabaseRows<CatFood>(rows);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  /**
   * Check if cat food product exists
   */
  async exists(id: number): Promise<boolean> {
    try {
      const result = await this.db.get<{ count: number }>(
        'SELECT COUNT(*) as count FROM cat_food_products WHERE id = ?',
        [id],
      );
      return (result?.count || 0) > 0;
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}

let repository: CatFoodRepository | null = null;

export async function getCatFoodRepository(isTest = false): Promise<CatFoodRepository> {
  if (!repository || isTest) {
    const db = await getDatabase(isTest);
    repository = new CatFoodRepository(db);
  }
  return repository;
}
