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
import { renderORLogicNode } from "./ORLogicNode";
import { renderBetweenLogicNode } from "./BetweenLogicNode";
import { renderPeriodicNode } from "./PeriodicNode";

export default {
  marker: renderMarkerNode,
  'key-press': renderKeyPressNode,
  'key-tap': renderKeyTapNode,
  number: renderNumberNode,
  detection: renderDetectionPanel,
  'value-change': renderValueChangeNode,
  'angle-change': renderAngleChangeNode,
  between: renderBetweenLogicNode,
  AND: renderANDLogicNode,
  NOT: renderNOTLogicNode,
  OR: renderORLogicNode,
  'greater-than': renderGreaterThanLogicNode,
  'less-than': renderLessThanLogicNode,
  periodic: renderPeriodicNode,
};
