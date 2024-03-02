/* eslint-disable jsx-a11y/control-has-associated-label */
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import './index.css'
import Header from '../Header'

const apiStatConstant = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class ProductItemDetails extends Component {
  state = {
    productData: {},
    fetchStatus: apiStatConstant.initial,
    similarProducts: [],
    productQuantity: 1,
  }

  // eslint-disable-next-line react/sort-comp
  snakeToCamelCase = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    price: data.price,
    description: data.description,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
  })

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({fetchStatus: apiStatConstant.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const modifyData = this.snakeToCamelCase(data)
      const modifySimilarProductsData = data.similar_products.map(product =>
        this.snakeToCamelCase(product),
      )
      this.setState({
        productData: modifyData,
        similarProducts: modifySimilarProductsData,
        fetchStatus: apiStatConstant.success,
      })
    }

    if (response.status === 404) {
      this.setState({
        fetchStatus: apiStatConstant.failure,
      })
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => {
    const imageUrl =
      'https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png'

    return (
      <div className="failure-card">
        <img src={imageUrl} alt="error view" className="error-img" />

        <h2 className="error-title">Product Not Found</h2>

        <Link to="/products" className="link-item">
          <button type="button" className="continue-shopping-btn">
            Continue Shopping
          </button>
        </Link>
      </div>
    )
  }

  increaseQuantity = () => {
    this.setState(prevState => ({
      productQuantity: prevState.productQuantity + 1,
    }))
  }

  decreaseQuantity = () => {
    this.setState(prevState => ({
      productQuantity: prevState.productQuantity - 1,
    }))
  }

  renderProductItem = () => {
    const {productData, productQuantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productData

    return (
      <div className="product-item-card">
        <img src={imageUrl} alt="product" className="product-item-image" />

        <div className="product-item-details">
          <h2 className="product-item-title">{title}</h2>

          <p className="product-item-price">Rs {price}/- </p>

          <div className="product-item-rating-container">
            <div className="rating-card">
              <p className="rating-text">{rating}</p>

              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star-img"
              />
            </div>

            <p className="product-item-reviews">{totalReviews} Reviews</p>
          </div>

          <p className="product-item-description">{description}</p>

          <div className="product-item-label-card">
            <p className="product-item-label">Available: </p>
            <p className="label-text">{availability}</p>
          </div>
          <div className="product-item-label-card">
            <p className="product-item-label">Brand: </p>
            <p className="label-text">{brand}</p>
          </div>

          <div className="product-item-quantity-card">
            <button
              className="quantity-btn"
              type="button"
              data-testid="minus"
              onClick={this.decreaseQuantity}
            >
              <BsDashSquare className="quantity-control-icon" />
            </button>

            <p className="product-item-quantity">{productQuantity}</p>

            <button
              className="quantity-btn"
              type="button"
              data-testid="plus"
              onClick={this.increaseQuantity}
            >
              <BsPlusSquare className="quantity-control-icon" />
            </button>
          </div>

          <hr className="line" />

          <button type="button" className="add-to-cart-btn">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  renderProductItemDetails = () => {
    const {fetchStatus} = this.state

    switch (fetchStatus) {
      case apiStatConstant.inProgress:
        return this.renderLoader()

      case apiStatConstant.failure:
        return this.renderFailureView()

      case apiStatConstant.success:
        return this.renderProductItem()

      default:
        return null
    }
  }

  render() {
    const {similarProducts} = this.state
    console.log(similarProducts)

    return (
      <>
        <Header />
        <div className="product-item-container">
          {this.renderProductItemDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
