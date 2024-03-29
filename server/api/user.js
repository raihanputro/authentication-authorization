const Router = require('express').Router();

const authHelper = require('../helpers/authHelper');
const userHelper = require('../helpers/userHelper');
const { responseSuccess, responseError } = require('../helpers/responseHelper');
const { idValidation, userDataValidation } = require('../helpers/validationHelper');
const AuthMiddleware = require('../middlewares/authMiddleware');

const list = async ( req, res ) => {
    try {
        const response = await userHelper.getUserList();

        return responseSuccess(res, 200, 'Success get user list!', response);
    } catch (error) {
        return responseError(res, 404, 'Cannot get user list!');
    }
};

const listByRole = async ( req, res ) => {
    try {
        const role = req.params['role'].toLowerCase();

        const response = await userHelper.getUserListByRole(role);

        return responseSuccess(res, 200, `Success get user list by role ${role}!`, response);
    } catch (error) {
        return responseError(res, 404, `Cannot get user list! by role ${role}!`);
    }
};

const detail = async ( req, res ) => {
    try {

        idValidation(req.params);

        const id = parseInt(req.params['id']);

        const response = await userHelper.getUserDetail(id);

        return responseSuccess(res, 200, 'Success get user detail!', response);
    } catch (error) {
        return responseError(res, 404, 'Cannot get user detail!');
    }
};

const register = async ( req, res ) => {
    try {
        userDataValidation(req.body);

        const { email, password, username, address, phone, role } = req.body;

        const response = await authHelper.registerUser({ email, password, username, address, phone, role });

        return responseSuccess(res, 200, `${email} are registered!`, response);
    } catch (error) {
        return responseError(res, 404, 'Cannot register user!');
    }
};

const login = async ( req, res ) => {
    try {
        const { email, password } = req.body;

        const response = await authHelper.loginUser({ email, password });

        return responseSuccess(res, 200, `${email} are login!`, response);
    } catch (error) {
        return responseError(res, 404, 'Cannot login!');
    }
};

const profile = async ( req, res ) => {
    try {
        const { verifiedUser } = req.body;

        const response = await authHelper.profileUser(verifiedUser.email);

        return responseSuccess(res, 200, `${verifiedUser.email} profile!`, response);
    } catch (error) {
        return responseError(res, 404, 'Cannot get profile!');
    }
}

const changePassword = async ( req, res ) => {
    try {
        const { verifiedUser, new_password, confirm_password } = req.body;

        const response = await authHelper.changePassword({ email: verifiedUser.email, new_password, confirm_password });

        return responseSuccess(res, 200, `${verifiedUser.email} password changed!`, response);
    } catch (error) {
        return responseError(res, 404, 'Cannot change password!');
    }
};

const forgotPassword = async ( req, res ) => {
    try {
        const { email } = req.body;

        const response = await authHelper.getOtpForgotPassword({email});

        return responseSuccess(res, 200, `${email} has sended code otp!`, response);
    } catch (error) {
        return responseError(res, 404, 'Cannot forgot password!');
    }
};

const resetPassword = async ( req, res ) => {
    try {
        const { email, code_otp, new_password, confirm_password } = req.body;

        const response = await authHelper.resetPassword({email, code_otp, new_password, confirm_password});

        return responseSuccess(res, 200, `${email} password changed!`, response);
    } catch (error) {
        return responseError(res, 404, 'Cannot reset password!');
    }
};

const update = async ( req, res ) => {
    try {
        idValidation(req.params);

        const id = parseInt(req.params['id']);

        const { email, password, username, address, phone, role } = req.body;

        const response = await userHelper.updateDataUser({id, email, password, username, address, phone, role });

        return responseSuccess(res, 200, 'Success update user!', response);
    } catch (error) {
        return responseError(res, 404, 'Cannot update user!');
    }
}

const remove = async ( req, res ) => {
    try {
        idValidation(req.params);

        const id = parseInt(req.params['id']);

        const response = await userHelper.deleteDataUser(id);

        return responseSuccess(res, 200, 'Success remove user!', response);
    } catch (error) {
        return responseError(res, 404, 'Cannot remove user!');
    }
};

Router.post('/register', register);
Router.post('/login', login);
Router.get('/profile', AuthMiddleware.validateToken, profile);
Router.patch('/change-password', AuthMiddleware.validateToken, changePassword);
Router.post('/forgot-password', forgotPassword);
Router.patch('/reset-password', resetPassword);
Router.get('/list', AuthMiddleware.validateToken, AuthMiddleware.roleAdmin, list);
Router.get('/role/:role', AuthMiddleware.validateToken, AuthMiddleware.roleAdmin, listByRole);
Router.get('/detail/:id', AuthMiddleware.validateToken, AuthMiddleware.roleAdmin, detail);
Router.put('/update/:id', AuthMiddleware.validateToken, AuthMiddleware.roleAdmin, update);
Router.delete('/remove/:id', AuthMiddleware.validateToken, AuthMiddleware.roleAdmin, remove);

module.exports = Router;