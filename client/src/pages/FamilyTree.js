import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as go from 'gojs';

const FamilyTree = () => {
  const location = useLocation();
  const diagramRef = useRef(null);
  const [diagram, setDiagram] = useState(null);
  const [treeData, setTreeData] = useState(location.state?.treeData || { nodeDataArray: [], linkDataArray: [] });
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isBlockchainSaving, setIsBlockchainSaving] = useState(false);

  // Initialize GoJS diagram on component mount
  useEffect(() => {
    if (!diagram && diagramRef.current) {
      initializeDiagram();
    }
    
    // Clean up on unmount
    return () => {
      if (diagram) {
        diagram.div = null;
      }
    };
  }, []);

  // Update diagram when tree data changes
  useEffect(() => {
    if (diagram && treeData) {
      updateDiagram();
    }
  }, [treeData]);

  const initializeDiagram = () => {
    const $ = go.GraphObject.make;
    
    // Create the diagram with custom settings
    const myDiagram = $(go.Diagram, diagramRef.current, {
      'undoManager.isEnabled': true,
      layout: $(go.TreeLayout, {
        angle: 90,
        nodeSpacing: 20,
        layerSpacing: 50,
      }),
      model: $(go.GraphLinksModel, {
        linkKeyProperty: 'key',
        // This model supports multiple parents:
        linkFromPortIdProperty: 'fromPort',
        linkToPortIdProperty: 'toPort',
      }),
    });

    // Define the node template for people
    myDiagram.nodeTemplate = $(
      go.Node, 'Auto',
      {
        selectionChanged: (node) => {
          if (node.isSelected) {
            const data = node.data;
            setSelectedPerson(data);
          }
        }
      },
      $(go.Shape, 'Rectangle', {
        fill: '#1E2E4D',
        stroke: '#F2C94C',
        strokeWidth: 2,
        corner: 5,
      }),
      $(go.Panel, 'Vertical',
        { margin: 10 },
        $(go.Picture, {
          width: 60, 
          height: 60,
          margin: new go.Margin(5, 0, 5, 0),
          background: '#2C3E50',
          defaultAlignment: go.Spot.Center
        }, new go.Binding('source', 'photo')),
        $(go.TextBlock, {
          margin: 2,
          stroke: '#FFFFFF',
          font: 'bold 14px sans-serif',
          alignment: go.Spot.Center,
          isMultiline: false,
          editable: true,
        }, new go.Binding('text', 'name').makeTwoWay()),
        $(go.TextBlock, {
          margin: 2,
          stroke: '#CCCCCC',
          font: '12px sans-serif',
          alignment: go.Spot.Center,
          isMultiline: false,
        }, new go.Binding('text', 'birthDate'))
      )
    );

    // Define the link template
    myDiagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.Orthogonal,
        corner: 5,
      },
      $(go.Shape, { strokeWidth: 2, stroke: '#F2C94C' })
    );

    setDiagram(myDiagram);
    
    // Load initial data if it exists
    if (treeData && treeData.nodeDataArray && treeData.linkDataArray) {
      myDiagram.model = new go.GraphLinksModel(treeData.nodeDataArray, treeData.linkDataArray);
    }
  };

  const updateDiagram = () => {
    if (diagram && treeData) {
      const model = diagram.model;
      model.startTransaction("update data");
      
      // Clear existing nodes and links
      model.nodeDataArray = [];
      model.linkDataArray = [];
      
      // Add new nodes and links
      treeData.nodeDataArray.forEach(node => {
        model.addNodeData(node);
      });
      
      treeData.linkDataArray.forEach(link => {
        model.addLinkData(link);
      });
      
      model.commitTransaction("update data");
    }
  };

  const handleAddPerson = () => {
    // Sample function to add a new person to the tree
    const newPerson = {
      key: `person${treeData.nodeDataArray.length + 1}`,
      name: "New Person",
      gender: "unknown",
      birthDate: "",
      photo: ""
    };
    
    setTreeData({
      nodeDataArray: [...treeData.nodeDataArray, newPerson],
      linkDataArray: treeData.linkDataArray
    });
  };

  const handleSaveToBlockchain = async () => {
    // This would be the actual implementation to save to Arweave and Polygon
    setIsBlockchainSaving(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Family tree successfully saved to the blockchain!');
    } catch (error) {
      console.error("Error saving to blockchain:", error);
      alert('Failed to save to blockchain. Please try again.');
    } finally {
      setIsBlockchainSaving(false);
    }
  };

  return (
    <div className="container" style={{ margin: '2rem auto' }}>
      <h1 style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '1rem' }}>Family Tree</h1>
      
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
        <button 
          className="btn btn-primary"
          onClick={handleAddPerson}
        >
          Add Person
        </button>
        <button 
          className="btn btn-outline"
          onClick={handleSaveToBlockchain}
          disabled={isBlockchainSaving}
        >
          {isBlockchainSaving ? 'Saving to Blockchain...' : 'Save to Blockchain'}
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div 
          className="diagram-container" 
          ref={diagramRef} 
          style={{ width: '70%', height: '600px', border: '1px solid #444' }}
        />
        
        <div style={{ width: '30%', backgroundColor: 'var(--tertiary-color)', padding: '1rem', borderRadius: '8px' }}>
          {selectedPerson ? (
            <div>
              <h3 style={{ color: 'var(--primary-color)' }}>Person Details</h3>
              <p><strong>Name:</strong> {selectedPerson.name}</p>
              <p><strong>Birth Date:</strong> {selectedPerson.birthDate || 'Unknown'}</p>
              <p><strong>Gender:</strong> {selectedPerson.gender || 'Unknown'}</p>
              {/* Add more fields as needed */}
            </div>
          ) : (
            <p>Select a person to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyTree; 