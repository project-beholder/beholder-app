import { useState, useCallback, useReducer } from "react";
import * as R from 'ramda';
import { v4 as uuidv4 } from 'uuid';

import Connections from "./Connections";
import ANDLogicNode from "./Nodes/ANDNode";
import AngleChangeNode from "./Nodes/AngleChangeNode";
import BetweenNode from "./Nodes/BetweenNode";
import GTNode from "./Nodes/GTNode";
import KeyPressNode from "./Nodes/KeyPressNode";
import KeyTapNode from "./Nodes/KeyTapNode";
import LTNode from "./Nodes/LTNode";
import MarkerNode from "./Nodes/MarkerNode";
import NOTNode from "./Nodes/NOTNode";
import NumberNode from "./Nodes/NumberNode";
import ORNode from "./Nodes/ORNode";
import PeriodicNode from "./Nodes/PeriodicNode";
import ValueChangeNode from "./Nodes/ValueChangeNode";
import NodeGenerator from "./NodeGenerator";

const nodeRenderMap = {
    number: NumberNode,
    marker: MarkerNode,
    not: NOTNode,
    and: ANDLogicNode,
    or: ORNode,
    between: BetweenNode,
    lessThan: LTNode,
    greaterThan: GTNode,
    valueChange: ValueChangeNode,
    angleChange: AngleChangeNode,
    periodic: PeriodicNode,
    keyPress: KeyPressNode,
    keyTap: KeyTapNode,
};

function recursiveGetUUID(nodes) {
    const newID = uuidv4();
    if (!R.isNil(nodes[newID])) return recursiveGetUUID(nodes);
    return newID;
}

