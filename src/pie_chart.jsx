import React from 'react';

const { PropTypes } = React;
const size = 100;
const radCircumference = Math.PI * 2;
const center = size / 2;
const radius = center - 1; // padding to prevent clipping

/**
 * Generates an SVG pie chart.
 * @see {http://wiki.scribus.net/canvas/Making_a_Pie_Chart}
 */
export default class PieChart extends React.Component {
  /**
   * @return {Object[]}
   */
  _renderPaths() {
    const total = this.props.slices.reduce(
      (totalValue, { value }) => totalValue + value, 0);

    let radSegment = 0;
    let lastX = radius;
    let lastY = 0;

    return this.props.slices.map(({ color, value }, index) => {
      // Should we just draw a circle?
      if (value === total) {
        return (
          <circle
            r={radius}
            cx={center}
            cy={center}
            fill={color}
            key={index}
          />
        );
      }

      if (value === 0) {
        return;
      }

      const valuePercentage = value / total;

      // Should the arc go the long way round?
      const longArc = (valuePercentage <= 0.5) ? 0 : 1;

      radSegment += valuePercentage * radCircumference;
      const nextX = Math.cos(radSegment) * radius;
      const nextY = Math.sin(radSegment) * radius;

      // d is a string that describes the path of the slice.
      // The weirdly placed minus signs [eg, (-(lastY))] are due to the fact
      // that our calculations are for a graph with positive Y values going up,
      // but on the screen positive Y values go down.
      const d = [
        `M ${center},${center}`,
        `l ${lastX},${-lastY}`,
        `a${radius},${radius}`,
        '0',
        `${longArc},0`,
        `${nextX - lastX},${-(nextY - lastY)}`,
        'z',
      ].join(' ');

      lastX = nextX;
      lastY = nextY;

      return <path d={d} fill={color} key={index} />;
    });
  }

  /**
   * @return {Object}
   */
  render() {
    return (
      <svg viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${center} ${center})`}>
          {this._renderPaths()}
        </g>
      </svg>
    );
  }
}

PieChart.propTypes = {
  slices: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired, // hex color
    value: PropTypes.number.isRequired,
  })).isRequired,
};
