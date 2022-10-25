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
        selected: false,
      };
    case 'key-press':
      return {
        ...props,
        value: 'a',
        isDown: false,
        uuid,
        input: [],
        selected: false,
      };
    case 'key-tap':
      return {
        ...props,
        value: 'a',
        isDown: false,
        uuid,
        input: [],
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
    case 'value-change':
      return {
        ...props,
        uuid,
        value: 1,
        threshold: 1000,
        totalDelta: 0,
        lastValue: 0, 
        output: [],
        selected: false,
      };
  }
  return null; // this is an error friend
}
