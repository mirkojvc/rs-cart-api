import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CartService {
  constructor(private databaseService: DatabaseService) {}

  async findByUserId(userId: string) {
    console.log('userId', userId);
    const query = 'SELECT * FROM carts WHERE user_id = $1';
    const results = await this.databaseService.query(query, [userId]);
    return results[0];
  }

  async createByUserId(userId: string) {
    const id = uuidv4();
    const query = 'INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES ($1, $2, CURRENT_DATE, CURRENT_DATE, $3) RETURNING *';
    const results = await this.databaseService.query(query, [id, userId, 'OPEN']);
    return results[0];
  }

  async findOrCreateByUserId(userId: string) {
    let cart = await this.findByUserId(userId);
    if (!cart) {
      cart = await this.createByUserId(userId);
    }
    return cart;
  }

  async updateByUserId(userId: string, items: any[]) {
    const cart = await this.findOrCreateByUserId(userId);
    const updateItemsQuery = 'UPDATE cart_items SET count = $1 WHERE cart_id = $2 AND product_id = $3';
    items.forEach(async item => {
      await this.databaseService.query(updateItemsQuery, [item.count, cart.id, item.product_id]);
    });
    return await this.findByUserId(userId);
  }

  async removeByUserId(userId: string) {
    const deleteQuery = 'DELETE FROM carts WHERE user_id = $1';
    await this.databaseService.query(deleteQuery, [userId]);
  }
}
