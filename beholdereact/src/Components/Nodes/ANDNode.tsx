import GenericNode, { GenericNodeProps } from "./GenericNode";

export default function ANDLogicNode(props: GenericNodeProps) {
    const { value } = props;

    return <GenericNode {...props} nodeType="logic">
        <span className="logic-node-text">AND</span>
    </GenericNode>;
}