// CONSIDER Use ref to get info out of the nodes for connections
const testData = {
    "64a01e20-8978-410f-9290-3d46a0ebd8ca": {
      "type": "greaterThan",
      "x": 493,
      "y": 374,
      "uuid": "64a01e20-8978-410f-9290-3d46a0ebd8ca",
      "A": 0,
      "B": -10,
      "wasTrue": false,
      "outputs": {
        "TRIGGER": {
          "name": "TRIGGER",
          "noText": true,
          "offsetX": 220,
          "offsetY": 49,
          "targets": [
            {
              "uuid": "0c074bfc-c000-4c86-8435-651fcf886488",
              "field": "PRESS"
            }
          ],
          "valueType": "bool"
        }
      },
      "inputs": {
        "A": {
          "offsetX": 0,
          "offsetY": 29,
          "source": "c2cf5b4d-0e3c-4b17-af9a-f6ad50ca7cfd",
          "sourceField": "X",
          "valueType": "number"
        },
        "B": {
          "offsetX": 0,
          "offsetY": 49,
          "source": "9ad0fbaf-0545-4200-93f9-5591085767ed",
          "sourceField": "value",
          "valueType": "number"
        }
      },
      "selected": false
    },
    "0c074bfc-c000-4c86-8435-651fcf886488": {
      "type": "keyPress",
      "x": 919,
      "y": 444,
      "value": "a",
      "isDown": false,
      "uuid": "0c074bfc-c000-4c86-8435-651fcf886488",
      "inputs": {
        "PRESS": {
          "name": "PRESS",
          "offsetX": 0,
          "offsetY": 39,
          "source": "64a01e20-8978-410f-9290-3d46a0ebd8ca",
          "sourceField": "TRIGGER",
          "valueType": "bool"
        }
      },
      "selected": false
    },
    "9ad0fbaf-0545-4200-93f9-5591085767ed": {
      "type": "number",
      "x": 253,
      "y": 327,
      "value": -10,
      "uuid": "9ad0fbaf-0545-4200-93f9-5591085767ed",
      "outputs": {
        "value": {
          "name": "value",
          "noText": true,
          "offsetX": 120,
          "offsetY": 39,
          "targets": [
            {
              "uuid": "64a01e20-8978-410f-9290-3d46a0ebd8ca",
              "field": "B"
            }
          ],
          "valueType": "number"
        }
      },
      "selected": false
    },
    "cfa5e1e4-98a9-476c-9d46-f4207cee5966": {
      "type": "angleChange",
      "x": 493,
      "y": 466,
      "uuid": "cfa5e1e4-98a9-476c-9d46-f4207cee5966",
      "VALUE": 1,
      "THRESHOLD": 10,
      "totalDelta": 0,
      "lastValue": 0,
      "outputs": {
        "TRIGGER": {
          "name": "TRIGGER",
          "noText": true,
          "offsetX": 220,
          "offsetY": 49,
          "targets": [
            {
              "uuid": "7307b1c5-e22d-4bf1-817e-8f1fe461d319",
              "field": "PRESS"
            }
          ],
          "valueType": "bool"
        }
      },
      "inputs": {
        "ANGLE": {
          "offsetX": 0,
          "offsetY": 29,
          "source": "c2cf5b4d-0e3c-4b17-af9a-f6ad50ca7cfd",
          "sourceField": "Y",
          "valueType": "number"
        },
        "THRESHOLD": {
          "offsetX": 0,
          "offsetY": 49,
          "source": "e6b8601f-03a3-4970-b216-36530c677a42",
          "sourceField": "value",
          "valueType": "number"
        }
      },
      "selected": false
    },
    "e6b8601f-03a3-4970-b216-36530c677a42": {
      "type": "number",
      "x": 306,
      "y": 578,
      "value": 10,
      "uuid": "e6b8601f-03a3-4970-b216-36530c677a42",
      "outputs": {
        "value": {
          "name": "value",
          "noText": true,
          "offsetX": 120,
          "offsetY": 39,
          "targets": [
            {
              "uuid": "cfa5e1e4-98a9-476c-9d46-f4207cee5966",
              "field": "THRESHOLD"
            }
          ],
          "valueType": "number"
        }
      },
      "selected": false
    },
    "c2cf5b4d-0e3c-4b17-af9a-f6ad50ca7cfd": {
      "type": "marker",
      "x": 22,
      "y": 446,
      "ID": 20,
      "timeout": 100,
      "uuid": "c2cf5b4d-0e3c-4b17-af9a-f6ad50ca7cfd",
      "outputs": {
        "DETECT": {
          "name": "DETECT",
          "property": "present",
          "offsetX": 280,
          "offsetY": 39,
          "targets": [],
          "valueType": "bool"
        },
        "X": {
          "name": "X",
          "property": "posX",
          "offsetX": 280,
          "offsetY": 59,
          "targets": [
            {
              "uuid": "64a01e20-8978-410f-9290-3d46a0ebd8ca",
              "field": "A"
            }
          ],
          "valueType": "number"
        },
        "Y": {
          "name": "Y",
          "property": "posY",
          "offsetX": 280,
          "offsetY": 79,
          "targets": [
            {
              "uuid": "cfa5e1e4-98a9-476c-9d46-f4207cee5966",
              "field": "ANGLE"
            }
          ],
          "valueType": "number"
        },
        "ANGLE": {
          "name": "ANGLE",
          "property": "rotation",
          "offsetX": 280,
          "offsetY": 99,
          "targets": [],
          "valueType": "number"
        }
      },
      "inputs": {
        "ID": {
          "offsetX": 0,
          "offsetY": 59,
          "source": null,
          "sourceField": null,
          "valueType": "number"
        },
        "timeout": {
          "offsetX": 0,
          "offsetY": 79,
          "source": null,
          "sourceField": null,
          "valueType": "number"
        },
        "source": {
          "offsetX": 0,
          "offsetY": 99,
          "source": null,
          "sourceField": null,
          "valueType": "feed"
        }
      },
      "selected": false
    },
    "7307b1c5-e22d-4bf1-817e-8f1fe461d319": {
      "type": "keyPress",
      "x": 889,
      "y": 521,
      "value": "i",
      "isDown": false,
      "uuid": "7307b1c5-e22d-4bf1-817e-8f1fe461d319",
      "inputs": {
        "PRESS": {
          "name": "PRESS",
          "offsetX": 0,
          "offsetY": 39,
          "source": "cfa5e1e4-98a9-476c-9d46-f4207cee5966",
          "sourceField": "TRIGGER",
          "valueType": "bool"
        }
      },
      "selected": false
    }
  };

// PETER USE IMMUTABLE
function nodesReducer(state, action) {
    switch (action.type) {
        case "load-nodes": // action = { type: "load-nodes", payload: { big_node_obj } }
            return { ...action.payload };
        case "move-node": // action = { type: "move-node", uuid: node_id, dx: change_in_x, dy: change_in_y }
            state[action.uuid].x = action.x;
            state[action.uuid].y = action.y;
            return { ...state };
        case "connect":
            const { output, input } = action;
            state[input.uuid].inputs[input.name].source = output.uuid;
            state[input.uuid].inputs[input.name].sourceField = output.name;
            state[output.uuid].outputs[output.name].targets.push({
                uuid: input.uuid,
                field: input.name
            });
            return { ...state };
        case "remove-connection":
            const inputData = state[action.input.uuid].inputs[action.input.name];
            // this is a hack, for some reason my calls get duplicated and things go to shit
            if (inputData.source) {
                let outNode = state[inputData.source].outputs[inputData.sourceField];
                // filter out matching output
                outNode.targets = outNode.targets.filter((target) => !(target.uuid === action.input.uuid && target.field === action.input.name));
                // console.log(outNode.targets);
                // clear input reference
                inputData.source = null;
                inputData.sourceField = null;
            }
            // state[action.uuid].inputs[action.name]
            return { ...state };
        case "create-node":
            const newUUID = recursiveGetUUID(state);
            action.payload.uuid = newUUID;
            state[newUUID] = action.payload;
            return { ...state };
        default: throw new Error(`No Action Type in "nodesReducer"`);
    }
}

