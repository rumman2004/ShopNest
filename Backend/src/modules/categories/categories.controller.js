const categoriesService = require('./categories.service');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiError } = require('../../utils/ApiError');

const getCategoriesByShop = asyncHandler(async (req, res) => {
    const { shop_id } = req.params;
    const user_id = req.user.id;
    const user_type = req.user.type;

    const result = await categoriesService.getCategoriesByShop({
        shop_id,
        user_id,
        user_type
    });

    res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: result
    });
});

const createCategory = asyncHandler(async (req, res) => {
    const { shop_id, category_name, description } = req.body;
    const user_id = req.user.id;
    const user_type = req.user.type;

    const result = await categoriesService.createCategory({
        shop_id,
        category_name,
        description,
        user_id,
        user_type
    });

    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: result
    });
});

const updateCategory = asyncHandler(async (req, res) => {
    const { category_id } = req.params;
    const { category_name, description } = req.body;
    const user_id = req.user.id;
    const user_type = req.user.type;

    const result = await categoriesService.updateCategory({
        category_id,
        category_name,
        description,
        user_id,
        user_type
    });

    res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: result
    });
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { category_id } = req.params;
    const user_id = req.user.id;
    const user_type = req.user.type;

    await categoriesService.deleteCategory({
        category_id,
        user_id,
        user_type
    });

    res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
    });
});

module.exports = {
    getCategoriesByShop,
    createCategory,
    updateCategory,
    deleteCategory
};