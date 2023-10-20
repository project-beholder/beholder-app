import GenericNode, { GenericNodeProps } from "./GenericNode";

export default function AngleChangeNode(props: GenericNodeProps) {
    const { value } = props;

    return <GenericNode {...props} nodeType="logic">
        <span className="logic-node-text">θ Change</span>
    </GenericNode>;
}
