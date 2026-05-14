const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
});

// Add category
router.post("/add", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }
        const category = new Category({ name });
        await category.save();
        res.status(201).json({ message: "Category added successfully", category });
    } catch (error) {
        res.status(500).json({ message: "Error adding category", error: error.message });
    }
});

// Delete category
router.delete("/:id", async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully", category });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error: error.message });
    }
});

module.exports = router;