import { body } from 'express-validator';

export const routineValidationRules = () => {
  return [
    body('name').isString().notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('description').optional().isString()
      .isLength({ max: 200 }).withMessage('Description must be at most 200 characters'),
  ];
};