import GenericNode, { GenericNodeProps } from "./GenericNode";

export default function BetweenNode(props: GenericNodeProps) {
    const { value } = props;

    return <GenericNode {...props} nodeType="logic">
        <span className="logic-node-text">{"A < x < B"}</span>
    </GenericNode>;
}