function dragReducer(state, action) {
    switch (action.type) {
        case "node-selected": return {
            selectedNode: action.uuid,
            isMouseDown: true,
            offsetX: action.offsetX,
            offsetY: action.offsetY,
        };
        case "mouse-release": return { ...state, isMouseDown: false };
        case "clear-selected": return { ...state, selectedNode: "" };
        default: throw new Error(`No Action Type in "dragReducer"`);
    }
}

function connectionReducer(state, action) {
    switch (action.type) {
        case "start": return {
            isConnecting: true,
            outputID: action.output.uuid,
            outputName: action.output.name,
            outputValueType: action.output.valuetype,
        };
        case "release": return { ...state, isConnecting: false };
        default: throw new Error(`No Action Type in "connectionReducer"`);
    }
}

export default function NodeGraph() {
    const [nodes, nodeDispatch] = useReducer(nodesReducer, testData);
    const [dragState, dragDispatch] = useReducer(dragReducer, { selectedNode: "", isMouseDown: false, offsetX: 0, offsetY: 0 });
    const [connectionState, connectionDispatch] = useReducer(connectionReducer, {});
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [showPalette, setShowPalette] = useState({ show: false, x: 0, y: 0 });

    // Drag and drop
    const nodeMouseDownDispatch = (uuid: string, offsetX: number, offsetY: number) => {
        dragDispatch({ type: "node-selected", uuid, offsetX, offsetY });
        setShowPalette({ ...showPalette, show: false });
    };
    const clearSelectedDispatch = () => { dragDispatch({ type: "clear-selected" }) };
    const mouseMoveHandler = (e: MouseEvent) => {
        const { selectedNode, isMouseDown } = dragState;
        setMousePos({ x: e.clientX, y: e.clientY });
        
        if (isMouseDown) {
            nodeDispatch({
                type: "move-node",
                uuid: selectedNode,
                x: e.clientX - dragState.offsetX,
                y: e.clientY - dragState.offsetY,
            });
        }
    };
    const onMouseDown = () => {
        mouseReleaseDispatch();
        clearSelectedDispatch();
        setShowPalette({ ...showPalette, show: false });
    };

    // connection stuff
    const connectionStart = (output) => {
        connectionDispatch({ type: "start", output });
        setShowPalette({ ...showPalette, show: false });
    };
    const connectionRelease = () => { connectionDispatch({ type: "release" }) };
    
    // these connect to the node reducer
    const connectionRemove = (input) => {
        const { source, sourceField, valueType } = nodes[input.uuid].inputs[input.name];
        nodeDispatch({ type: "remove-connection", input });
        connectionDispatch({
            type: "start",
            output: { name: sourceField, uuid: source, valuetype: valueType, },
        });
    };
    const checkConnectionDrop = (uuid, field) => {
        const inputData = nodes[uuid].inputs[field];
        const { isConnecting, outputID, outputName, outputValueType } = connectionState;
        if (isConnecting && inputData.source == null && inputData.valueType == outputValueType) {
            nodeDispatch({
                type: "connect",
                output: { uuid: outputID, name: outputName },
                input: { uuid, name: field },
            });
        }
        connectionDispatch({ type: "release" })
    };
    const connectionPreviewData = { ...connectionState, mousePos };

    // node creation
    const createNode = (node) => { nodeDispatch({ type: "create-node", payload: node }) };

    const mouseReleaseDispatch = () => {
        dragDispatch({ type: "mouse-release" });
        connectionRelease();
    };
    const onMouseUp = () => {
        mouseReleaseDispatch();
        connectionRelease();
    }
    const onRightClick = (e) => {
        setShowPalette({ show: true, x: mousePos.x, y: mousePos.y });
        e.preventDefault();
    }

    // rendering nodes
    const nodeDom = Object.values(nodes).map((n: any) => {
        const NodeComponent = nodeRenderMap[n.type];
        const isSelected = dragState.selectedNode === n.uuid;

        return <NodeComponent
            key={n.uuid}
            {...n}
            isSelected={isSelected}
            nodeMouseDownDispatch={nodeMouseDownDispatch}
            mouseReleaseDispatch={mouseReleaseDispatch}
            connectionStart={connectionStart}
            checkConnectionDrop={checkConnectionDrop}
            connectionRemove={connectionRemove}
        /> 
    });

    return <div id="node-graph" onContextMenu={onRightClick} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={mouseMoveHandler}>
        {nodeDom}
        <Connections nodes={nodes} preview={connectionPreviewData} />
        <NodeGenerator {...showPalette} createNode={createNode}/>
    </div>
}
