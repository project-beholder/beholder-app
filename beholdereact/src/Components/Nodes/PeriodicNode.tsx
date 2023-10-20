import GenericNode, { GenericNodeProps } from "./GenericNode";

export default function PeriodicNode(props: GenericNodeProps) {
    const { value } = props;

    return <GenericNode {...props} nodeType="logic">
        <span className="logic-node-text">Periodic</span>
    </GenericNode>;
}
