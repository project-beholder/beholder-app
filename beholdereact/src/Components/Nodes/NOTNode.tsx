import GenericNode, { GenericNodeProps } from "./GenericNode";

export default function NOTNode(props: GenericNodeProps) {
    const { value } = props;

    return <GenericNode {...props} nodeType="logic">
        <span className="logic-node-text">NOT</span>
    </GenericNode>;
}
