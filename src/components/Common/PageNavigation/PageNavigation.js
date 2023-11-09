import PropTypes from 'prop-types';
import { useHotkeys } from 'react-hotkeys-hook';

import Button from '../Button';

import './PageNavigation.scss';
import { NEXT, PREVIOUS } from 'constants/hotkeys';

const PageNavigation = ({ index, next, prev, handleClick }) => {
  useHotkeys(
    NEXT,
    e => {
      e.preventDefault();
      if (!next) return;
      handleClick(index + 1, prev);
    },
    [index, next]
  );

  useHotkeys(
    PREVIOUS,
    e => {
      e.preventDefault();
      if (!prev) return;
      handleClick(index - 1, prev);
    },
    [index, prev]
  );

  return (
    <div className="page-navigation-wrapper mb-10">
      <Button
        variant="secondary"
        tabIndex="0"
        onKeyPress={e => e.key === 'Enter' && handleClick(index - 1, prev)}
        disabled={!prev}
        onClick={() => handleClick(index - 1, prev)}
      >
        Previous
      </Button>
      <Button
        variant="secondary"
        tabIndex="0"
        onKeyPress={e => e.key === 'Enter' && handleClick(index + 1, prev)}
        disabled={!next}
        onClick={() => handleClick(index + 1, next)}
      >
        Next
      </Button>
    </div>
  );
};

PageNavigation.prototype = {
  index: PropTypes.number.isRequired,
  next: PropTypes.string,
  prev: PropTypes.string
}

export default PageNavigation;
