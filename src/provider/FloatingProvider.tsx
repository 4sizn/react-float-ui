import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import Floating from '../components/Floating';

type FloatingProviderProps = { children: React.ReactNode };

export type PayloadAction<P = void, T extends string = string, M = never, E = never> = {
  payload: P;
  type: T;
} & ([M] extends [never]
  ? {}
  : {
      meta: M;
    }) &
  ([E] extends [never]
    ? {}
    : {
        error: E;
      });

type FloatingState = {
  item: Record<string, FloatingItemState>;
  data: {
    hz: number;
  };
};

type FloatingItemState = {
  id: string;
  render: (props?: any) => React.ReactNode;
  options: FloatingItemOptions;
};

type FloatingItemOptions = {
  resize?: boolean;
  barComponent?: (props: any) => React.ReactNode;
  position?: (element: HTMLElement) => {
    x?: number;
    y?: number;
    z?: number;
  };
  z?: number;
};

type FloatingStateContextType = {
  state: FloatingState;
  dispatch: React.Dispatch<
    | PayloadAction<FloatingItemState, 'add'>
    | PayloadAction<{ id: string }, 'front'>
    | PayloadAction<{ id: string }, 'resize'>
  >;
};

export const FloatingStateContext = React.createContext<FloatingStateContextType | null>(null);

const initialState = {
  item: {},
  data: {
    hz: 0,
  },
};

function reducer(state: FloatingState = initialState, action: PayloadAction<FloatingItemState>) {
  console.log('###reducer', action);
  switch (action.type) {
    case 'add': {
      state = {
        ...state,
        item: {
          ...state.item,
          [action.payload.id]: action.payload,
        },
      };

      break;
    }
    case 'remove': {
      break;
    }
    case 'resize': {
      if (state.item[action.payload.id]?.options?.z !== state.data.hz) {
        state.data.hz = state.data.hz + 1;
      }

      state = {
        ...state,
        item: {
          ...state.item,
          [action.payload.id]: {
            ...state.item[action.payload.id],
            options: {
              ...state.item[action.payload.id].options,
              z: state.data.hz,
            },
          },
        },
      };

      break;
    }
    case 'front': {
      if (state.item[action.payload.id].options.z !== state.data.hz) {
        state.data.hz = state.data.hz + 1;
      }

      state = {
        ...state,
        item: {
          ...state.item,
          [action.payload.id]: {
            ...state.item[action.payload.id],
            options: {
              ...state.item[action.payload.id].options,
              z: state.data.hz,
            },
          },
        },
      };
      break;
    }
    default: {
      break;
    }
  }

  console.log('###state', state);
  console.log('###current Zindex', state.data.hz);

  return state;
}

export default function FloatingProvider({ children }: FloatingProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FloatingStateContext.Provider value={{ state, dispatch }}>
      <>{children}</>
      <>
        {ReactDOM.createPortal(
          Object.entries(state.item).map(([key, item]) => {
            return (
              <Floating key={key} name={String(key)}>
                {(props) => {
                  console.log('props', props);
                  return (
                    <>
                      {item.options.barComponent &&
                        item.options.barComponent({
                          ...props,
                          ['data-op']: '0',
                        })}
                      {item.options.resize && (
                        <>
                          <div className='resizecont topone'>
                            <div className='flex'>
                              <div
                                className='cursor-nw-resize'
                                data-op='1'
                                data-vec='-1,-1'
                                onMouseDown={props.onMouseDown}
                                style={{
                                  width: '8px',
                                  height: '8px',
                                }}
                              ></div>
                              <div
                                className='cursor-row-resize'
                                data-op='1'
                                data-vec='-1,0'
                                onMouseDown={props.onMouseDown}
                                style={{
                                  width: '100%',
                                  minWidth: '8px',
                                  minHeight: '8px',
                                }}
                              ></div>
                              <div
                                className='cursor-sw-resize'
                                data-op='1'
                                data-vec='-1,1'
                                onMouseDown={props.onMouseDown}
                                style={{
                                  width: '8px',
                                  height: '8px',
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className='resizecont leftone'>
                            <div className='h-full'>
                              <div
                                className='cursor-col-resize'
                                data-op='1'
                                data-vec='0,-1'
                                onMouseDown={props.onMouseDown}
                                style={{
                                  height: '100%',
                                  minWidth: '8px',
                                  minHeight: '8px',
                                }}
                              />
                            </div>
                          </div>
                          <div className='resizecont rightone'>
                            <div className='h-full'>
                              <div
                                className='cursor-col-resize'
                                data-op='1'
                                data-vec='0,1'
                                onMouseDown={props.onMouseDown}
                                style={{
                                  height: '100%',
                                  minWidth: '8px',
                                  minHeight: '8px',
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className='resizecont bottomone'>
                            <div className='flex'>
                              <div
                                className='cursor-nesw-resize'
                                data-op='1'
                                data-vec='1,-1'
                                onMouseDown={props.onMouseDown}
                                style={{
                                  width: '8px',
                                  height: '8px',
                                }}
                              ></div>
                              <div
                                className='cursor-row-resize'
                                data-op='1'
                                data-vec='1,0'
                                onMouseDown={props.onMouseDown}
                                style={{
                                  width: '100%',
                                  minWidth: '8px',
                                  minHeight: '8px',
                                }}
                              ></div>
                              <div
                                className='cursor-nwse-resize'
                                data-op='1'
                                data-vec='1,1'
                                onMouseDown={props.onMouseDown}
                                style={{
                                  width: '8px',
                                  height: '8px',
                                }}
                              ></div>
                            </div>
                          </div>
                        </>
                      )}
                      {item.render({ onClick: props.onClick })}
                    </>
                  );
                }}
              </Floating>
            );
          }),
          document.body,
        )}
      </>
    </FloatingStateContext.Provider>
  );
}
