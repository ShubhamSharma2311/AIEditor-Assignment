import { Router } from 'express';
import { getEditHistory, getEditById, deleteEdit, clearHistory } from '../controllers/historyController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Get user's edit history with pagination
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of records to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *     responses:
 *       200:
 *         description: Edit history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EditHistory'
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 hasMore:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized
 */
router.get('/', getEditHistory);

/**
 * @swagger
 * /api/history/{id}:
 *   get:
 *     summary: Get a specific edit by ID
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Edit ID
 *     responses:
 *       200:
 *         description: Edit retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 edit:
 *                   $ref: '#/components/schemas/EditHistory'
 *       404:
 *         description: Edit not found
 */
router.get('/:id', getEditById);

/**
 * @swagger
 * /api/history/{id}:
 *   delete:
 *     summary: Delete a specific edit from history
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Edit ID
 *     responses:
 *       200:
 *         description: Edit deleted successfully
 *       404:
 *         description: Edit not found
 */
router.delete('/:id', deleteEdit);

/**
 * @swagger
 * /api/history:
 *   delete:
 *     summary: Clear all edit history for the user
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Edit history cleared successfully
 */
router.delete('/', clearHistory);

export default router;
