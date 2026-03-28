// In-memory data store structure

const users = [
    {
        id: '1',
        email: 'admin@techstartup.com',
        password: 'password123', // Hardcoded as requested
        name: 'Admin User'
    }
];

const submissions = [];

const dashboardData = {
    stats: {
        users: 1245,
        revenue: '$45,230',
        activeSessions: 342,
        serverLoad: '42%'
    },
    chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'User Growth',
                data: [12, 19, 3, 5, 2, 3],
            },
        ],
    }
};

module.exports = {
    users,
    submissions,
    dashboardData
};
