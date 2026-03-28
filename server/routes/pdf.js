const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const authMiddleware = require('../middleware/authMiddleware');
const { dashboardData } = require('../data/store');

// @route   GET /api/pdf/report
// @desc    Generate and download PDF report
// @access  Private
router.get('/report', authMiddleware, (req, res) => {
    try {
        // Set headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=dashboard-report.pdf');

        // Create a new PDF document
        const doc = new PDFDocument({ margin: 50 });

        // Pipe the document directly to the response
        doc.pipe(res);

        // Add content to PDF
        doc.fontSize(25).fillColor('#3B82F6').text('Tech Startup Dashboard Report', { align: 'center' });
        doc.moveDown(2);

        doc.fontSize(16).fillColor('#111827').text(`Generated on: ${new Date().toLocaleDateString()}`);
        doc.moveDown(1);

        doc.fontSize(14).text(`Generated for: ${req.user.name}`);
        doc.moveDown(2);

        doc.fontSize(20).text('Key Statistics');
        doc.moveDown(1);

        // Draw stats table
        doc.fontSize(12);

        const stats = dashboardData.stats;
        let y = doc.y;

        // Simple table layout
        const leftMargin = 50;
        const rightSide = 300;

        doc.text('Total Users:', leftMargin, y);
        doc.text(stats.users.toString(), rightSide, y);
        y += 20;

        doc.text('Total Revenue:', leftMargin, y);
        doc.text(stats.revenue, rightSide, y);
        y += 20;

        doc.text('Active Sessions:', leftMargin, y);
        doc.text(stats.activeSessions.toString(), rightSide, y);
        y += 20;

        doc.text('Server Load:', leftMargin, y);
        doc.text(stats.serverLoad, rightSide, y);
        y += 40;

        doc.moveDown(2);
        doc.fontSize(14).text('Note: This is an automatically generated report based on in-memory mock data.', { align: 'center', color: '#6B7280' });

        // Finalize the PDF and end the stream
        doc.end();

    } catch (err) {
        console.error(err.message);
        if (!res.headersSent) {
            res.status(500).send('Server Error generating PDF');
        }
    }
});

module.exports = router;
