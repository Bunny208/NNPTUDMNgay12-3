var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles')
let userModel = require('../schemas/users')

// GET - Lấy tất cả roles (không bao gồm những roles đã bị xóa mềm)
router.get('/', async function (req, res, next) {
    try {
        let data = await roleModel.find({
            isDeleted: false
        });
        res.send(data);
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
});

// GET - Lấy role theo ID
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.find({
            isDeleted: false,
            _id: id
        });
        if (result.length) {
            res.send(result[0])
        } else {
            res.status(404).send({
                message: "Role ID NOT FOUND"
            })
        }
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }
});

// POST - Tạo role mới
router.post('/', async function (req, res, next) {
    try {
        let { name, description } = req.body;
        
        if (!name) {
            return res.status(400).send({
                message: "name is required"
            })
        }

        let newRole = new roleModel({
            name,
            description: description || "",
            isDeleted: false
        });

        let result = await newRole.save();
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
});

// PUT - Cập nhật role
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let { name, description } = req.body;

        let updatedRole = {};
        if (name) updatedRole.name = name;
        if (description !== undefined) updatedRole.description = description;

        let result = await roleModel.findByIdAndUpdate(id, updatedRole, { new: true });

        if (result) {
            res.send(result);
        } else {
            res.status(404).send({
                message: "Role ID NOT FOUND"
            })
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
});

// DELETE - Xóa mềm role (soft delete)
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        
        if (result) {
            res.send({
                message: "Role deleted successfully",
                data: result
            });
        } else {
            res.status(404).send({
                message: "Role ID NOT FOUND"
            })
        }
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
});

// GET - Lấy tất cả users có role là ID được truyền lên
router.get('/:id/users', async function (req, res, next) {
    try {
        let roleId = req.params.id;
        
        // Kiểm tra role có tồn tại không
        let roleExists = await roleModel.findOne({
            _id: roleId,
            isDeleted: false
        });

        if (!roleExists) {
            return res.status(404).send({
                message: "Role ID NOT FOUND"
            })
        }

        let data = await userModel.find({
            role: roleId,
            isDeleted: false
        }).populate({
            path: 'role',
            select: 'name description'
        });

        res.send(data);
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
});

module.exports = router;
