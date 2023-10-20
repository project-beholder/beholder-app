export default function Connections(props) {
    const { nodes, preview } = props;

    let previewLine = null;
    if (preview.isConnecting) {
        const { outputID, outputName, mousePos } = preview;
        const heldNode = nodes[outputID];
        const { offsetX, offsetY } = nodes[outputID].outputs[outputName];

        const x1 = heldNode.x + offsetX;
        const y1 = heldNode.y + offsetY;
        const x2 = mousePos.x;
        const y2 = mousePos.y;
        
        const cp = Math.max(Math.abs((x1 - x2)/2), 50);
        
        const midX1 = x1 + cp;
        const midX2 = x2 - cp;
        // console.log(`M ${x1} ${y1} C ${midX1} ${y1}, ${midX2} ${y2}, ${x2} ${y2}`);
        previewLine = (<path
            key={`c-p`}
            className="preview-path visible"
            strokeLinecap="round"
            d={`M ${x1} ${y1} C ${midX1} ${y1}, ${midX2} ${y2}, ${x2} ${y2}`}
            fill="transparent">
        </path>);
    }

    const connections = Object.values(nodes)
        .filter((n) => n.outputs)
        .reduce((acc, n) => {
            Object.values(n.outputs)
                .forEach((o) => {
                    const x1 = n.x + o.offsetX;// + panX;
                    const y1 = n.y + o.offsetY;// + panY;

                    o.targets.forEach((t) => {
                        const x2 = nodes[t.uuid].x + nodes[t.uuid].inputs[t.field].offsetX;// + panX;
                        const y2 = nodes[t.uuid].y + nodes[t.uuid].inputs[t.field].offsetY;// + panY;
                        // const curveX = x1 + 30; // x1 + (x2 - x1)/6;
            
                        const cp = Math.max(Math.abs((x2 - x1) / 2), 50);
            
                        const midX1 = x1 + cp;
                        const midX2 = x2 - cp;

                        acc.push(<path
                            key={`c-${acc.length}`}
                            className="connection-path"
                            strokeLinecap="round"
                            d={`M ${x1} ${y1} C ${midX1} ${y1}, ${midX2} ${y2}, ${x2} ${y2}`}
                            fill="transparent"
                        ></path>);
                    });
                });
            return acc;
        }, []);

    return <svg id="connection-lines">{connections}{previewLine}</svg>;
}
