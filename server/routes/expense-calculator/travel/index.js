;(function(){
  'use strict';

  const controller = require('./travel.controller');
  const auth = require('../../../components/auth');

  module.exports = function(app) {
    app.get('/expense-calculator/travel', 'expense.calculator.travel.get', auth.validExpenseCalcSession, controller.index(app));
    app.post('/expense-calculator/travel', 'expense.calculator.travel.post', auth.validExpenseCalcSession, controller.create(app));
    app.get('/expense-calculator/travel/change', 'expense.calculator.travel.change.get', auth.validExpenseCalcSession, controller.change(app));

    app.get('/expense-calculator/travel/bicycle', 'expense.calculator.travel.bicycle.get', auth.validExpenseCalcSession, controller.getBicycle(app));
    app.post('/expense-calculator/travel/bicycle', 'expense.calculator.travel.bicycle.post', auth.validExpenseCalcSession, controller.createBicycle(app));
    app.get('/expense-calculator/travel/bicycle/change', 'expense.calculator.travel.bicycle.change.get', auth.validExpenseCalcSession, controller.changeBicycle(app));

    app.get('/expense-calculator/travel/car', 'expense.calculator.travel.car.get', auth.validExpenseCalcSession, controller.getCar(app));
    app.post('/expense-calculator/travel/car', 'expense.calculator.travel.car.post', auth.validExpenseCalcSession, controller.createCar(app));
    app.get('/expense-calculator/travel/car/change', 'expense.calculator.travel.car.change.get', auth.validExpenseCalcSession, controller.changeCar(app));

    app.get('/expense-calculator/travel/motorcycle', 'expense.calculator.travel.motorcycle.get', auth.validExpenseCalcSession, controller.getMotorcycle(app));
    app.post('/expense-calculator/travel/motorcycle', 'expense.calculator.travel.motorcycle.post', auth.validExpenseCalcSession, controller.createMotorcycle(app));
    app.get('/expense-calculator/travel/motorcycle/change', 'expense.calculator.travel.motorcycle.change.get', auth.validExpenseCalcSession, controller.changeMotorcycle(app));

    app.get('/expense-calculator/travel/public-transport', 'expense.calculator.travel.public.transport.get', auth.validExpenseCalcSession, controller.getPublicTransport(app));
    app.post('/expense-calculator/travel/public-transport', 'expense.calculator.travel.public.transport.post', auth.validExpenseCalcSession, controller.createPublicTransport(app));
    app.get('/expense-calculator/travel/public-transport/change', 'expense.calculator.travel.public.transport.change.get', auth.validExpenseCalcSession, controller.changePublicTransport(app));

    app.get('/expense-calculator/travel/parking', 'expense.calculator.travel.parking.get', auth.validExpenseCalcSession, controller.getParking(app));
    app.post('/expense-calculator/travel/parking', 'expense.calculator.travel.parking.post', auth.validExpenseCalcSession, controller.createParking(app));

    app.get('/expense-calculator/travel/parking/info', 'expense.calculator.travel.parking.info.get', auth.validExpenseCalcSession, controller.getParkingInfo(app));
    app.post('/expense-calculator/travel/parking/info', 'expense.calculator.travel.parking.info.post', auth.validExpenseCalcSession, controller.createParkingInfo(app));
  };

})();
