import { div, img, span, select, option, input } from '@cycle/dom';

let cameras = [];
navigator.mediaDevices.enumerateDevices().then(function (devices) {
  for(var i = 0; i < devices.length; i ++){
    cameras = devices.filter(({ kind }) => kind == 'videoinput');
  };
});

// this should only be updated every couple of frames probs, not every update
// document.querySelector('#test-img').src = "../frame.png?" + new Date().getTime();
export function renderDetectionPanel(props) {
  const { uuid, selected, x, y, outputs } = props;
  return div('.draggable-node.detection-panel',
    { style: { transform: `translate(${x}px, ${y}px)` }, class: { selected }, dataset: { uuid } },
    [
      div('.detection-view', 'hide-me peter'), // position this absolute, kthanks
      img('.detection-img', { attrs: { src: '../frame.jpg' } }),
      div('.labeled-select.detection-parameter', [
        span('.select-label', 'CAMERA'),
        select(
          '.detection-select.camera-select',
          { dataset: { uuid: 'detection-panel' } },
          cameras.map((c, value) => option({ attrs: { value }}, c.label))
        ),
      ]),
      div('.detection-parameter', [
        span('.select-label', 'flip'),
        input('.detection-check.camera-flip', { attrs: { type: 'checkbox' }})
      ]),
      div('.node-outputs', [
        span('.output-point', { dataset: { type: 'output', name: 'FEED', valueType: 'feed', parent: uuid, offsetX: outputs.FEED.offsetX, offsetY: outputs.FEED.offsetY } }, 'FEED')
      ]),
    ]
  );
}

export function createDetectionPanel(props, uuid) {
  return { 
    ...props,
    camID: 0,
    uuid,
    outputs: { FEED: { name: 'FEED', offsetX: 350, offsetY: 299, targets: [], valueType: 'feed' } },
    selected: false,
  };
}