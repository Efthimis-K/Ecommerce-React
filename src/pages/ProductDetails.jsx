// Page to display product details


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../data/products";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  // use state
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchedProduct = getProductById(id);

    // log the product data
    console.log(fetchedProduct);
    if(!fetchedProduct) {
      // redirect to home
      navigate("/");
      return;
    }
    setProduct(fetchedProduct);
    
  }, [id]);

  // check if product is loading
  if (!product) {
    return <div className="page">
      <div className="container">
        <div className="product-details">
          <p>Loading...</p>
        </div>
      </div>
    </div>;
  }

  return <div className="page">
    <div className="container">
      <div className="product-details">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-detail-content">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>${product.price}</p>
          <button className="btn btn-primary">Add to Cart</button>
        </div>
      </div>
    </div>
  </div>;
}
