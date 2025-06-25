import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge, } from "reactflow";
import "reactflow/dist/style.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FlowStartNode from "./FlowStartNode";
import TemplateNode from "./TemplateNode";
import CustomEdge from "./CustomEdge";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";

const normalize = (str) =>
  str
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

export default function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { user } = useAuth();
  const [savedFlows, setSavedFlows] = useState(() => {
    // Load from localStorage on mount
    const data = localStorage.getItem("savedFlows");
    return data ? JSON.parse(data) : [];
  });
  const [loadingFlow, setLoadingFlow] = useState(false);
  const [mode, setMode] = useState(() => {
    const data = localStorage.getItem("savedFlows");
    const flows = data ? JSON.parse(data) : [];
    return flows.length > 0 ? "table" : "edit";
  });

  const nodeTypes = useMemo(
    () => ({
      flowStartNode: FlowStartNode,
      templateNode: TemplateNode,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      custom: CustomEdge,
    }),
    []
  );

  const handleDelete = useCallback(
    (id) => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
    },
    [setNodes]
  );

  const handleClone = useCallback(
    (template, position) => {
      const newId = `clone-${Date.now()}`;
      const offset = 50;
      const containerMeta = template.container_meta || {};

      const newNode = {
        id: newId,
        type: "templateNode",
        position: {
          x: position.x + offset,
          y: position.y + offset,
        },
        data: {
          label: `${template.element_name} (Clone)`,
          image: template.image_url || "",
          category: template.category,
          meta: containerMeta.data || "",
          sampleText: containerMeta.sampleText || "",
          selected: false,
          status: template.status,
          onDelete: () => handleDelete(newId),
          onClone: () =>
            handleClone(template, {
              x: position.x + offset,
              y: position.y + offset,
            }),
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, handleDelete]
  );

  const createTemplateNode = useCallback(
    (template, position, isActive) => {
      const id = `template-${template.id}`;
      const containerMeta = template.container_meta || {};

      return {
        id,
        type: "templateNode",
        position,
        data: {
          label: template.element_name,
          image: template.image_url || "",
          category: template.category,
          meta: containerMeta.data || "",
          sampleText: containerMeta.sampleText || "",
          selected: isActive,
          status: template.status,
          onDelete: () => handleDelete(id),
          onClone: () => handleClone(template, position),
        },
      };
    },
    [handleDelete, handleClone]
  );

  const createEdgesFromSelectedNodes = (selectedNodes) => {
    if (selectedNodes.length === 0) return [];

    const edges = [
      {
        id: `start-${selectedNodes[0].id}`,
        source: "start",
        target: selectedNodes[0].id,
        type: "custom",
        animated: true,
        style: { stroke: "#0ea5e9", strokeWidth: 2 },
        markerEnd: { type: "arrowclosed", color: "#0ea5e9" },
      },
    ];

    for (let i = 1; i < selectedNodes.length; i++) {
      edges.push({
        id: `${selectedNodes[i - 1].id}-${selectedNodes[i].id}`,
        source: selectedNodes[i - 1].id,
        target: selectedNodes[i].id,
        type: "custom",
        animated: true,
        style: { stroke: "#0ea5e9", strokeWidth: 2 },
        markerEnd: { type: "arrowclosed", color: "#0ea5e9" },
      });
    }
    return edges;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!user?.customer_id) return;

      try {
        const templateRes = await fetch(
          `${API_ENDPOINTS.TEMPLATES.GET_ALL}?customer_id=${user.customer_id}`,
          {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const templateData = await templateRes.json();

        const campaignRes = await fetch(
          `https://api.foodchow.com/api/UserMaster/GetWhatsappNotificationCampaign?shop_id=${user.customer_id}`
        );
        const campaignData = await campaignRes.json();

        const activeNotifications = new Set(
          campaignData?.data
            ?.filter((item) => item.status === 1)
            .map((item) => normalize(item.notification_type))
        );

        if (!Array.isArray(templateData.templates)) {
          console.error("Invalid template response format");
          return;
        }

        // Filter templates that match active notification types
        const matchedTemplates = templateData.templates.filter((template) =>
          activeNotifications.has(normalize(template.element_name))
        );

        // Show toast if no templates matched
        if (matchedTemplates.length === 0) {
          toast.info("No matching templates found for active notifications.");
        }

        const COLUMNS =4;
        const HORIZONTAL_GAP = 400; 
        const VERTICAL_GAP = 320;   
        const START_NODE_WIDTH = 300; 

        const startNode = {
          id: "start",
          type: "flowStartNode",
          position: { x: 0, y: 100 },
          data: {
            keywords: [],
            caseSensitive: false,
            regex: "",
            onAddKeyword: (word) =>
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === "start"
                    ? {
                        ...node,
                        data: {
                          ...node.data,
                          keywords: [...node.data.keywords, word],
                        },
                      }
                    : node
                )
              ),
            onRemoveKeyword: (index) =>
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === "start"
                    ? {
                        ...node,
                        data: {
                          ...node.data,
                          keywords: node.data.keywords.filter(
                            (_, i) => i !== index
                          ),
                        },
                      }
                    : node
                )
              ),
            onChangeRegex: (value) =>
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === "start"
                    ? { ...node, data: { ...node.data, regex: value } }
                    : node
                )
              ),
            onToggleCaseSensitive: () =>
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === "start"
                    ? {
                        ...node,
                        data: {
                          ...node.data,
                          caseSensitive: !node.data.caseSensitive,
                        },
                      }
                    : node
                )
              ),
            onChooseTemplate: () => alert("Choose Template Clicked"),
          },
        };

        const templateNodes = matchedTemplates.map((template, index) => {
          const col = index % COLUMNS;
          const row = Math.floor(index / COLUMNS);
          const position = {
            x: START_NODE_WIDTH + 50 + col * HORIZONTAL_GAP, // 50px gap after start node
            y: 100 + row * VERTICAL_GAP,
          };
          return createTemplateNode(template, position, true);
        });

        const selectedNodes = templateNodes.filter((n) => n.data.selected);
        const newEdges = createEdgesFromSelectedNodes(selectedNodes);

        if (isMounted) {
          setNodes([startNode, ...templateNodes]);
          setEdges(newEdges);
        }
      } catch (err) {
        console.error("Failed to fetch templates or campaigns:", err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user?.customer_id, createTemplateNode]);

  const onConnect = useCallback(
    (params) => {
      const { source, target } = params;

      if (source === target) return;

      const targetNode = nodes.find((n) => n.id === target);
      if (targetNode?.type === "flowStartNode") return;

      const isDuplicate = edges.some(
        (edge) => edge.source === source && edge.target === target
      );
      if (isDuplicate) return;

      if (source === "start") {
        const alreadyConnected = edges.some((edge) => edge.source === "start");
        if (alreadyConnected) {
          toast.error("Only one template can be connected from Flow Start.");
          return;
        }
      }

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "custom",
            animated: true,
            style: { stroke: "#0ea5e9", strokeWidth: 2 },
            markerEnd: { type: "arrowclosed", color: "#0ea5e9" },
          },
          eds
        )
      );
    },
    [edges, nodes, setEdges]
  );

  // Save current flow to localStorage
  const handleSaveFlow = () => {
    const name = prompt("Enter a name for this flow:");
    if (!name) return;
    const newFlow = {
      id: Date.now(),
      name,
      nodes,
      edges,
      date: new Date().toISOString(),
    };
    const updated = [newFlow, ...savedFlows];
    setSavedFlows(updated);
    localStorage.setItem("savedFlows", JSON.stringify(updated));
    toast.success("Flow saved!");
    setMode("table");
    setNodes([]); // Clear the flow editor after saving
    setEdges([]);
    // --- Backend example (commented) ---
    // fetch('/api/saveFlow', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, nodes, edges }),
    // });
  };

  // Load a flow from the table
  const handleLoadFlow = (flow) => {
    setLoadingFlow(true);
    setNodes(flow.nodes);
    setEdges(flow.edges);
    setMode("edit");
    setTimeout(() => setLoadingFlow(false), 500); 
    toast.info(`Loaded flow: ${flow.name}`);
  };

  // Delete a flow from the table
  const handleDeleteFlow = (id) => {
    const updated = savedFlows.filter((f) => f.id !== id);
    setSavedFlows(updated);
    localStorage.setItem("savedFlows", JSON.stringify(updated));
    toast.success("Flow deleted");
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      {mode === "table" && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Saved Flows</h2>
            <button
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded font-medium"
              onClick={() => {
                setMode("edit");
                setNodes([]);
                setEdges([]);
              }}
            >
              Add Flow
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full bg-white rounded-2xl shadow overflow-hidden text-sm text-center table-auto">
              <thead className="bg-[#F4F4F4] border-b-2 border-gray-300">
                <tr>
                  <th className="px-2 py-3">Name</th>
                  <th className="px-2 py-3">Saved Date</th>
                  <th className="px-2 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {savedFlows.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-gray-500 py-4">No saved flows.</td>
                  </tr>
                ) : (
                  savedFlows.map((flow) => (
                    <tr key={flow.id} className="border-b last:border-b-0">
                      <td className="px-2 py-2 font-medium">{flow.name}</td>
                      <td className="px-2 py-2">{new Date(flow.date).toLocaleString()}</td>
                      <td className="px-2 py-2 flex items-center justify-center gap-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                          onClick={() => handleLoadFlow(flow)}
                          disabled={loadingFlow}
                        >
                          Load
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                          onClick={() => handleDeleteFlow(flow.id)}
                          disabled={loadingFlow}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {mode === "edit" && (
        <>
          <button
            className="mb-4 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded font-medium"
            onClick={handleSaveFlow}
            disabled={loadingFlow}
          >
            Save Current Flow
          </button>
          <div className="h-[calc(100vh-100px)] w-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              proOptions={{ hideAttribution: true }}
            >
              <MiniMap />
              <Controls />
              <Background color="#f0f0f0" gap={16} />
            </ReactFlow>
          </div>
        </>
      )}
    </div>
  );
}
