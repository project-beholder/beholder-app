import GenericNode, { GenericNodeProps } from "./GenericNode";
import { KEY_MAPPINGS } from "../../Constants/Keys";

export default function KeyPressNode(props: GenericNodeProps) {
    const { value } = props;

    const keyOptions = KEY_MAPPINGS.map((k) => <option key={k.key} value={k.key}>{k.text}</option>)
    return <GenericNode {...props} nodeType="keyboard">
        <select className="node-input node-select-input key-select" defaultValue={value}>
            {keyOptions}
        </select>
    </GenericNode>;
}
