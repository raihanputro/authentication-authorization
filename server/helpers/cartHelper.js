const _ = require('lodash');
const db = require('../../models');
const tb_cart = db.cart;
const tb_user = db.user;
const { responseSuccess, responseError } = require('../helpers/responseHelper');

const fileName = 'server/api/cartHelper.js';

const getCartList = async (res) => {
    try {
        const carts = await tb_cart.findAll({
            include: ['customer', 'item'],
        });

        return Promise.resolve(responseSuccess(res, 200, `Success get cart list`, carts));
    } catch (error) {
        console.log([fileName, 'getCartList', 'ERROR'], { info: `${error}` });
        return Promise.reject(responseError(res, 404, `Cannot get cart list!`)); 
    }
};

const getCartDetail = async (id, res) => {
    try {
        const cartDetail = await tb_cart.findOne({
            where: {
                id: id
            },
            include: ['customer', 'item'],
        });

        return Promise.resolve(responseSuccess(res, 200, `Success get cart detail by id ${id}`, cartDetail));
    } catch (error) {
        console.log([fileName, 'getItemDetail', 'ERROR'], { info: `${error}` });
        return Promise.reject(responseError(res, 404, `Cannot get cart detail by id ${id}!`)); 
    }
};

const postDataCart = async (dataObject, res) => {
    const { user_id, item_id, qty } = dataObject;

    try {
        const isCustomer = await tb_user.findOne({
            where: {
                id: user_id,
                role: 'customer'
            }
        });

        if(_.isEmpty(isCustomer)) {
            return Promise.reject(responseError(res, 400, 'You are not customer!'))
        } else {
            await tb_cart.create({ user_id, item_id, qty });
        }

        const carts = await tb_cart.findAll({
            include: ['customer', 'item'],
        });

        return Promise.resolve(responseSuccess(res, 200, `Success add cart`, carts));
    } catch (error) {
        console.log([fileName, 'postDataCart', 'ERROR'], { info: `${error}` });
        return Promise.reject   (responseError(res, 400, 'Cannot add cart!')); 
    }
};

const updateDataCart = async (dataObject, res) => {
    const { id, user_id, item_id, qty } = dataObject;

    try {

        const checkCart = await tb_cart.findOne({
            where: {
                id: id
            }
        });


        if(_.isEmpty(checkCart)) {
            return Promise.reject(responseError(res, 404, `Cannot find cart with id ${id}!`));
        } else {
            await tb_cart.update({
                user_id: user_id,
                item_id: item_id,
                qty: qty,
            }, {
                where: {
                    id: id
                }
            });

            const updatedCart = await tb_cart.findOne({
                where: {
                    id: id
                },
                include: ['customer', 'item'],
            });

            return Promise.resolve(responseSuccess(res, 200, `Success update item ${id}`, updatedCart));
        };
    } catch (error) {
        console.log([fileName, 'updateDataCart', 'ERROR'], { info: `${error}` });
        return Promise.reject(responseError(res, 400, `Cannot update cart by id ${id}!`)); 
    }
};

const deleteDataCart = async (id, res) => {
    try {
        const checkCart = await tb_cart.findOne({
            where: {
                id: id
            }
        });

        if(_.isEmpty(checkCart)) {
            return Promise.reject(responseError(res, 404, `Cannot find cart with id ${id}!`));
        } else {
            await tb_cart.destroy({
                where: {
                    id: id
                }
            });
        };

        const carts = await tb_cart.findAll({
            include: ['customer', 'item'],
        });
        return Promise.resolve(responseSuccess(res, 200, `Success delete cart with id ${id}`, carts));
    } catch (error) {
        console.log([fileName, 'deleteDataItem', 'ERROR'], { info: `${error}` });
        return Promise.reject(responseError(res, 400, `Cannot delete cart by id ${id}!`)); 
    }
};

module.exports = {
    getCartList,
    getCartDetail,
    postDataCart,
    updateDataCart,
    deleteDataCart
}