import { createMarkerNode } from "../Components/MarkerNode";
import { createKeyPressNode } from "../Components/KeyPressNode";
import { createKeyTapNode } from "../Components/KeyTapNode";
import { createNumberNode } from "../Components/NumberNode";
import { createDetectionPanel } from "../Components/DetectionNode";
import { createAngleChangeNode } from "../Components/AngleChangeNode";
import { createValueChangeNode } from "../Components/ValueChangeNode";
import { createANDLogicNode } from "../Components/ANDLogicNode";
import { createGreaterThanLogicNode } from "../Components/GreaterThanLogicNode";
import { createLessThanLogicNode } from "../Components/LessThanLogicNode";
import { createNOTLogicNode } from "../Components/NOTLogicNode";
import { createORLogicNode } from "../Components/ORLogicNode";
import { createBetweenLogicNode } from "../Components/BetweenLogicNode";
import { createPeriodicNode } from "../Components/PeriodicNode";

export default {
  marker: createMarkerNode,
  'key-press': createKeyPressNode,
  'key-tap': createKeyTapNode,
  number: createNumberNode,
  detection: createDetectionPanel,
  'value-change': createValueChangeNode,
  'angle-change': createAngleChangeNode,
  between: createBetweenLogicNode,
  AND: createANDLogicNode,
  NOT: createNOTLogicNode,
  OR: createORLogicNode,
  'greater-than': createGreaterThanLogicNode,
  'less-than': createLessThanLogicNode,
  periodic: createPeriodicNode,
};
