import { Navigate, useParams } from "react-router-dom";
import { getProductById } from "../data/products";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();
  const product = getProductById(id);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const productInCart = cartItems.find((item) => item.id === product.id);
  const productQuantityList = productInCart ? `${productInCart.quantity}` : "";

  return (
    <div className="page">
      <div className="container">
        <div className="product-details">
          <div className="product-detail-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-detail-content">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <button
              className="btn btn-primary"
              onClick={() => addToCart(product.id)}
              style={{ marginRight: "10px" }}
            >
              {productQuantityList} Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
