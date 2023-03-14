import React, { useCallback, useContext, useEffect } from 'react';
import { FloatingStateContext } from './FloatingProvider';

type FloatingItemOptions = {
  resize?: boolean;
};

type RegisterFloatingItemProps = {
  Component: React.FC;
  options: FloatingItemOptions;
  id?: string;
};

/**
 * custom hook for floating item
 */
export function useFloatingItem() {
  const context = useContext(FloatingStateContext);

  const handleAddItem = useCallback(({ Component, options, id }: RegisterFloatingItemProps) => {
    if (!id) {
      id = Math.random().toString(36).substr(2, 9);
    }

    if (!context) {
      throw Error('FloatingStateContext not existed...');
    }

    context.dispatch({
      type: 'add',
      payload: {
        id,
        options,
        render: (props: any) => <Component {...props} />, //TODO: props
      },
    });
  }, []);

  return {
    register: handleAddItem,
  };
}
