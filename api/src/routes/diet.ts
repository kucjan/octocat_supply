/**
 * @swagger
 * tags:
 *   name: Diet
 *   description: Cat diet generator endpoints
 */

/**
 * @swagger
 * /api/diet/products:
 *   get:
 *     summary: Returns all cat food products for swiping
 *     tags: [Diet]
 *     responses:
 *       200:
 *         description: List of cat food products available for preference collection
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CatFood'
 *
 * /api/diet/generate:
 *   post:
 *     summary: Generate AI-based diet suggestions for a cat
 *     tags: [Diet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DietGenerateRequest'
 *     responses:
 *       200:
 *         description: AI-generated diet suggestions based on user preferences
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DietGenerateResponse'
 *       400:
 *         description: Invalid request – likedIds must be a non-empty array
 *       503:
 *         description: AI service unavailable (GITHUB_TOKEN not configured)
 */

import express from 'express';
import OpenAI from 'openai';
import { getCatFoodRepository } from '../repositories/catFoodRepo';
import { DietGenerateRequest, DietGenerateResponse, DietSuggestion } from '../models/catFood';
import { ValidationError } from '../utils/errors';

const router = express.Router();

// GET /api/diet/products – returns all cat food items for the swipe UI
router.get('/products', async (_req, res, next) => {
  try {
    const repo = await getCatFoodRepository();
    const products = await repo.findAll();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// POST /api/diet/generate – generate AI diet suggestions based on swipe preferences
router.post('/generate', async (req, res, next) => {
  try {
    const body = req.body as DietGenerateRequest;

    if (!Array.isArray(body.likedIds) || !Array.isArray(body.dislikedIds)) {
      throw new ValidationError('likedIds and dislikedIds must be arrays');
    }

    if (body.likedIds.length === 0) {
      throw new ValidationError('At least one liked product is required to generate suggestions');
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      res.status(503).json({
        error: {
          code: 'AI_UNAVAILABLE',
          message: 'AI service is not configured. Set the GITHUB_TOKEN environment variable.',
        },
      });
      return;
    }

    const repo = await getCatFoodRepository();
    const likedProducts = await repo.findByIds(body.likedIds);
    const dislikedProducts = await repo.findByIds(body.dislikedIds);

    const likedList = likedProducts
      .map((p) => `- ${p.name} (${p.category}, protein: ${p.proteinSource}): ${p.description}`)
      .join('\n');

    const dislikedList =
      dislikedProducts.length > 0
        ? `\nThe cat DISLIKES:\n${dislikedProducts.map((p) => `- ${p.name} (${p.category}, protein: ${p.proteinSource})`).join('\n')}`
        : '';

    const prompt = `You are an expert in cat nutrition. Based on the cat's preferences, propose 3 creative diet and cat food combinations.

The cat LIKES:
${likedList}
${dislikedList}

Return ONLY valid JSON (no markdown, no \`\`\`json block) in the following format:
{
  "suggestions": [
    {
      "name": "suggestion name",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "description": "description of the composition and its health benefits",
      "feedingTips": "practical feeding and serving tips"
    }
  ]
}

Provide exactly 3 suggestions. Include information about proteins, vitamins and a balanced diet. Write in English.`;

    const client = new OpenAI({
      baseURL: 'https://models.inference.ai.azure.com',
      apiKey: token,
    });

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const rawContent = completion.choices[0]?.message?.content ?? '{}';

    let parsed: DietGenerateResponse;
    try {
      parsed = JSON.parse(rawContent) as DietGenerateResponse;
    } catch {
      parsed = { suggestions: [] };
    }

    if (!Array.isArray(parsed.suggestions)) {
      parsed = { suggestions: [] };
    }

    // Sanitize each suggestion to ensure expected shape
    const suggestions: DietSuggestion[] = parsed.suggestions.map((s) => ({
      name: typeof s.name === 'string' ? s.name : 'Propozycja diety',
      ingredients: Array.isArray(s.ingredients) ? s.ingredients.map(String) : [],
      description: typeof s.description === 'string' ? s.description : '',
      feedingTips: typeof s.feedingTips === 'string' ? s.feedingTips : '',
    }));

    res.json({ suggestions } satisfies DietGenerateResponse);
  } catch (error) {
    next(error);
  }
});

export default router;
