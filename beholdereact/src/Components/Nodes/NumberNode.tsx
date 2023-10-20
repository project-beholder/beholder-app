import GenericNode, { GenericNodeProps } from "./GenericNode";

export default function NumberNode(props: GenericNodeProps) {
    const { value } = props;

    return <GenericNode {...props} nodeType="number">
        <input className="node-input node-number-input" type="number" min="-10000" max="10000" defaultValue={value}></input>
    </GenericNode>;
}
