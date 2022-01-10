import React, { PropsWithChildren } from 'react';

type ConditionalProps = PropsWithChildren<{
  isVisible: () => boolean;
}>;

function Conditional({ isVisible, children }: ConditionalProps) {
  if (isVisible()) {
    return (
      <>{ children }</>
    );
  }

  return (<></>);
}

export default Conditional;
