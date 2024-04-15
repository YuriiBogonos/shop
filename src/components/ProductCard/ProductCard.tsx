import { FC } from "react";

import "./styles.css";

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
          <p className="card-text">Price: ${price}</p>
          <p className="card-text">Discount: {discountPercentage}%</p>
        </div>
      </div>
    </div>
  );
};
