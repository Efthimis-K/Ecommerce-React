import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart();
  //   product in cart
  const productInCart = cartItems.find((item) => item.id === product.id);

  const productQuantityList = productInCart ? `${productInCart.quantity}` : "";

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-card-content">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-price">{product.price}</p>

        <div className="product-card-actions">
          <Link to={`/product/${product.id}`} className="btn btn-secondary">
            View details
          </Link>
          <button
            className="btn btn-primary"
            onClick={() => addToCart(product.id)}
          >
            Add to Cart {productQuantityList}
          </button>
        </div>
      </div>
    </div>
  );
}

// <div className="product-card" key={product.id}>
//     <img src={product.image} alt={product.name} />
//     <div className="product-card-content">
//         <h3 className="product-card-name">{product.name}</h3>
//         <p className="product-card-price">{product.price}</p>

//         <div className="product-card-actions">
//             <Link to={`/product/${product.id}`} className="btn btn-secondary">View details</Link>
//             <button className="btn btn-primary">Add to Cart</button>
//         </div>
//     </div>
// </div>
