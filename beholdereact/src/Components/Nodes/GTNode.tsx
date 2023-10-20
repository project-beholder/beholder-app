import GenericNode, { GenericNodeProps } from "./GenericNode";

export default function GTNode(props: GenericNodeProps) {
    const { value } = props;

    return <GenericNode {...props} nodeType="logic">
        <span className="logic-node-text">{"A > B"}</span>
    </GenericNode>;
}