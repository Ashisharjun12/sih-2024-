import User from '@/models/user.model';
import Notification from '@/models/notification.model';
interface NotificationData {
    name: string;
    message: string;
    role: string;
}

export const fetchNotifications = async (userId: string) => {
    const user = await User.findById(userId).populate('notifications');
    if (!user) {
        throw new Error('User not found');
    }
    return user.notifications;
};

export const addNotification = async (notificationData: NotificationData, userId: string) => {
    const notification = new Notification({
        name: notificationData.name,
        message: notificationData.message,
        role: notificationData.role,
    });
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    user.notifications.push(notification._id);
    await notification.save();
    await user.save();
    return notification;
};