const shopsService = require('./shops.service');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiError } = require('../../utils/ApiError');

const createShop = asyncHandler(async (req, res) => {
    const { shop_name, category, address } = req.body;
    const owner_id = req.user.id;
    const user_type = req.user.type;

    if (user_type !== 'owner') {
        throw new ApiError(403, 'Only owners can create shops');
    }

    const result = await shopsService.createShop({
        owner_id,
        shop_name,
        category,
        address
    });

    res.status(201).json({
        success: true,
        message: 'Shop created successfully',
        data: result
    });
});

const getOwnerShops = asyncHandler(async (req, res) => {
    const user_id = req.user.id;
    const user_type = req.user.type;

    let result;

    if (user_type === 'owner') {
        result = await shopsService.getShopsByOwner(user_id);
    } else if (user_type === 'cashier') {
        result = await shopsService.getShopByCashier(user_id);
    } else {
        throw new ApiError(403, 'Access denied');
    }

    res.status(200).json({
        success: true,
        message: 'Shops retrieved successfully',
        data: result
    });
});

const getShop = asyncHandler(async (req, res) => {
    const { shop_id } = req.params;
    const user_id = req.user.id;
    const user_type = req.user.type;

    const result = await shopsService.getShop({
        shop_id,
        user_id,
        user_type
    });

    res.status(200).json({
        success: true,
        message: 'Shop retrieved successfully',
        data: result
    });
});

const updateShop = asyncHandler(async (req, res) => {
    const { shop_id } = req.params;
    const { shop_name, category, address } = req.body;
    const owner_id = req.user.id;
    const user_type = req.user.type;

    if (user_type !== 'owner') {
        throw new ApiError(403, 'Only owners can update shops');
    }

    const result = await shopsService.updateShop({
        shop_id,
        owner_id,
        shop_name,
        category,
        address
    });

    res.status(200).json({
        success: true,
        message: 'Shop updated successfully',
        data: result
    });
});

const deleteShop = asyncHandler(async (req, res) => {
    const { shop_id } = req.params;
    const owner_id = req.user.id;
    const user_type = req.user.type;

    if (user_type !== 'owner') {
        throw new ApiError(403, 'Only owners can delete shops');
    }

    await shopsService.deleteShop({
        shop_id,
        owner_id
    });

    res.status(200).json({
        success: true,
        message: 'Shop deleted successfully'
    });
});

const setActiveShop = asyncHandler(async (req, res) => {
  const { shop_id } = req.params;
  const owner_id = req.user.id;

  // Ensure shop_id is a number
  const numericShopId = Number(shop_id);
  if (isNaN(numericShopId)) {
    throw new ApiError(400, 'Invalid shop ID');
  }

  const result = await shopsService.activateShop({
    shop_id: numericShopId,
    owner_id
  });

  res.status(200).json({
    success: true,
    message: 'Active shop preference updated successfully',
    data: result
  });
});

const getActivePreference = asyncHandler(async (req, res) => {
    const owner_id = req.user.id;
    // We only need this for owners, cashiers have a fixed shop
    if (req.user.type !== 'owner') {
        return res.status(200).json({ success: true, data: null });
    }

    const result = await shopsService.getActiveShopForUser(owner_id);

    res.status(200).json({
        success: true,
        message: 'Active shop preference retrieved',
        data: result // Will be null if they haven't selected one yet
    });
});

module.exports = {
    createShop,
    getOwnerShops,
    getShop,
    updateShop,
    deleteShop,
    setActiveShop,
    getActivePreference
};