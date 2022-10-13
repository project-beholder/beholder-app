# Dataflow for Beholder App
this file details the datastructures and flow through the application including the programming interface, keyboard emulation, and marker detection.

## Core elements

1. **Detection Source**: Provides a constant update of markers to the application.
2. **Logic Graph**: A graph of nodes that parse the detected markers and can apply logic to them to script interactions.
3. **Outputs**: Endpoints stored in the graph that output keyboard emulation or...