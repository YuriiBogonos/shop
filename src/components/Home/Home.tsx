import { useContext } from "react";
import { ProductsContext } from "../../providers/productsContext";
import { ProductCard } from "../ProductCard/ProductCard";
// import { Pagination } from "react-bootstrap";
import { PaginationCustom } from "../PaginationCustom/PaginationCustom";
import { set } from "firebase/database";
import "./styles.css";
const itemsPerPageArray: number[] = [5, 10, 15];

export const Home = () => {
  const {
    products,
    categories,
    setSelectedCategory,
    selectedCategory,
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    setSearchQuery,
    searchQuery,
  } = useContext(ProductsContext);

  console.log("page", page);
  console.log(totalItems);

  return (
    <div className="container p-2">
      <div className="d-flex align-center mb-5 gap-2 flex-wrap">
        <div className="dropdown mb-2">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {selectedCategory}
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <button
              className="dropdown-item"
              onClick={() => setSelectedCategory("All")}
            >
              All
            </button>
            {categories &&
              categories.map((category) => (
                <button
                  key={category}
                  className="dropdown-item"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(category);
                    setPage(0);
                  }}
                >
                  {category[0].toUpperCase() + category.slice(1)}
                </button>
              ))}
          </div>
        </div>
        {/* {itemsPerPage < totalItems && ( */}
        <div className="dropdown mb-2">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Items per page: {itemsPerPage}
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {itemsPerPageArray
              .filter((item) => item < totalItems)
              .map((item) => (
                <button
                  key={item}
                  className="dropdown-item"
                  onClick={() => setItemsPerPage(item)}
                >
                  {item}
                </button>
              ))}
          </div>
        </div>
        {/* )} */}
        <input
          className="form-control w-25 mb-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></input>
      </div>
      <div className="row">
        {products &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
      <div className="d-flex justify-content-center">
        {totalItems > itemsPerPage && products.length >= itemsPerPage && (
          <PaginationCustom
            totalItems={totalItems}
            page={page}
            itemsPerPage={itemsPerPage}
            setPage={setPage}
          />
        )}
      </div>
    </div>
  );
};
