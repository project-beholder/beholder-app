import { renderMarkerNode } from "./MarkerNode";
import { renderKeyPressNode } from "./KeyPressNode";
import { renderKeyTapNode } from "./KeyTapNode";
import { renderNumberNode } from "./NumberNode";
import { renderDetectionPanel } from "./DetectionNode";
import { renderAngleChangeNode } from "./AngleChangeNode";
import { renderValueChangeNode } from "./ValueChangeNode";
import { renderANDLogicNode } from "./ANDLogicNode";
import { renderGreaterThanLogicNode } from "./GreaterThanLogicNode";
import { renderLessThanLogicNode } from "./LessThanLogicNode";
import { renderNOTLogicNode } from "./NOTLogicNode";

export default {
  marker: renderMarkerNode,
  'key-press': renderKeyPressNode,
  'key-tap': renderKeyTapNode,
  number: renderNumberNode,
  detection: renderDetectionPanel,
  'value-change': renderValueChangeNode,
  'angle-change': renderAngleChangeNode,
  AND: renderANDLogicNode,
  NOT: renderNOTLogicNode,
  'greater-than': renderGreaterThanLogicNode,
  'less-than': renderLessThanLogicNode,
};
