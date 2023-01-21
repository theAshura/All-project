export default function componentLoader(
  lazyComponent: () => Promise<any>,
  attemptsLeft: number = 3,
): Promise<any> {
  return new Promise((resolve, reject) => {
    lazyComponent()
      .then(resolve)
      .catch((error) => {
        // let us retry after 500 ms
        setTimeout(() => {
          if (attemptsLeft === 1) {
            reject(error);
            return;
          }
          componentLoader(lazyComponent, attemptsLeft - 1).then(
            resolve,
            reject,
          );
        }, 500);
      });
  });
}
