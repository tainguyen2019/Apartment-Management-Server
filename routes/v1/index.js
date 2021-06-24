const express = require('express');
const router = express.Router();

const accountRoute = require('./account.route');
const authenticationRoute = require('./authentication.route');
const apartmentRoute = require('./apartment.route');
const vehicleRoute = require('./vehicle.route');
const staffRoute = require('./staff.route');
const deviceRoute = require('./device.route');
const absenceRoute = require('./absence.route');
const fileRouteRoute = require('./file.route');
const eventRoute = require('./event.route');
const repairRoute = require('./repair.route');
const reflectRoute = require('./reflect.route');
const departmentRoute = require('./department.route');
const positionRoute = require('./position.route');
const payslipRoute = require('./payslip.route');
const areaRoute = require('./area.route');
const shiftRoute = require('./shift.route');
const notificationRoute = require('./notification.route');
const waterIndexRoute = require('./water-index.route');
const receiptRoute = require('./receipt.route');
const roleRoute = require('./role.route');
const maintenanceRoute = require('./maintenance.route');
const arrangeRoute = require('./arrange.route');
const feeRoute = require('./fee.route');

router.use('/accounts', accountRoute);
router.use('/authentication', authenticationRoute);
router.use('/apartments', apartmentRoute);
router.use('/vehicles', vehicleRoute);
router.use('/staffs', staffRoute);
router.use('/devices', deviceRoute);
router.use('/absences', absenceRoute);
router.use('/events', eventRoute);
router.use('/repairs', repairRoute);
router.use('/reflects', reflectRoute);
router.use('/departments', departmentRoute);
router.use('/positions', positionRoute);
router.use('/payslips', payslipRoute);
router.use('/areas', areaRoute);
router.use('/shifts', shiftRoute);
router.use('/notifications', notificationRoute);
router.use('/water-index', waterIndexRoute);
router.use('/receipts', receiptRoute);
router.use('/roles', roleRoute);
router.use('/files', fileRouteRoute);
router.use('/maintenances', maintenanceRoute);
router.use('/arranges', arrangeRoute);
router.use('/fees', feeRoute);

module.exports = router;