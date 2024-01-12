import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const product = await collection.find({}).limit(10).toArray();
    return res.json({ data: product });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id); // id จาก endpoint param
    // หาข้อมูล _id ที่ ต้องการ คือ productID โดยหาแค่ 1 ข้อมูล จึงใช้ findOne
    const getProductById = await collection.findOne({ _id: productId });
    return res.json({ data: getProductById });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const productData = { ...req.body }; // ข้อมูลที่มาจาก Request body
    const collection = db.collection("products");
    await collection.insertOne(productData); // เพิ่มข้อมูลเข้าไปใน db
    return res.json({ message: `Product has been created successfully` });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

productRouter.put("/:id", async (req, res) => {
  try {
    const updateProduct = { ...req.body }; // ข้อมูลที่ส่งมาจาก request body
    const collection = db.collection("products"); // เลือก database
    const productId = new ObjectId(req.params.id); // id จาก endpoint param
    await collection.updateOne({ _id: productId }, { $set: updateProduct });
    return res.json({ message: "Product has been updated successfully" });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

productRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);
    await collection.deleteOne({ _id: productId });
    return res.json({ message: "Product has been deleted successfully" });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

export default productRouter;
