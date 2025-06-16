import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TemplateNode from './TemplateNode';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../config/api';

const nodeTypes = {
  templateNode: TemplateNode,
};

export default function Setting() {
  const [templates, setTemplates] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.TEMPLATES.GET_ALL}?customer_id=${user?.customer_id}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );

        const data = await response.json();

        if (Array.isArray(data.templates)) {
          setTemplates(data.templates);

          const newNodes = data.templates.map((template, index) => ({
            id: `${index + 1}`,
            type: 'templateNode',
            position: {
              x: 100 + (index % 3) * 250,
              y: 100 + Math.floor(index / 3) * 250,
            },
            data: {
              label: template.element_name,
              image: template.image_url,
              category: template.category,
              meta: (template.container_meta?.data || '').slice(0, 50) + '...',
              selected: false,
            },
          }));

          setNodes(newNodes);
        } else {
          console.error('Invalid template response format');
        }
      } catch (err) {
        console.error('Failed to fetch templates:', err);
      }
    };

    fetchTemplates();
  }, [user?.customer_id, setNodes]);
  // Highlight selected node
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          selected: node.id === selectedNodeId,
        },
      }))
    );
  }, [selectedNodeId, setNodes]);

  const onNodeClick = useCallback(
    (event, node) => {
      if (!selectedNodeId) {
        setSelectedNodeId(node.id);
      } else if (selectedNodeId === node.id) {
        setSelectedNodeId(null);
      } else {
        const source = selectedNodeId;
        const target = node.id;

        const edgeId = `e${source}-${target}`;
        const edgeExists = edges.some(
          (e) =>
            (e.source === source && e.target === target) ||
            (e.source === target && e.target === source)
        );

        if (edgeExists) {
          setEdges((eds) =>
            eds.filter(
              (e) =>
                !(
                  (e.source === source && e.target === target) ||
                  (e.source === target && e.target === source)
                )
            )
          );
        } else {
          setEdges((eds) => [...eds, { id: edgeId, source, target }]);
        }

        setSelectedNodeId(null);
      }
    },
    [selectedNodeId, edges, setEdges]
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap />
        <Controls />
        
      </ReactFlow>
    </div>
  );
}
