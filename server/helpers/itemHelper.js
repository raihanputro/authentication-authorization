const _ = require('lodash');
const db = require('../../models');
const tb_item = db.item;
const tb_user = db.user;
const { responseSuccess, responseError } = require('../helpers/responseHelper');

const fileName = 'server/api/itemHelper.js';

const getItemList = async (res) => {
    try {
        const items = await tb_item.findAll();

        return Promise.resolve(responseSuccess(res, 200, `Success get item list`, items));
    } catch (error) {
        console.log([fileName, 'getItemList', 'ERROR'], { info: `${error}` });
        return Promise.reject(responseError(res, 404, `Cannot get item list!`)); 
    }
};

const getItemListByAuthor = async (id, res) => {
    try {
        const isAdmin = await tb_user.findOne({
            where: {
                id: id,
                role: 'admin'
            }
        });

        if(_.isEmpty(isAdmin)) {
            return Promise.reject(responseError(res, 400, 'this user id is not admin!'))
        } else {
            const itemsByAuthor = await tb_item.findAll({
                where: {
                    author_id: id
                },
                include: {
                    model: tb_user,
                    as: 'author',
                    attributes: ['username'],
                    required: false
                }
            });
            return Promise.resolve(responseSuccess(res, 200, `Success get item list by author id ${id}`, itemsByAuthor));
        }
    } catch (error) {
        console.log([fileName, 'postDataItem', 'ERROR'], { info: `${error}` });
        return Promise.reject(responseError(res, 404, `Cannot get item list by author id ${id}!`)); 
    }
};

const getItemDetail = async (id, res) => {
    try {
        const itemDetail = await tb_item.findOne({
            where: {
                id: id
            }
        });

        return Promise.resolve(responseSuccess(res, 200, `Success get item detail by id ${id}`, itemDetail));
    } catch (error) {
        console.log([fileName, 'getItemDetail', 'ERROR'], { info: `${error}` });
        return Promise.reject(responseError(res, 404, `Cannot get item detail by id ${id}!`)); 
    }
};

const postDataItem = async (dataObject, res) => {
    const { name, price, stock, author_id } = dataObject;

    try {
        const isAdmin = await tb_user.findOne({
            where: {
                id: author_id,
                role: 'admin'
            }
        });

        if(_.isEmpty(isAdmin)) {
            return Promise.reject(responseError(res, 400, 'You are not admin!'))
        } else {
            await tb_item.create({ name, price, stock, author_id });
        }

        const items = await tb_item.findAll();

        return Promise.resolve(responseSuccess(res, 200, `Success add ${name}`, items));
    } catch (error) {
        console.log([fileName, 'postDataItem', 'ERROR'], { info: `${error}` });
        return Promise.resolve(responseError(res, 400, 'Cannot add item!')); 
    }
};

const updateDataItem = async (dataObject, res) => {
    const { id, name, price, stock, author_id } = dataObject;

    try {

        const checkItem = await tb_item.findOne({
            where: {
                id: id
            }
        });


        if(_.isEmpty(checkItem)) {
            return Promise.reject(responseError(res, 404, `Cannot find item with id ${id}!`));
        } else {
            await tb_item.update({
                name: name,
                price: price,
                stock: stock,
                author_id: author_id
            }, {
                where: {
                    id: id
                }
            });

            const updatedItem = await tb_item.findOne({
                where: {
                    id: id
                }
            });

            return Promise.resolve(responseSuccess(res, 200, `Success update item ${name}`, updatedItem));
        };
    } catch (error) {
        console.log([fileName, 'updateDataItem', 'ERROR'], { info: `${error}` });
        return Promise.reject(responseError(res, 400, `Cannot update item by id ${id}!`)); 
    }
};

const deleteDataItem = async (id, res) => {
    try {
        const checkItem = await tb_item.findOne({
            where: {
                id: id
            }
        });

        if(_.isEmpty(checkItem)) {
            return Promise.reject(responseError(res, 404, `Cannot find item with id ${id}!`));
        } else {
            await tb_item.destroy({
                where: {
                    id: id
                }
            });
        };

        const items = await tb_item.findAll();

        return Promise.resolve(responseSuccess(res, 200, `Success delete item with id ${id}`, items));
    } catch (error) {
        console.log([fileName, 'deleteDataItem', 'ERROR'], { info: `${error}` });
        return Promise.reject(responseError(res, 400, `Cannot delete item by id ${id}!`)); 
    }
};

module.exports = {
    getItemList,
    getItemListByAuthor,
    getItemDetail,
    postDataItem,
    updateDataItem,
    deleteDataItem
}