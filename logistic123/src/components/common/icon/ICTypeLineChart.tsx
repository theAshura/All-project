export const ICTypeLineChart = ({ ...props }) => (
  <svg
    width="20"
    height="8"
    viewBox="0 0 20 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect y="3" width="20" height="2.80049" fill={props.fill} />
    <circle
      cx="10"
      cy="4"
      r="3"
      fill="white"
      stroke={props.fill}
      strokeWidth="2"
    />
  </svg>
);
