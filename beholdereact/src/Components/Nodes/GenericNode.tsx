import { MouseEvent } from "react";
import "../Node.css"
import { input } from "@cycle/dom";

export type GenericNodeProps = {
    x: number,
    y: number,
    uuid: string,
    isSelected: boolean,
    nodeMouseDownDispatch: Function,
    mouseReleaseDispatch: Function,
    connectionStart: Function,
    checkConnectionDrop: Function,
    connectionRemove: Function,
    ID?: number, // just for markers :(
    inputs?: any,
    outputs?: any,
    nodeType?: string,
    children?: React.ReactNode,
    value?: any,
};

export default function GenericNode(props: GenericNodeProps) {
    const { x, y, uuid, children, inputs, outputs, nodeType, isSelected, connectionStart, connectionRemove, checkConnectionDrop } = props;

    const isDark = nodeType === "keyboard";
    const className = `draggable-node ${nodeType}-node ${isSelected && "selected"} ${isDark && "dark-node"}`;
    const style = { transform: `translate(${x}px, ${y}px)`};

    const onMouseDown = (e: MouseEvent) => {
        props.nodeMouseDownDispatch(uuid, e.clientX - x, e.clientY - y);
        e.stopPropagation()
    };
    const onMouseUp = (e: MouseEvent) => { props.mouseReleaseDispatch(); e.stopPropagation(); };

    const outputMouseDown = (e: MouseEvent) => {
        e.stopPropagation();
        connectionStart(e.target.dataset);
    };

    const inputMouseDown = (e: MouseEvent) => {
        e.stopPropagation();
        if (inputs[e.target.dataset.name].source) connectionRemove(e.target.dataset);
    }

    const inputMouseUp = (e: MouseEvent) => {
        checkConnectionDrop(uuid, e.target.dataset.name);
    }

    return <div
        id={uuid}
        className={className}
        style={style}
        data-uuid={uuid}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}>
        <div className="node-inputs">
            {
                inputs && Object.entries(inputs).map(
                    ([key, { offsetx, offsety, valueType, source }]: [string, any]) =>
                        <span
                            className={`input-point ${ source !== null ? "connected" : "" }`}
                            data-type="input"
                            data-valuetype={valueType}
                            data-offsetx={offsetx}
                            data-offsety={offsety}
                            data-name={key}
                            data-uuid={uuid}
                            key={key}
                            onMouseDown={inputMouseDown}
                            onMouseUp={inputMouseUp}
                            >
                            {key}
                        </span>
                )
            }    
        </div>
        {children}
        <div className="node-outputs center-outputs">
            {
                outputs && Object.entries(outputs).map(
                    ([key, { offsetx, offsety, valueType }]: [string, any]) =>
                        <span
                            className="output-point"
                            data-type="output"
                            data-valuetype={valueType}
                            data-offsetx={offsetx}
                            data-offsety={offsety}
                            data-name={key}
                            data-uuid={uuid}
                            key={key}
                            onMouseDown={outputMouseDown}
                            >
                            {key}
                        </span>
                )
            }    
        </div>
    </div>
}
