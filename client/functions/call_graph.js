import { ref } from "vue";
import { responseData } from "../state";
import { Network } from "vis-network/standalone/esm/vis-network";

const networkInstance = ref(null);

const callGraph = async () => {
    try {
      const graphData = responseData.value;

      const nodes = [];
      const edges = [];
      for (const caller in graphData) {
        nodes.push({ id: caller, label: caller });
        for (const callee of graphData[caller].calls_to) {
          edges.push({ from: caller, to: callee });
        }
      }

      // Render the graph
      const container = document.getElementById("chartCanvas");
      const data = { nodes, edges };
      const options = {};
      networkInstance.value = new Network(container, data, options);
    } catch (error) {
      console.error("Error fetching or displaying graph data:", error);
    }

    return networkInstance;
};

export default callGraph;