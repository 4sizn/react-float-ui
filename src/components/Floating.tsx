import React, { useContext, useEffect, useRef, useState } from 'react';
import { FloatingStateContext } from '../provider/FloatingProvider';

type Position = {
  x: number;
  y: number;
};
type TOP_LEFT = {
  top: number;
  left: number;
};

type TOP_RIGHT = {
  top: number;
  right: number;
};

type BOTTOM_LEFT = {
  bottom: number;
  left: number;
};

type BOTTOM_RIGHT = {
  bottom: number;
  right: number;
};

type CombinedPosition = Partial<Position & TOP_LEFT & TOP_RIGHT & BOTTOM_LEFT & BOTTOM_RIGHT>;

type FloatingProps = React.PropsWithChildren<{
  name: string;
  className?: string;
  style?: React.CSSProperties;
}>;

export default function Floating({ children, ...props }: FloatingProps) {
  var posP = [0, 0],
    //마우스 좌표
    posM = [0, 0];
  // 노드 타겟
  let wnapp: HTMLElement | null = null;
  // resize용 drag용 구분자
  let op = 0;
  let dimP = [0, 0];
  let vec = [0, 0];
  let ref = useRef<HTMLDivElement | null>(null);

  const [snap, setSnap] = useState(false);
  const context = useContext(FloatingStateContext);

  const setPos = (positionData: CombinedPosition = {}) => {
    if (wnapp) {
      Object.hasOwn(positionData, 'x') && (wnapp.style.left = positionData.x + 'px');
      Object.hasOwn(positionData, 'y') && (wnapp.style.top = positionData.y + 'px');
      Object.hasOwn(positionData, 'top') && (wnapp.style.top = positionData.top + 'px');
      Object.hasOwn(positionData, 'bottom') && (wnapp.style.bottom = positionData.bottom + 'px');
      Object.hasOwn(positionData, 'left') && (wnapp.style.left = positionData.left + 'px');
      Object.hasOwn(positionData, 'right') && (wnapp.style.right = positionData.right + 'px');
    }
  };

  const setDim = (dim0: number, dim1: number) => {
    if (wnapp) {
      wnapp.style.height = dim0 + 'px';
      wnapp.style.width = dim1 + 'px';
    }
  };

  const closeDrag: typeof document.onmouseup = () => {
    document.onmouseup = null;
    document.onmousemove = null;

    wnapp?.classList.remove('notrans');
    wnapp?.classList.remove('z9900');

    if (context) {
      context.dispatch({
        type: 'resize',
        payload: {
          id: props.name,
        },
      });
    }
  };

  const eleDrag: typeof document.onmousemove = (e) => {
    e = e || window.event;
    e.preventDefault();

    var pos0 = posP[0] + e.clientY - posM[0],
      pos1 = posP[1] + e.clientX - posM[1],
      dim0 = dimP[0] + vec[0] * (e.clientY - posM[0]),
      dim1 = dimP[1] + vec[1] * (e.clientX - posM[1]);

    console.log('###', dim0, dim1);
    console.log('###eleDrag');
    if (op == 0) setPos(calPosType(pos0, pos1, wnapp?.dataset.positions || ''));
    else {
      dim0 = Math.max(dim0, 300);
      dim1 = Math.max(dim1, 300);
      pos0 = posP[0] + Math.min(vec[0], 0) * (dim0 - dimP[0]);
      pos1 = posP[1] + Math.min(vec[1], 0) * (dim1 - dimP[1]);
      setPos(calPosType(pos0, pos1, wnapp?.dataset.positions || ''));
      setDim(dim0, dim1);
    }

    function calPosType(pos0: number, pos1: number, positions: string) {
      let posData = {} as any;

      if (positions.length === 0) {
        console.log('hsshin', 1);
        posData['y'] = pos0;
        posData['x'] = pos1;
        return;
      }
      if (wnapp) {
        positions.includes('top') && (posData['top'] = pos0);
        positions.includes('bottom') &&
          (posData['bottom'] = window.innerHeight - pos0 - wnapp?.offsetHeight);
        positions.includes('left') && (posData['left'] = pos1);
        positions.includes('right') &&
          (posData['right'] = window.innerWidth - pos1 - wnapp?.offsetWidth);
        positions.includes('y') && (posData['y'] = pos0);
        positions.includes('x') && (posData['x'] = pos1);
      }
      return posData;
    }
  };

  const openSnap = () => {
    setSnap(true);
    console.log('openSnap', snap);
  };

  const closeSnap = () => {
    setSnap(false);
    console.log('closeSnap', snap);
  };

  const toolClick = () => {
    console.log('???', toolClick);
    if (context) {
      context.dispatch({
        type: 'front',
        payload: {
          id: props.name,
        },
      });
    }

    console.log('toolClick', props);
  };

  const toolDrag: React.MouseEventHandler<HTMLDivElement> = (e) => {
    console.log('eee toolDrag', e);

    e = e || window.event;
    e.preventDefault();
    posM = [e.clientY, e.clientX];
    op = Number(e.currentTarget.dataset.op);

    if (op === 0) {
      wnapp = e.currentTarget.parentElement as HTMLElement;
    } else {
      vec = e.currentTarget.dataset.vec!.split(',').map((v) => Number(v));
      wnapp = e.currentTarget.parentElement?.parentElement?.parentElement as HTMLElement;
    }

    if (wnapp) {
      wnapp.classList.add('notrans');
      wnapp.classList.add('z9900');
      posP = [wnapp.offsetTop, wnapp.offsetLeft];
      dimP = [
        parseFloat(getComputedStyle(wnapp).height.replaceAll('px', '')),
        parseFloat(getComputedStyle(wnapp).width.replaceAll('px', '')),
      ];
    }

    document.onmouseup = closeDrag;
    document.onmousemove = eleDrag;

    console.log('toolDrag', posM, wnapp);
  };

  useEffect(() => {
    console.log('rendered', ref.current, props, context?.state);
    if (ref.current) {
      if (context?.state.item[props.name]?.options?.position) {
        wnapp = ref.current;
        const combinedPosition = context?.state.item[props.name]?.options.position!(ref.current);
        console.log('aa', combinedPosition);
        wnapp.setAttribute(`data-positions`, Object.keys(combinedPosition).join(','));
        setPos(combinedPosition);
      } else {
        setPos({ x: wnapp?.offsetLeft, y: wnapp?.offsetTop });
      }
    }
  }, []);

  return (
    <div
      className='floatTab'
      style={{
        zIndex: context?.state.item[props.name].options.z,
      }}
      ref={ref}
    >
      {children({
        ...props,
        onClick: toolClick,
        onMouseDown: toolDrag,
        onMouseOver: openSnap,
        onMouseLeave: closeSnap,
      })}
    </div>
  );
}
