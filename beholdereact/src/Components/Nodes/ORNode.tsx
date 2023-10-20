import GenericNode, { GenericNodeProps } from "./GenericNode";

export default function ORNode(props: GenericNodeProps) {
    const { value } = props;

    return <GenericNode {...props} nodeType="logic">
        <span className="logic-node-text">OR</span>
    </GenericNode>;
}
