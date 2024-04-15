import { FC } from "react";

import "./styles.css";
import { Button } from "react-bootstrap";

interface Props {
  product: {
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    thumbnail: string;
  };
}

export const ProductCard: FC<Props> = ({ product }) => {
  const { title, description, price, discountPercentage, thumbnail } = product;

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 p-2">
        <img src={thumbnail} className="card-img-top" alt={title} />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
        </div>
        <div className="card-footer">
          <div className="d-flex justify-content-between">
            <p className="card-text">
              <span className="text-muted">Price:</span> ${price}
            </p>
            <p className="card-text">
              <span className="text-muted">Discount:</span> {discountPercentage}
              %
            </p>
          </div>
          <Button variant="" className="btn btn-primary btn-sm">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
