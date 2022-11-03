import { createMarkerNode } from "../Components/MarkerNode";
import { createKeyPressNode } from "../Components/KeyPressNode";
import { createKeyTapNode } from "../Components/KeyTapNode";
import { createNumberNode } from "../Components/NumberNode";
import { createDetectionPanel } from "../Components/DetectionNode";
import { createAngleChangeNode } from "../Components/AngleChangeNode";
import { createValueChangeNode } from "../Components/ValueChangeNode";

export default {
  marker: createMarkerNode,
  'key-press': createKeyPressNode,
  'key-tap': createKeyTapNode,
  number: createNumberNode,
  detection: createDetectionPanel,
  'value-change': createValueChangeNode,
  'angle-change': createAngleChangeNode,
};
