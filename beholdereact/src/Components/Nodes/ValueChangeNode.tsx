import GenericNode, { GenericNodeProps } from "./GenericNode";

export default function ValueChangeNode(props: GenericNodeProps) {
    const { value } = props;

    return <GenericNode {...props} nodeType="logic">
        <span className="logic-node-text">Change</span>
    </GenericNode>;
}
