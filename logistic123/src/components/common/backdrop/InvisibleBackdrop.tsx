import useEffectOnce from 'hoc/useEffectOnce';
import { ReactNode, useCallback, useEffect, useRef } from 'react';

interface Props {
  onClick: () => void;
  disabled?: boolean;
  children?: ReactNode;
}

const InvisibleBackdrop = ({ disabled, onClick, children }: Props) => {
  const ref = useRef(null);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (ref && !ref.current.contains(e?.target as any)) {
        if (onClick) {
          onClick();
        }
      }
    },
    [onClick],
  );

  useEffect(() => {
    if (!disabled) {
      window.addEventListener('mousedown', handleClickOutside);
    } else {
      window.removeEventListener('mousedown', handleClickOutside);
    }

    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [disabled, handleClickOutside]);

  useEffectOnce(() => {
    if (!disabled) {
      window.addEventListener('mousedown', handleClickOutside);
    }
  });

  return <div ref={ref}>{children}</div> || null;
};

/**
 * TODO: Convert this class component into function component and check if they work properly
 * Revert it if any issues appears
 */

// class InvisibleBackdrop extends React.PureComponent<Props> {
//   componentDidMount() {
//     const { disabled } = this.props;
//     if (!disabled) {
//       window.addEventListener('mousedown', this.handleClickOutside);
//     }
//   }

//   componentDidUpdate(
//     prevProps: Readonly<Props>,
//     prevState: Readonly<{}>,
//     snapshot?: any,
//   ): void {
//     const { disabled } = this.props;
//     if (prevProps.disabled !== disabled) {
//       if (!disabled) {
//         window.addEventListener('mousedown', this.handleClickOutside);
//       } else {
//         window.removeEventListener('mousedown', this.handleClickOutside);
//       }
//     }
//   }

//   componentWillUnmount() {
//     window.removeEventListener('mousedown', this.handleClickOutside);
//   }

//   handleClickOutside = (e: MouseEvent) => {
//     // eslint-disable-next-line react/no-find-dom-node
//     const ref = findDOMNode(this);
//     const { target } = e;
//     const { onClick } = this.props;
//     if (ref && !ref.contains(target as any)) {
//       if (onClick) {
//         onClick();
//       }
//     }
//   };

//   render() {
//     const { children } = this.props;
//     return children || null;
//   }
// }

export default InvisibleBackdrop;
