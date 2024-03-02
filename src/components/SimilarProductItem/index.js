import {Link} from 'react-router-dom'

import './index.css'

const SimilarProductItem = props => {
  const {productData} = props

  const {id, imageUrl, title, brand, rating, price} = productData

  return (
    <Link to={`/products/${id}`} className="link-item">
      <li className="similar-products-item">
        <img
          src={imageUrl}
          alt={`similar product ${title}`}
          className="product-thumbnail"
        />

        <h5 className="similar-product-title">{title}</h5>

        <p className="similar-product-brand">by {brand}</p>

        <div className="similar-product-price-rating-card">
          <p className="similar-product-price">Rs {price}/- </p>

          <div className="rating-card">
            <p className="rating-text">{rating}</p>

            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star-img"
            />
          </div>
        </div>
      </li>
    </Link>
  )
}

export default SimilarProductItem
