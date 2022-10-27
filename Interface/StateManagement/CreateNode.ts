export default function createNode(props, uuid) {
  // Could replace this with an object that has functions for processing
  switch(props.type) {
    case 'marker':
      return {
        ...props,
        ID: 0,
        timeout: 100, // DEFAULT_MARKER_TIMEOUT
        uuid, // Targets for outputs = { uuid, field }
        outputs: {
          DETECT: { property: 'present', offsetX: 280, offsetY: 39, targets: [] },
          X: { property: 'posX', offsetX: 280, offsetY: 59, targets: [] },
          Y: { property: 'posY', offsetX: 280, offsetY: 79, targets: [] },
          ANGLE: { property: 'rotation',offsetX: 280, offsetY: 99, targets: [] }
        },
        inputs: {
          ID: { offsetX: 0, offsetY: 59, source: null, sourceField: null },
          timeout: { offsetX: 0, offsetY: 79, source: null, sourceField: null },
          source: { offsetX: 0, offsetY: 99, source: null, sourceField: null }
        },
        selected: false,
      };
    case 'key-press':
      return {
        ...props,
        value: 'a',
        isDown: false,
        uuid,
        inputs: { PRESS: { offsetX: 0, offsetY: 39, source: null, sourceField: null } },
        selected: false,
      };
    case 'key-tap':
      return {
        ...props,
        input: { main: null },
        value: 'a',
        isDown: false,
        uuid,
        inputs: { TAP: { offsetX: 0, offsetY: 39, source: null, sourceField: null } },
        selected: false,
      };
    case 'number':
      return {
        ...props,
        value: 0,
        uuid,
        outputs: { value: { noText: true, offsetX: 120, offsetY: 39, targets: [] } },
        selected: false,
      };
    case 'detection':
      return {
        ...props,
        camID: 0,
        uuid,
        outputs: { FEED: { offsetX: 350, offsetY: 299, targets: [] } },
        selected: false,
      };
    case 'angle-change':
      return {
        ...props,
        uuid,
        VALUE: 1,
        THRESHOLD: 1000,
        totalDelta: 0,
        lastValue: 0, 
        outputs: { TRIGGER: { noText: true, offsetX: 220, offsetY: 49, targets: [] }},
        inputs: {
          ANGLE: { offsetX: 0, offsetY: 29, source: null, sourceField: null },
          THRESHOLD: { offsetX: 0, offsetY: 49, source: null, sourceField: null },
        },
        selected: false,
      };
    case 'value-change':
      return {
        ...props,
        uuid,
        VALUE: 1,
        THRESHOLD: 1000,
        totalDelta: 0,
        lastValue: 0, 
        outputs: { TRIGGER: { noText: true, offsetX: 220, offsetY: 49, targets: [] }},
        inputs: {
          VALUE: { offsetX: 0, offsetY: 29, source: null, sourceField: null },
          THRESHOLD: { offsetX: 0, offsetY: 49, source: null, sourceField: null },
        },
        selected: false,
      };
  }
  return null; // this is an error friend
}
