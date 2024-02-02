const Router = require('express').Router();

const itemHelper = require('../helpers/itemHelper');
const { responseError } = require('../helpers/responseHelper');
const { idValidation, itemDataValidation } = require('../helpers/validationHelper');
const { validateToken, roleAdmin } = require('../middlewares/authMiddleware')

const list = async ( req, res ) => {
    try {
        const response = await itemHelper.getItemList(res);

        return response;   
    } catch (error) {
        return responseError(res, 404, 'Cannot get item list!');
    }
};

const listByAuthor = async ( req, res ) => {

    idValidation(req.params);

    const id = parseInt(req.params['id']);

    try {
        const response = await itemHelper.getItemListByAuthor(id, res);

        return response;   
    } catch (error) {
        return responseError(res, 404, `Cannot get item list by author  id ${id}!`);
    }
};

const detail = async ( req, res ) => {

    idValidation(req.params);

    const id = parseInt(req.params['id']);

    try {
        const response = await itemHelper.getItemDetail(id, res);

        return response;   
    } catch (error) {
        return responseError(res, 404, `Cannot get item detail with id ${id}!`);
    }
};

const add = async ( req, res ) => {
    try {
        itemDataValidation(req.body);

        const { name, price, stock, author_id } = req.body;

        const response = await itemHelper.postDataItem({ name, price, stock, author_id }, res);

        return response;   
    } catch (error) {
        return responseError(res, 404, `Cannot add item!`);
    }
};

const update = async ( req, res ) => {

    idValidation(req.params);

    const id = parseInt(req.params['id']);

    try {
        itemDataValidation(req.body);
        const { name, price, stock, author_id } = req.body;

        const response = await itemHelper.updateDataItem({ id, name, price, stock, author_id }, res);

        return response;   
    } catch (error) {
        return responseError(res, 404, `Cannot find item with id ${id}!`);
    }
};

const remove = async ( req, res ) => {

    idValidation(req.params);

    const id = parseInt(req.params['id']);

    try {

        const response = await itemHelper.deleteDataItem(id, res);

        return response;   
    } catch (error) {
        return responseError(res, 404, `Cannot find item with id ${id}!`);
    }
};

Router.get('/', validateToken, list);
Router.get('/author/:id', validateToken, roleAdmin, listByAuthor);
Router.get('/detail/:id', validateToken, detail);
Router.post('/add', validateToken, roleAdmin, add);
Router.put('/update/:id', validateToken, roleAdmin, update);
Router.delete('/remove/:id', validateToken, roleAdmin, remove)

module.exports = Router;    