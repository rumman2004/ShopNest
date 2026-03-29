const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');
const { ApiError } = require('../../utils/ApiError');

const generateTokens = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
    
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d'
    });
    
    return { accessToken, refreshToken };
};

const registerOwner = async (data) => {
    const { full_name, email, password } = data;

    try {
        // Check if email already exists
        const [existingOwner] = await db.execute(
            'SELECT owner_id FROM owners WHERE email = ?',
            [email]
        );

        if (existingOwner.length > 0) {
            throw new ApiError(400, 'Email already registered');
        }

        // Hash password
        const saltRounds = 12;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Insert new owner
        const [result] = await db.execute(
            'INSERT INTO owners (full_name, email, password_hash) VALUES (?, ?, ?)',
            [full_name, email, password_hash]
        );

        const owner_id = result.insertId;

        // Generate tokens
        const tokenPayload = {
            id: owner_id,
            email,
            type: 'owner'
        };

        const { accessToken, refreshToken } = generateTokens(tokenPayload);

        return {
            user: {
                id: owner_id,
                full_name,
                email,
                type: 'owner'
            },
            accessToken,
            refreshToken
        };

    } catch (error) {
        throw error;
    }
};

const registerCashier = async (data) => {
    const { shop_id, full_name, username, password, owner_id } = data;

    try {
        // Verify shop ownership
        const [shop] = await db.execute(
            'SELECT shop_id FROM shops WHERE shop_id = ? AND owner_id = ?',
            [shop_id, owner_id]
        );

        if (shop.length === 0) {
            throw new ApiError(403, 'You can only register cashiers for your own shops');
        }

        // Check if username already exists
        const [existingCashier] = await db.execute(
            'SELECT cashier_id FROM cashiers WHERE username = ?',
            [username]
        );

        if (existingCashier.length > 0) {
            throw new ApiError(400, 'Username already taken');
        }

        // Hash password
        const saltRounds = 12;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Insert new cashier
        const [result] = await db.execute(
            'INSERT INTO cashiers (shop_id, full_name, username, password_hash) VALUES (?, ?, ?, ?)',
            [shop_id, full_name, username, password_hash]
        );

        const cashier_id = result.insertId;

        return {
            user: {
                id: cashier_id,
                shop_id,
                full_name,
                username,
                type: 'cashier'
            }
        };

    } catch (error) {
        throw error;
    }
};

const login = async (data) => {
    const { email, username, password } = data;

    try {
        let user, userType, userId;

        if (email) {
            // Owner login
            const [owners] = await db.execute(
                'SELECT owner_id, full_name, email, password_hash FROM owners WHERE email = ?',
                [email]
            );

            if (owners.length === 0) {
                throw new ApiError(401, 'Invalid email or password');
            }

            user = owners[0];
            userType = 'owner';
            userId = user.owner_id;
        } else if (username) {
            // Cashier login
            const [cashiers] = await db.execute(
                'SELECT cashier_id, shop_id, full_name, username, password_hash, is_active FROM cashiers WHERE username = ?',
                [username]
            );

            if (cashiers.length === 0) {
                throw new ApiError(401, 'Invalid username or password');
            }

            if (!cashiers[0].is_active) {
                throw new ApiError(401, 'Account is deactivated. Please contact your manager.');
            }

            user = cashiers[0];
            userType = 'cashier';
            userId = user.cashier_id;
        } else {
            throw new ApiError(400, 'Please provide either email or username');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid credentials');
        }

        // Generate tokens
        const tokenPayload = {
            id: userId,
            type: userType,
            ...(email && { email }),
            ...(username && { username }),
            ...(user.shop_id && { shop_id: user.shop_id })
        };

        const { accessToken, refreshToken } = generateTokens(tokenPayload);

        return {
            user: {
                id: userId,
                full_name: user.full_name,
                type: userType,
                ...(email && { email }),
                ...(username && { username }),
                ...(user.shop_id && { shop_id: user.shop_id })
            },
            accessToken,
            refreshToken
        };

    } catch (error) {
        throw error;
    }
};

const refreshToken = async (token) => {
    try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        
        // Generate new access token
        const accessToken = jwt.sign(
            {
                id: payload.id,
                type: payload.type,
                ...(payload.email && { email: payload.email }),
                ...(payload.username && { username: payload.username }),
                ...(payload.shop_id && { shop_id: payload.shop_id })
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { accessToken };

    } catch (error) {
        throw new ApiError(401, 'Invalid refresh token');
    }
};

module.exports = {
    registerOwner,
    registerCashier,
    login,
    refreshToken
};