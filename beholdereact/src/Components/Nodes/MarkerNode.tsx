import GenericNode, { GenericNodeProps } from "./GenericNode";
import generateArucoMarkerGraphic from "../../Utils/MarkerGraphic/GenMarker";

export default function MarkerNode(props: GenericNodeProps) {
    const { value, ID } = props;

    return <GenericNode {...props} nodeType="marker">
        {generateArucoMarkerGraphic(ID)}
    </GenericNode>;
}
