const getNotifications = async (req, res, next) => {
    try {
        const dummyNotifications = [
            {
                id: '1',
                title: 'Daily Goal Achieved',
                description: 'Congratulations! You have completed your daily step goal of 10,000 steps.',
                read: false,
                createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: '2',
                title: 'Heart Rate Alert',
                description: 'Your resting heart rate was slightly higher than usual this morning.',
                read: true,
                createdAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: '3',
                title: 'System Update',
                description: 'BioSync Wellness has been updated to version 2.0 with new features.',
                read: false,
                createdAt: new Date(Date.now() - 172800000).toISOString()
            }
        ];

        res.status(200).json({
            success: true,
            data: dummyNotifications
        });
    } catch (error) {
        next(error);
    }
};

const markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;

        res.status(200).json({
            success: true,
            message: `Notification ${id} marked as read`
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotifications,
    markAsRead
};
