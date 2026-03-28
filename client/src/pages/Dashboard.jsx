import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Users, DollarSign, Activity, Server,
    Download, Menu, X, Home, Settings, PieChart
} from 'lucide-react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import PageTransition from '../components/PageTransition';
import { useAppContext } from '../context/AppContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatCard = ({ title, value, icon, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass p-6 rounded-2xl border-l-4 border-primary hover:bg-white/5 transition-colors"
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold mt-2 text-white">{value}</h3>
            </div>
            <div className="p-3 bg-white/5 rounded-xl text-primary">
                {icon}
            </div>
        </div>
    </motion.div>
);

const SkeletonCard = () => (
    <div className="glass p-6 rounded-2xl animate-pulse">
        <div className="flex justify-between items-start">
            <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded w-20"></div>
                <div className="h-8 bg-white/10 rounded w-32"></div>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
        </div>
    </div>
);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { token, user } = useAppContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/dashboard-data', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (err) {
                console.error('Error fetching dashboard data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const handleDownloadPDF = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/pdf/report', {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            // Create a blob URL and trigger download
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'nexus-report.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Error generating PDF', err);
            alert('Failed to generate PDF report.');
        }
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: 'rgba(255, 255, 255, 0.7)' } },
            title: { display: false }
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            },
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: 'rgba(255, 255, 255, 0.7)' }
            }
        }
    };

    const menuItems = [
        { icon: <BarChart />, label: 'Overview', active: true },
        { icon: <Users />, label: 'Users' },
        { icon: <PieChart />, label: 'Analytics' },
        { icon: <Settings />, label: 'Settings' },
    ];

    return (
        <PageTransition>
            <div className="min-h-screen bg-dark-bg pt-16 flex">

                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {!isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="md:hidden fixed inset-0 bg-black/50 z-40"
                            onClick={() => setSidebarOpen(true)}
                        />
                    )}
                </AnimatePresence>

                {/* Sidebar */}
                <motion.aside
                    initial={false}
                    animate={{
                        width: isSidebarOpen ? 250 : 80,
                        x: isSidebarOpen ? 0 : (window.innerWidth < 768 ? -250 : 0)
                    }}
                    className={`fixed md:sticky top-16 h-[calc(100vh-4rem)] z-40 glass-dark border-r border-white/10 flex flex-col transition-all duration-300 ${!isSidebarOpen && 'md:items-center'}`}
                >
                    <div className="p-4 flex justify-between items-center border-b border-white/10">
                        {isSidebarOpen && <span className="font-semibold text-gray-300 uppercase tracking-wider text-sm hidden md:block">Main Menu</span>}
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex-1 py-4 flex flex-col gap-2 px-3">
                        {menuItems.map((item, i) => (
                            <button
                                key={i}
                                className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors ${item.active ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                title={!isSidebarOpen ? item.label : ''}
                            >
                                <div className={`${!isSidebarOpen ? 'mx-auto' : ''}`}>{item.icon}</div>
                                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                            </button>
                        ))}
                    </nav>

                    {isSidebarOpen && (
                        <div className="p-4 border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                                    {user?.name.charAt(0) || 'U'}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.aside>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                                <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDownloadPDF}
                                className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary px-4 py-2 rounded-xl text-white transition-all self-start md:self-auto shadow-lg"
                            >
                                <Download className="w-4 h-4" /> Download Report
                            </motion.button>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {loading ? (
                                Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
                            ) : (
                                <>
                                    <StatCard title="Total Users" value={data?.stats.users.toLocaleString()} icon={<Users />} index={0} />
                                    <StatCard title="Revenue" value={data?.stats.revenue} icon={<DollarSign />} index={1} />
                                    <StatCard title="Active Sessions" value={data?.stats.activeSessions} icon={<Activity />} index={2} />
                                    <StatCard title="Server Load" value={data?.stats.serverLoad} icon={<Server />} index={3} />
                                </>
                            )}
                        </div>

                        {/* Charts Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="lg:col-span-2 glass p-6 rounded-3xl min-h-[400px]"
                            >
                                <h3 className="text-xl font-bold mb-6 text-white">User Growth Analytics</h3>
                                <div className="h-[300px] w-full">
                                    {loading ? (
                                        <div className="w-full h-full bg-white/5 rounded-xl animate-pulse flex items-center justify-center">
                                            <BarChart className="w-12 h-12 text-white/20" />
                                        </div>
                                    ) : (
                                        <Bar
                                            data={{
                                                labels: data?.chartData.labels,
                                                datasets: [
                                                    {
                                                        label: 'User Signups (k)',
                                                        data: data?.chartData.datasets[0].data,
                                                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                                                        borderRadius: 6,
                                                    }
                                                ]
                                            }}
                                            options={chartOptions}
                                        />
                                    )}
                                </div>
                            </motion.div>

                            {/* Recent Activity placeholder sidebar */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="glass p-6 rounded-3xl"
                            >
                                <h3 className="text-xl font-bold mb-6 text-white">System Events</h3>
                                <div className="space-y-4">
                                    {[
                                        { title: "Database Backup Completed", time: "10 mins ago", color: "bg-green-500" },
                                        { title: "New API Key Generated", time: "1 hour ago", color: "bg-blue-500" },
                                        { title: "High CPU Usage Alert", time: "2 hours ago", color: "bg-yellow-500" },
                                        { title: "Failed Login Attempt", time: "5 hours ago", color: "bg-red-500" },
                                    ].map((event, i) => (
                                        <div key={i} className="flex gap-4 items-start p-3 hover:bg-white/5 rounded-xl transition-colors">
                                            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full ${event.color}`}></div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-200">{event.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </main>
            </div>
        </PageTransition>
    );
};

export default Dashboard;
