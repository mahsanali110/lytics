import { usePagination, DOTS } from 'hooks/usePagination';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './Pagination.scss';
import { number } from 'prop-types';
const Pagination = ({ onPageChange, totalCount, currentPage, extraClass }) => {
  const paginationRange = usePagination({
    currentPage,
    totalPageCount: totalCount,
  });

  if (currentPage === 0 || paginationRange?.length < 2) return null;

  const onNext = () => onPageChange(currentPage + 1);

  const onPrevious = () => onPageChange(currentPage - 1);
  let lastPage = 0;
  if ((typeof paginationRange[paginationRange?.length - 1] === 'number') === true) {
    lastPage = paginationRange[paginationRange?.length - 1];
  } else {
    lastPage = 0;
  }

  return (
    <ul className={`pagination-bar pagination-container-v3 ${extraClass}`}>
      <li
        className="pagination-item"
        style={currentPage == 1 ? { pointerEvents: 'none' } : {}}
        onClick={onPrevious}
      >
        <div className="arrow left-arrow">
          <LeftOutlined />
        </div>
      </li>
      {paginationRange.map(pageNumber => {
        if (pageNumber === DOTS) return <li className="pagination-item dots">&#8230;</li>;
        return (
          <li
            className={pageNumber === currentPage ? 'pagination-item selected' : 'pagination-item'}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}

      <li
        className="pagination-item"
        style={currentPage == lastPage ? { pointerEvents: 'none' } : {}}
        onClick={onNext}
      >
        <div className="arrow right-arrow">
          <RightOutlined />
        </div>
      </li>
    </ul>
  );
};

export default Pagination;
