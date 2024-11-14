<template>
    <div class="visualizer-container">
        <div id="network"></div>
        <div id="infoBox" class="info-box"></div>
    </div>
</template>

<script>
import { onMounted, watch } from 'vue';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);

export default {
    props: {
        file: String,
        selectedModule: String,
        selectedCollection: String,
        oid: String,
    },
    setup(props) {
        const plotFlowGraph = async (graphData) => {
            const container = document.getElementById('network');
            if (!container) {
                console.error("Container element with ID 'network' not found.");
                return;
            }
            // Clear any existing plot
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            const elements = [];
            const data = graphData;

            // Create a set of node IDs
            const nodeIds = new Set(data.nodes.map(node => node.id));

            // Add nodes to elements
            data.nodes.forEach(node => {
                const instructions = node.instructions.map(instr => {
                    if (Array.isArray(instr)) {
                        // Handle array format instructions
                        return `${instr[0]}: ${instr[1]}`;
                    } else {
                        // Handle object format instructions
                        return `Name: ${instr.name}\n` +
                               `Vaddr: ${instr.vaddr}\n` +
                               `Params: ${(instr.params || []).join(', ')}\n` +
                               `RetType: ${instr.retType}\n` +
                               `Signature: ${instr.signature}\n` +
                               `Returning: ${instr.returning}`;
                    }
                }).join('\n\n');

                elements.push({
                    data: {
                        id: node.id,
                        label: `Block ${node.id}\n${instructions}`,
                        instructions: instructions
                    }
                });
            });

            // Add edges to elements, only if both source and target nodes exist
            data.edges.forEach(edge => {
                if (nodeIds.has(edge.from) && nodeIds.has(edge.to)) {
                    elements.push({
                        data: {
                            source: edge.from,
                            target: edge.to
                        }
                    });
                }
            });

            console.log("Elements for Cytoscape:", elements);

            // Initialize Cytoscape
            const cy = cytoscape({
                container: container,
                elements: elements,
                style: [
                    {
                        selector: 'node',
                        style: {
                            'background-color': '#1f77b4',
                            'label': 'data(label)',
                            'text-valign': 'center',
                            'color': '#fff',
                            'shape': 'roundrectangle',
                            'width': 'label',
                            'height': 'label',
                            'padding': '10px',
                            'text-wrap': 'wrap',
                            'text-max-width': '200px',
                            'font-family': 'monospace',
                            'font-size': '10px'
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'width': 2,
                            'line-color': '#9dbaea',
                            'target-arrow-color': '#9dbaea',
                            'target-arrow-shape': 'triangle',
                            'arrow-scale': 1.5,
                            'curve-style': 'bezier'
                        }
                    }
                ],
                layout: {
                    name: 'dagre', 
                    fit: true, 
                    padding: 10 
                },
                minZoom: 0.1, // Minimum zoom level
                maxZoom: 2, // Maximum zoom level
                zoom: 1, // Initial zoom level
                wheelSensitivity: 0.2
            });

            cy.on('tap', 'node', function(evt) {
                const node = evt.target;
                console.log('Tapped node', node.id());
            });

        };

        const fetchDataAndPlot = async () => {
            try {
                const url = new URL("http://localhost:8000/api/retrieve");
                url.searchParams.append("selected_module", props.selectedModule);
                url.searchParams.append("selected_collection", props.selectedCollection);

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('API Response:', data);

                const graphData = data[props.oid];
                if (!graphData) {
                    console.error(`OID ${props.oid} not found in data`);
                    return;
                }

                plotFlowGraph(graphData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        onMounted(() => {
            fetchDataAndPlot();
        });

        watch(() => [props.selectedModule, props.selectedCollection, props.file, props.oid], () => {
            fetchDataAndPlot();
        });

        return {};
    },
};
</script>

<style scoped>
.visualizer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

#network {
    width: 100%;
    height: 100%;
}

.info-box {
    position: fixed;
    right: 10px;
    top: 10px;
    background-color: white;
    border: 1px solid black;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    width: 200px;
}
</style>