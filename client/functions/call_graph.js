import { ref } from "vue";
import { Network } from "vis-network/standalone/esm/vis-network";
import { responseData, chartInstance } from "../state";

const networkInstance = ref(null);

const callGraph = async () => {
    chartInstance.value = true;

    try {
        const graphData = responseData.value;

        const nodes = [];
        const edges = [];
        const graphId = Object.keys(graphData)[0]; // Assuming there's only one graph object
        const graph = graphData[graphId];
        const callCounts = {};


        // Nodes
        for (const nodeId in graph._node) {
            callCounts[nodeId] = { incomingCalls: 0, outgoingCalls: 0 };
            const node = graph._node[nodeId];
            nodes.push({ 
                id: nodeId, 
                label: node.label || nodeId, // Use node label if available
                title: `Node ID: ${nodeId}\nTimes called: ${callCounts[nodeId].incomingCalls}\nCalls made: ${callCounts[nodeId].outgoingCalls}`
            });
        }

        // Edges
        for (const fromNode in graph._adj) {
            for (const toNode in graph._adj[fromNode]) {
                edges.push({ from: fromNode, to: toNode });
                // Increment the call counters
                callCounts[fromNode].outgoingCalls += 1;
                callCounts[toNode].incomingCalls += 1;
            }
        }

        // Update nodes with call counts
        nodes.forEach(node => {
            const nodeId = node.id;
            node.title = `Node ID: ${nodeId}\nLabel: ${node.label}\nTimes called: ${callCounts[nodeId].incomingCalls}\nCalls made: ${callCounts[nodeId].outgoingCalls}`;
        });


        // Log nodes and edges to verify structure
        console.log("Nodes:", nodes);
        console.log("Edges:", edges);

        // Render the graph
        const container = document.getElementById("network");
        if (!container) {
            console.error("Container element not found");
            return;
        }

        const data = { nodes, edges };
        const options = {
            nodes: {
                shape: 'dot',
                size: 16,
                font: {
                    size: 32,
                    color: '#ffffff'
                },
                borderWidth: 2
            },
            edges: {
                width: 2,
                font: {
                    size: 12,
                    align: 'middle'
                },
                arrows: {
                    to: { enabled: true, scaleFactor: 1.2 }
                }
            },
            layout: {
                hierarchical: {
                    direction: 'UD', // Up-Down direction
                    sortMethod: 'directed', // Sort by directed edges
                    levelSeparation: 150, // Adjust level separation
                    nodeSpacing: 200 // Adjust node spacing
                }
            },
            physics: {
                enabled: true, // Enable physics for better positioning
                stabilization: {
                    iterations: 200, // Increase iterations for better stabilization
                },
            },
            interaction: {
                keyboard: true, // Enable keyboard navigation
                tooltipDelay: 200
            }
        };

        networkInstance.value = new Network(container, data, options);


    } catch (error) {
        console.error("Error creating call graph:", error);
    }

    return networkInstance;
};

export default callGraph;