export function calEdgePosition(element: HTMLElement, type: 'se' | 'sw' | 'ne' | 'nw') {
  switch (type) {
    case 'se':
      return calSeEdgePosition(element);
    case 'sw':
      return calSwEdgePosition(element);
    case 'ne':
      return calNeEdgePosition(element);
    case 'nw':
      return calNwEdgePosition();
  }

  function calSeEdgePosition(element: HTMLElement) {
    const x = window.innerWidth - element.clientWidth - 8;
    const y = window.innerHeight - element.clientHeight - 8;

    return {
      x,
      y,
    };
  }

  function calSwEdgePosition(element: HTMLElement) {
    const x = 8;
    const y = window.innerHeight - element.clientHeight - 8;

    return {
      x,
      y,
    };
  }

  function calNeEdgePosition(element: HTMLElement) {
    const x = window.innerWidth - element.clientWidth - 8;
    const y = 8;

    return {
      x,
      y,
    };
  }

  function calNwEdgePosition() {
    const x = 8;
    const y = 8;
    return {
      x,
      y,
    };
  }
}
