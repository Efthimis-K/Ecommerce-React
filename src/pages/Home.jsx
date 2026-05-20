// See the App.css file to suggest the existing class names here

// import products.js
import { getProducts } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Home() {
    const products = getProducts();
    return <div className="page">
        <div className="home-hero">
            <h1 className="home-title">E-Commerce Store</h1>
            <p className="home-subtitle">Your one-stop shop for all your needs</p>
        </div>
        <div className="container">
            <h2 className="page-title">Our Products</h2>
            <div className="product-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    </div>
}
