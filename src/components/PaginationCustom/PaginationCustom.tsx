import { FC } from "react";
import { Pagination } from "react-bootstrap";

interface Props {
  totalItems: number;
  page: number;
  itemsPerPage: number;
  setPage: (page: number) => void;
}

export const PaginationCustom: FC<Props> = ({
  totalItems,
  page,
  itemsPerPage,
  setPage,
}) => {
  const pages = [...Array(Math.ceil(totalItems / itemsPerPage - 1)).keys()];
  return (
    <Pagination>
      {page !== 1 && <Pagination.First onClick={() => setPage(1)} />}
      <Pagination.Prev
        onClick={() => setPage((prev) => prev - 1)}
        disabled={page === 1}
      />
      {page - 2 > 1 && <Pagination.Ellipsis />}
      {pages.slice(page - 2 > 1 ? page - 2 : 0, page + 2).map((item) => (
        <Pagination.Item
          key={item}
          active={item + 1 === page}
          onClick={() => setPage(item + 1)}
        >
          {item + 1}
        </Pagination.Item>
      ))}
      {page + 2 < pages.length && <Pagination.Ellipsis />}
      <Pagination.Next
        onClick={() => setPage((prev) => prev + 1)}
        disabled={pages.length === page}
      />
      {page !== pages.length && (
        <Pagination.Last onClick={() => setPage(pages.length)} />
      )}
    </Pagination>
  );
};
