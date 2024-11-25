<template>
    <div class="visualizer-container">
        <div class="function-list">
            <ul>
                <li v-for="func in functions" 
                :key="func" 
                @click="selectFunction(func)"
                :class="{ selected: func == selectedFunction }">
                    {{ func }}
                </li>
            </ul>
        </div>
        <div id="network"></div>
        <div v-if="loading" class="loading-overlay">
            <div class="loading-spinner"></div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import domtoimage from "dom-to-image";

cytoscape.use(dagre);

export default {
    props: {
        file: String,
        selectedModule: String,
        selectedCollection: String,
        oid: String,
    },
    emits: ["update:downloadChart"],
    setup(props, {emit}) {
        const functions = ref([]);
        const selectedFunction = ref(null);
        const graphData = ref({});
        const loading = ref(true);

        const plotFlowGraph = async (func) => {
            const container = document.getElementById("network");
            if (!container) {
                console.error("Container element with ID 'network' not found.");
                return;
            }
            // Clear any existing plot
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            const elements = [];
            const data = graphData.value;
            console.log(data);

            // Get the blocks and edges related to the selected function
            const functionBlocks = data.functions[func].blocks;
            const blockCalls = data.block_calls;
            const functionCalls = data.function_calls;

            // Create a set of node IDs
            const nodeIds = new Set();

            // Create a set to track unique edges
            const edgeSet = new Set();

            // Add nodes to elements
            functionBlocks.forEach((blockId) => {
                const node = data.nodes.find((node) => node["block id"] === blockId);
                if (node) {
                    const instructions = node.instructions
                        .map((instr) => {
                            if (Array.isArray(instr)) {
                                // Handle array format instructions
                                return `${instr[0]}: ${instr[1]}`;
                            }
                        })
                        .join("\n\n");

                    // Find the function name for the block
                    const functionName = Object.keys(data.functions).find((fn) =>
                        data.functions[fn].blocks.includes(blockId)
                    );

                    elements.push({
                        data: {
                            id: node["block id"],
                            label: `Block ${node["block id"]}\n\n${instructions}\n\nFunction: ${functionName}`,
                            instructions: instructions,
                        },
                    });
                    nodeIds.add(node["block id"]);
                }
            });

            // Add nodes and edges for blocks that call blocks within the function
            functionBlocks.forEach((blockId) => {
                const blockCall = blockCalls[blockId];
                if (blockCall) {
                    // console.log(`Block ${blockId} is called by:`, blockCall.called_by);
                    blockCall.called_by.forEach((callerId) => {
                        if (!nodeIds.has(callerId)) {
                            const callerNode = data.nodes.find(
                                (node) => node["block id"] === callerId
                            );
                            if (callerNode) {
                                const instructions = callerNode.instructions
                                    .map((instr) => {
                                        if (Array.isArray(instr)) {
                                            return `${instr[0]}: ${instr[1]}`;
                                        }
                                    })
                                    .join("\n\n");

                                const functionName = Object.keys(data.functions).find((fn) =>
                                    data.functions[fn].blocks.includes(callerId)
                                );  

                                elements.push({
                                    data: {
                                        id: callerNode["block id"],
                                        label: `Block ${callerNode["block id"]}\n\n${instructions}\n\nFunction: ${functionName}`,
                                        instructions: instructions,
                                    },
                                });
                                nodeIds.add(callerNode["block id"]);
                            }
                        }
                        const edgeKey = `${callerId}-${blockId}`;
                        if (
                            nodeIds.has(callerId) &&
                            nodeIds.has(blockId) &&
                            !edgeSet.has(edgeKey)
                        ) {
                            elements.push({
                                data: {
                                    source: callerId,
                                    target: blockId,
                                },
                            });
                            edgeSet.add(edgeKey);
                        } else {
                            console.error(
                                `Ghidra error: Cannot create edge from ${callerId} to ${blockId} because the target does not exist or edge is duplicate.`
                            );
                        }
                    });
                }
            });

            // Add nodes and edges for blocks within the function that call blocks outside of the function
            functionBlocks.forEach((blockId) => {
                const blockCall = blockCalls[blockId];
                if (blockCall) {
                    // console.log(`Block ${blockId} calls:`, blockCall.calls);
                    blockCall.calls.forEach((calleeId) => {
                        if (!nodeIds.has(calleeId)) {
                            const calleeNode = data.nodes.find(
                                (node) => node["block id"] === calleeId
                            );
                            if (calleeNode) {
                                const instructions = calleeNode.instructions
                                    .map((instr) => {
                                        if (Array.isArray(instr)) {
                                            return `${instr[0]}: ${instr[1]}`;
                                        }
                                    })
                                    .join("\n\n");

                                const functionName = Object.keys(data.functions).find((fn) =>
                                    data.functions[fn].blocks.includes(calleeId)
                                );

                                elements.push({
                                    data: {
                                        id: calleeNode["block id"],
                                        label: `Block ${calleeNode["block id"]}\n\n${instructions}\n\nFunction: ${functionName}`,
                                        instructions: instructions,
                                    },
                                });
                                nodeIds.add(calleeNode["block id"]);
                            }
                        }
                        const edgeKey = `${blockId}-${calleeId}`;
                        if (
                            nodeIds.has(blockId) &&
                            nodeIds.has(calleeId) &&
                            !edgeSet.has(edgeKey)
                        ) {
                            elements.push({
                                data: {
                                    source: blockId,
                                    target: calleeId,
                                },
                            });
                            edgeSet.add(edgeKey);
                        } else {
                            console.error(
                                `Ghidra error: Cannot create edge from ${blockId} to ${calleeId} because the target does not exist or edge is duplicate.`
                            );
                        }
                    });
                }
            });

            // Add nodes and edges for function calls within the function
            functionBlocks.forEach((blockId) => {
                const functionCall = functionCalls[blockId];
                if (functionCall) {
                    // console.log(
                    //     `Block ${blockId} has function calls:`,
                    //     functionCall.calls
                    // );
                    functionCall.calls.forEach((calleeId) => {
                        if (typeof calleeId === "string") {
                            // Create a node for the string destination if it doesn't exist
                            if (!nodeIds.has(calleeId)) {
                                elements.push({
                                    data: {
                                        id: calleeId,
                                        label: calleeId,
                                    },
                                });
                                nodeIds.add(calleeId);
                            }
                            const edgeKey = `${blockId}-${calleeId}`;
                            if (!edgeSet.has(edgeKey)) {
                                elements.push({
                                    data: {
                                        source: blockId,
                                        target: calleeId,
                                    },
                                });
                                edgeSet.add(edgeKey);
                            }
                        }
                    });
                }
            });

            console.log("Elements for Cytoscape:", elements);

            const cy = cytoscape({
                container: container,
                elements: elements,
                style: [
                    {
                        selector: "node",
                        style: {
                            "background-color": "#1f77b4",
                            label: "data(label)",
                            "text-valign": "center",
                            "text-justification": "left",
                            color: "#fff",
                            shape: "roundrectangle",
                            width: "label",
                            height: "label",
                            padding: "10px",
                            "text-wrap": "wrap",
                            "text-max-width": "300px",
                            "font-family": "monospace",
                            "font-size": "10px",
                        },
                    },
                    {
                        selector: "edge",
                        style: {
                            width: 2,
                            "line-color": "#9dbaea",
                            "target-arrow-color": "#9dbaea",
                            "target-arrow-shape": "triangle",
                            "arrow-scale": 1.5,
                            "curve-style": "bezier",
                        },
                    },
                ],
                layout: {
                    name: "dagre",
                    fit: true,
                    padding: 10,
                },
                minZoom: 0.1, // Minimum zoom level
                maxZoom: 2, // Maximum zoom level
                zoom: 1, // Initial zoom level
                wheelSensitivity: 0.2,
            });
            loading.value = false;
        };

        const fetchDataAndPlot = async () => {
            try {
                loading.value = true;
                const url = new URL("http://localhost:8000/api/retrieve");
                url.searchParams.append("selected_module", props.selectedModule);
                url.searchParams.append(
                    "selected_collection",
                    props.selectedCollection
                );

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("API Response:", data);

                const graphDataResponse = data[props.oid];
                if (!graphDataResponse) {
                    console.error(`OID ${props.oid} not found in data`);
                    return;
                }

                // Store the list of functions and graph data
                functions.value = Object.keys(graphDataResponse["functions"]).filter(func => graphDataResponse["functions"][func].blocks.length > 0);
                graphData.value = graphDataResponse;

                // Plot the first function by default
                if (functions.value.length > 0) {
                    selectedFunction.value = functions.value[0];
                    plotFlowGraph(selectedFunction.value);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                loading.value = false;
            }
        };

        const selectFunction = (func) => {
            selectedFunction.value = func;
            plotFlowGraph(func);
        };

        onMounted(() => {
            fetchDataAndPlot();
            emit("update:downloadChart", downloadChart);
        });

        const downloadChart = () => {
            const container = document.getElementById("network");

            // Temporarily set the background to dark
            container.style.backgroundColor = "#333";

            domtoimage.toSvg(container)
                .then((dataUrl) => {
                    // Reset the background color
                    container.style.backgroundColor = "";

                    const link = document.createElement("a");
                    link.href = dataUrl;
                    link.download = selectedFunction.value + '.svg';
                    link.click();
                })
                .catch((error) => {
                    console.error("Error generating SVG:", error);
                    container.style.backgroundColor = "";
                });
        };

        watch(
            () => [
                props.selectedModule,
                props.selectedCollection,
                props.file,
                props.oid,
            ],
            () => {
                fetchDataAndPlot();
            }
        );

        return {
            functions,
            selectedFunction,
            selectFunction,
            plotFlowGraph,
            loading,
        };
    },
};
</script>

<style scoped>
.visualizer-container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.function-list {
    width: 200px;
    margin-right: 20px;
    max-height: 100%;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.function-list li.selected {
    background: salmon;
    
}

#network {
    flex-grow: 1;
    width: 100%;
    height: 100%;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
}

.loading-spinner {
    border: 16px solid #f3f3f3;
    border-top: 16px solid #3498db;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
