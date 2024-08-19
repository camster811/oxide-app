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

        // Extract nodes
        for (const nodeId in graph._node) {
            nodes.push({ id: nodeId, label: nodeId });
        }

        // Extract edges from _adj
        for (const fromNode in graph._adj) {
            for (const toNode in graph._adj[fromNode]) {
                edges.push({ from: fromNode, to: toNode });
            }
        }

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
                width: 2
            },
            physics: {
                enabled: false
            }
        };
        networkInstance.value = new Network(container, data, options);
    } catch (error) {
        console.error("Error fetching or displaying graph data:", error);
    }

    return networkInstance;
};

export default callGraph;