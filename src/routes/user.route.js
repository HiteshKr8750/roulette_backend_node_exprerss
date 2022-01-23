const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createUserSchema, updateUserSchema, validateLogin, validateRegister } = require('../middleware/validators/userValidator.middleware');

router.get('/',auth(Role.SuperAdmin),awaitHandlerFactory(userController.getActiveUsers));
router.get('/active', auth(Role.SuperAdmin), awaitHandlerFactory(userController.getActiveUsers)); // localhost:3000/api/v1/users
router.get('/in-active', auth(Role.SuperAdmin), awaitHandlerFactory(userController.getInactiveUsers)); // localhost:3000/api/v1/users
router.get('/id/:id', auth(Role.SuperAdmin), awaitHandlerFactory(userController.getUserById)); // localhost:3000/api/v1/users/id/1
router.get('/username/:username', auth(), awaitHandlerFactory(userController.getUserByuserName)); // localhost:3000/api/v1/users/usersname/julia
router.get('/whoami', auth(), awaitHandlerFactory(userController.getCurrentUser)); // localhost:3000/api/v1/users/whoami
router.patch('/id/:id', auth(Role.SuperAdmin), updateUserSchema, awaitHandlerFactory(userController.updateUser)); // localhost:3000/api/v1/users/id/1 , using patch for partial update
router.delete('/id/:id', auth(Role.SuperAdmin), awaitHandlerFactory(userController.deleteUser)); // localhost:3000/api/v1/users/id/1

router.post('/login', validateLogin, awaitHandlerFactory(userController.userLogin)); // localhost:3000/api/v1/users/login
router.post('/register',auth(Role.SuperAdmin),validateRegister,awaitHandlerFactory(userController.createUser));

module.exports = router;            