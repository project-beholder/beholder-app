export default function createNode(props, uuid) {
  // Could replace this with an object that has functions for processing
  switch(props.type) {
    case 'marker':
      return {
        ...props,
        ID: 0,
        timeout: 100, // DEFAULT_MARKER_TIMEOUT
        uuid,
        output: [],
        input: { ID: null, timeout: null, source: null },
        selected: false,
      };
    case 'key-press':
      return {
        ...props,
        input: { main: null },
        value: 'a',
        isDown: false,
        uuid,
        selected: false,
      };
    case 'key-tap':
      return {
        ...props,
        input: { main: null },
        value: 'a',
        isDown: false,
        uuid,
        selected: false,
      };
    case 'number':
      return {
        ...props,
        value: 0,
        uuid,
        output: [],
        selected: false,
      };
    case 'detection':
      return {
        ...props,
        camID: 0,
        uuid,
        output: [],
        selected: false,
      };
    case 'angle-change':
    case 'value-change':
      return {
        ...props,
        uuid,
        value: 1,
        threshold: 1000,
        totalDelta: 0,
        lastValue: 0, 
        output: [],
        input: { threshold: null, value: null },
        selected: false,
      };
  }
  return null; // this is an error friend
}
