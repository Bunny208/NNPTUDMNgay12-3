var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users')

// GET - Lấy tất cả users (không bao gồm những users đã bị xóa mềm)
router.get('/', async function (req, res, next) {
    try {
        let data = await userModel.find({
            isDeleted: false
        }).populate({
            path: 'role',
            select: 'name description'
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
});

// GET - Lấy user theo ID
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.find({
            isDeleted: false,
            _id: id
        }).populate({
            path: 'role',
            select: 'name description'
        });
        if (result.length) {
            res.send(result[0])
        } else {
            res.status(404).send({
                message: "User ID NOT FOUND"
            })
        }
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }
});

// POST - Tạo user mới
router.post('/', async function (req, res, next) {
    try {
        let { username, password, email, fullName, avatarUrl, role } = req.body;
        
        if (!username || !password || !email) {
            return res.status(400).send({
                message: "username, password, email are required"
            })
        }

        let newUser = new userModel({
            username,
            password,
            email,
            fullName: fullName || "",
            avatarUrl: avatarUrl || "https://i.sstatic.net/l60Hf.png",
            role,
            status: false,
            loginCount: 0,
            isDeleted: false
        });

        let result = await newUser.save();
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
});

// PUT - Cập nhật user
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let { username, password, email, fullName, avatarUrl, role, loginCount } = req.body;

        let updatedUser = {};
        if (username) updatedUser.username = username;
        if (password) updatedUser.password = password;
        if (email) updatedUser.email = email;
        if (fullName !== undefined) updatedUser.fullName = fullName;
        if (avatarUrl) updatedUser.avatarUrl = avatarUrl;
        if (role) updatedUser.role = role;
        if (loginCount !== undefined) updatedUser.loginCount = loginCount;

        let result = await userModel.findByIdAndUpdate(id, updatedUser, { new: true }).populate({
            path: 'role',
            select: 'name description'
        });

        if (result) {
            res.send(result);
        } else {
            res.status(404).send({
                message: "User ID NOT FOUND"
            })
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
});

// DELETE - Xóa mềm user (soft delete)
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        
        if (result) {
            res.send({
                message: "User deleted successfully",
                data: result
            });
        } else {
            res.status(404).send({
                message: "User ID NOT FOUND"
            })
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
});

// POST - Enable user (status = true)
router.post('/enable', async function (req, res, next) {
    try {
        let { email, username } = req.body;

        if (!email || !username) {
            return res.status(400).send({
                message: "email and username are required"
            })
        }

        let result = await userModel.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: true },
            { new: true }
        ).populate({
            path: 'role',
            select: 'name description'
        });

        if (result) {
            res.send({
                message: "User enabled successfully",
                data: result
            });
        } else {
            res.status(404).send({
                message: "User with this email and username NOT FOUND"
            })
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
});

// POST - Disable user (status = false)
router.post('/disable', async function (req, res, next) {
    try {
        let { email, username } = req.body;

        if (!email || !username) {
            return res.status(400).send({
                message: "email and username are required"
            })
        }

        let result = await userModel.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: false },
            { new: true }
        ).populate({
            path: 'role',
            select: 'name description'
        });

        if (result) {
            res.send({
                message: "User disabled successfully",
                data: result
            });
        } else {
            res.status(404).send({
                message: "User with this email and username NOT FOUND"
            })
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
});

module.exports = router;
