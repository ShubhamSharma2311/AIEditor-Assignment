import { Response } from 'express';
import { EditHistory } from '../models/EditHistory';
import { AuthRequest } from '../middleware/auth';

// Get user's edit history
export const getEditHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    console.log('Fetching history for user:', userId);
    const { limit = 20, skip = 0 } = req.query;

    const history = await EditHistory.find({ userId })
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .select('-__v');

    const total = await EditHistory.countDocuments({ userId });
    
    console.log(`Found ${history.length} edits out of ${total} total`);

    res.status(200).json({
      history,
      total,
      hasMore: total > Number(skip) + history.length
    });
  } catch (error: any) {
    console.error('Get edit history error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve edit history',
      details: error.message 
    });
  }
};

// Get single edit by ID
export const getEditById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const edit = await EditHistory.findOne({ _id: id, userId });
    
    if (!edit) {
      res.status(404).json({ error: 'Edit not found' });
      return;
    }

    res.status(200).json({ edit });
  } catch (error: any) {
    console.error('Get edit by ID error:', error);
    res.status(500).json({ error: 'Failed to retrieve edit' });
  }
};

// Delete an edit from history
export const deleteEdit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const result = await EditHistory.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Edit not found' });
      return;
    }

    res.status(200).json({ message: 'Edit deleted successfully' });
  } catch (error: any) {
    console.error('Delete edit error:', error);
    res.status(500).json({ error: 'Failed to delete edit' });
  }
};

// Clear all edit history for user
export const clearHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    await EditHistory.deleteMany({ userId });

    res.status(200).json({ message: 'Edit history cleared successfully' });
  } catch (error: any) {
    console.error('Clear history error:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
};
