import GenericNode, { GenericNodeProps } from "./GenericNode";

export default function KeyTapNode(props: GenericNodeProps) {
    const { value } = props;

    const keyOptions = KEY_MAPPINGS.map((k) => <option key={k.key} value={k.key}>{k.text}</option>)
    return <GenericNode {...props} nodeType="keyboard">
        <select className="node-input node-select-input key-select" defaultValue={value}>
            {keyOptions}
        </select>
    </GenericNode>;
}
