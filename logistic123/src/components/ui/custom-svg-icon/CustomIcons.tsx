import { FC } from 'react';

interface Props {
  fill?: string;
}

export const ArrowCollapse: FC<Props> = (props) => {
  const { fill } = props;
  return (
    <svg
      width="19"
      height="16"
      viewBox="0 0 19 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.9999 7.00003H4.41394L9.70694 1.70703L8.29294 0.29303L0.585938 8.00003L8.29294 15.707L9.70694 14.293L4.41394 9.00003H18.9999V7.00003Z"
        fill={fill}
      />
    </svg>
  );
};

export const ArrowExpand: FC<Props> = (props) => {
  const { fill } = props;
  return (
    <svg
      width="19"
      height="16"
      viewBox="0 0 19 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.35288e-05 8.99997L14.5861 8.99997L9.29306 14.293L10.7071 15.707L18.4141 7.99997L10.7071 0.292969L9.29306 1.70697L14.5861 6.99997L6.37037e-05 6.99997L6.35288e-05 8.99997Z"
        fill={fill}
      />
    </svg>
  );
};
