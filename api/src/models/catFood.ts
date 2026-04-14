/**
 * @swagger
 * components:
 *   schemas:
 *     CatFood:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - category
 *         - proteinSource
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the cat food product
 *         name:
 *           type: string
 *           description: The name of the cat food product
 *         description:
 *           type: string
 *           description: Detailed description of the product
 *         category:
 *           type: string
 *           enum: [wet, dry, treat, supplement]
 *           description: Category of the cat food (wet/dry/treat/supplement)
 *         proteinSource:
 *           type: string
 *           description: Main protein source (e.g. chicken, salmon, tuna)
 *         imgName:
 *           type: string
 *           description: Filename of the product image
 *         nutritionalInfo:
 *           type: string
 *           description: JSON string with nutritional values (protein, fat, fiber, moisture percentages)
 *     DietSuggestion:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the suggested meal/diet composition
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           description: List of ingredients or product names
 *         description:
 *           type: string
 *           description: Description of the diet composition and its benefits
 *         feedingTips:
 *           type: string
 *           description: Practical tips on how to serve and feed this combination
 *     DietGenerateRequest:
 *       type: object
 *       required:
 *         - likedIds
 *         - dislikedIds
 *       properties:
 *         likedIds:
 *           type: array
 *           items:
 *             type: integer
 *           description: IDs of cat food products the user liked
 *         dislikedIds:
 *           type: array
 *           items:
 *             type: integer
 *           description: IDs of cat food products the user disliked
 *     DietGenerateResponse:
 *       type: object
 *       properties:
 *         suggestions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DietSuggestion'
 */

export interface CatFood {
  id: number;
  name: string;
  description: string;
  category: 'wet' | 'dry' | 'treat' | 'supplement';
  proteinSource: string;
  imgName?: string;
  nutritionalInfo?: string;
}

export interface DietSuggestion {
  name: string;
  ingredients: string[];
  description: string;
  feedingTips: string;
}

export interface DietGenerateRequest {
  likedIds: number[];
  dislikedIds: number[];
}

export interface DietGenerateResponse {
  suggestions: DietSuggestion[];
}
