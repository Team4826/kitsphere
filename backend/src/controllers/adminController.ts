import { Response } from 'express';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export async function getDashboardStats(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    const totalUsers = await User.countDocuments({
      role: 'student',
    });

    const totalAdmins = await User.countDocuments({
      role: 'admin',
    });

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const newUsersToday = await User.countDocuments({
      role: 'student',
      createdAt: {
        $gte: today,
      },
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        newUsersToday,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to load dashboard statistics.',
    });
  }
}

export async function getUsers(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    const search =
      typeof req.query.search === 'string'
        ? req.query.search.trim()
        : '';

    const filter: Record<string, unknown> = {
      role: 'student',
    };

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          email: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          rollNumber: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }

    const users = await User.find(filter)
      .select(
        '_id name section email rollNumber phone role createdAt updatedAt',
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Get users error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to load users.',
    });
  }
}

export async function getUserById(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      role: 'student',
    }).select(
      '_id name section email rollNumber phone role createdAt updatedAt',
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get user error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to load student details.',
    });
  }
}