import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("products"); // เลือก database
    // กำหนด limit ว่ารับ limit จาก client ถ้า Number(req.query.limit) เป็น null ค่า limit จะเป็น 10
    const limit = Number(req.query.limit) ?? 10;
    const page = Number(req.query.page); // รับ page จาก client สำหรับทำ pagination
    // Query Parameter ที่ทำให้ Client สามารถที่จะกำหนด Category ของสินค้าเข้ามาเพื่อขอดูข้อมูลสินค้าที่อยู่ใน Category
    const category = req.query.category;
    // Query Parameter ที่ทำให้ Client สามารถที่จะกำหนดข้อความเข้ามาค้นหาสินค้าจากชื่อสินค้าได้
    const keywords = req.query.keywords;
    const created_date = new Date(); // declare ขึ้นมาเพื่อรับค่าวันเวลา
    const query = {}; // declare query object
    // logic ที่บอกว่า ถ้ามี query parameter category/keyword เข้ามา ก็ให้สร้าง key ใหม่เข้าไปใน object ของ query
    if (category) {
      query.category = new RegExp(category, "i");
    }
    if (keywords) {
      query.name = new RegExp(keywords, "i"); // คำสั่งที่ทำให้ค้นหาได้โดยที่ไม่สนใจว่าเป็นตัวอักษรพิมพ์ใหญ่หรือเล็ก
    }
    const product = await collection
      .find(query)
      .skip(limit * page) // ทำให้ข้ามข้อมูลที่แสดงไปแล้วในแต่ละหน้า ของ pagination
      .sort({ created_date: -1 }) // ใช้เรียงลำดับข้อมูลโดยเรียงจากวันเวลาล่าสุดไปเก่าสุด
      .limit(limit)
      .toArray();
    return res.json({ data: product });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
  // try {
  //   const collection = db.collection("products");
  //   const product = await collection.find({}).limit(10).toArray();
  //   return res.json({ data: product });
  // } catch (error) {
  //   return res.json({ message: `${error}` });
  // }
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
    const created_date = new Date(); // declare ขึ้นมารับค่าวันเวลา
    const collection = db.collection("products");
    await collection.insertOne({ ...productData, created_date }); // เพิ่มข้อมูลเข้าไปใน db โดยจะเพิ่มข้อมูลจาก client และวันเวลาเข้าไป
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
