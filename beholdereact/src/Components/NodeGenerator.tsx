import "./NodePalette.css";

export default function NodeGenerator(props) {
    const { show, x, y, createNode } = props;

    const styles = { 
        transform: `translate(${x}px, ${y}px)`,
        display: show ? "block" : "none",
    };

    return <ul id="node-palette" style={styles}>
        <li className="palette-category">
            VARIABLES
            <ul>
                <button className="create-button"
                onClick={() => { createNode({ ...nodeTemplates.number, x, y })}}
                >Number</button>
            </ul>
        </li>

        <li className="palette-category">
            MARKER
            <ul>
                <button className="create-button">Detect Marker</button>
            </ul>
        </li>

        <li className="palette-category">
            KEYS
            <ul>
                <button className="create-button">NOT Gate</button>
                <button className="create-button">AND Gate</button>
                <button className="create-button">OR Gate</button>
                <button className="create-button">Greater Than Gate</button>
                <button className="create-button">Less Than Gate</button>
                <button className="create-button">Between Gate</button>
                <button className="create-button">Value Change Trigger</button>
                <button className="create-button">Angle Change Trigger</button>
                <button className="create-button">Periodic</button>
            </ul>
        </li>

        <li className="palette-category">
            KEYS
            <ul>
                <button className="create-button">Press Key</button>
                <button className="create-button">Tap Key</button>
            </ul>
        </li>

        <li className="palette-category">
            DETECTION
            <ul>
                <button className="create-button">Webcam Detection</button>
            </ul>
        </li>
    </ul>;
}
