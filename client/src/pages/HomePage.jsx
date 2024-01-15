import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [category, setCategory] = useState(""); // state ของ category ในการ set query paramater category และ set ช่อง view category
  const [keywords, setKeywords] = useState(""); // state ของ keyword ในการ set query parameter keywords และ set ช่อง search
  const [pages, setPages] = useState(0); // state ของ pagination โดย set ให้หน้าแรกเป็น 0
  const [limit, setLimit] = useState(5); // state ของ limit

  const getProducts = async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      const results = await axios(
        `http://localhost:4001/products?category=${category}&keywords=${keywords}&page=${pages}&limit=${limit}`
      );
      // category คือค่าที่มาจาก server ต้องเขียนให้ตรงกับ server
      // ${category} คือ state ที่เป็นตัวเลือกว่าจะเลือกเป็น category อะไร
      setProducts(results.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  const deleteProduct = async (productId) => {
    await axios.delete(`http://localhost:4001/products/${productId}`);
    const newProducts = products.filter((product) => product._id !== productId);
    setProducts(newProducts);
  };

  useEffect(() => {
    getProducts();
  }, [category, keywords, pages, limit]); // อย่าลืม execute ไม่งั้นจะไม่แสดงผล

  return (
    <div>
      <div className="app-wrapper">
        <h1 className="app-title">Products</h1>
        <button
          onClick={() => {
            navigate("/product/create");
          }}
        >
          Create Product
        </button>
      </div>
      <div className="search-box-container">
        <div className="search-box">
          <label>
            Search product
            <input
              type="text"
              placeholder="Search by name"
              // set ช่อง search ให้สามารถค้นหาได้
              value={keywords}
              onChange={(e) => {
                setKeywords(e.target.value);
              }}
            />
          </label>
        </div>
        <div className="category-filter">
          <label>
            View Category
            <select
              id="category"
              name="category"
              // set ช่อง category ให้สามารถเลือก category ได้
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              <option disabled value="">
                -- Select a category --
              </option>
              {/* เพิ่ม All เพื่อให้แสดงข้อมูลทั้งหมด */}
              <option value="">All</option>
              <option value="it">IT</option>
              <option value="fashion">Fashion</option>
              <option value="food">Food</option>
            </select>
          </label>
        </div>
      </div>
      <div className="product-list">
        {!products.length && !isError && (
          <div className="no-blog-posts-container">
            <h1>No Products</h1>
          </div>
        )}
        {products.map((product) => {
          return (
            <div className="product" key={product._id}>
              <div className="product-preview">
                <img
                  src={product.image}
                  alt="some product"
                  width="250"
                  height="250"
                />
              </div>
              <div className="product-detail">
                <h1>Product name: {product.name} </h1>
                <h2>Product price: {product.price}</h2>
                <h3>Category: {product.category}</h3>
                <h3>Created Time: {product.created_date}</h3>
                <p>Product description: {product.description} </p>
                <div className="product-actions">
                  <button
                    className="view-button"
                    onClick={() => {
                      navigate(`/product/view/${product._id}`);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => {
                      navigate(`/product/edit/${product._id}`);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>

              <button
                className="delete-button"
                onClick={() => {
                  deleteProduct(product._id);
                }}
              >
                x
              </button>
            </div>
          );
        })}
        {isError ? <h1>Request failed</h1> : null}
        {isLoading ? <h1>Loading ....</h1> : null}
      </div>

      <div className="pagination">
        <button
          className="previous-button"
          // set ปุ่ม ให้กดแล้วกลับหน้าเก่า
          onClick={() => {
            setPages(pages - 1);
            //ใส่ logic ถ้า pages น้อยกว่า 1 จะไม่สามารถกดได้ ไม่อย่างนั้น ตัวเลขที่ total page จะเป็นค่าติดลบ
            if (pages < 1) {
              setPages(0);
            }
          }}
        >
          Previous
        </button>
        <button
          className="next-button"
          // set ปุ่ม ให้กดแล้วไปหน้าถัดไป
          onClick={() => {
            setPages(pages + 1);
          }}
        >
          Next
        </button>
      </div>
      {/* หน้าแรกเป็น 0 ตัวเลขตรงนี้จึงต้อง +1 เพื่อให้เริ่มแสดงหน้าเป็นหน้าที่ 1 */}
      <div className="pages">{pages + 1}/ total page</div>
    </div>
  );
}

export default HomePage;
