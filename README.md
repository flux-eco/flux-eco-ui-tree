# FluxEcoUiTree

The **FluxEcoUiTree** component is a UI tree component that is part of the flux-eco-system. It uses a set of APIs for managing tree states and rendering the tree in the UI.

## Typedefs

### TreeState
``` javascript
/**
 * @type TreeState
 * @property {Id} id - id of the tree
 * @property {object} nodeDataSchema
 * @property {NodeState} rootNode
 * @property {NodeState[]} nodes
 */
```
### TreeNode
``` javascript
/**
* @typedef {TreeNode}
* @property {string|null} parentId
* @property {string} nodeId
* @property {object} nodeData
*/
```
### StatePublisher

``` javascript
/**
 * @typedef {Object} StatePublisher
 * @property {function(id:string, oldState:object, newState: object)} publish
 * @property {function(subscriberId:string, stateId:string, function(stateId:string, oldState:object, newState: object))} subscribe
 * @property {function(subscriberId:string, stateId:string)} unsubscribe
 * 
 * Note: There is an existing implementation of StatePublisher - flux-eco-ui-state-broadcaster - available in the flux-eco-system,
 * but you are free to implement your own if desired.
 */
```
### TreeStateManager
``` javascript
/**
 * @typedef {Object} TreeStateManager
 * @property {function(treeId: string, nodeDataSchema: object)} createTree
 * @property {function(treeId: string, nodeId: string, nodeData: object, expanded: boolean)} appendNodeToRoot
 * @property {function(treeId: string, parentNodeId: string, nodeId: string, nodeData: object, expanded: boolean)} appendNodeToParentNode
 * @property {function(treeId: string, nodeId: string)} toggleNodeStatusExpanded
 * @property {function(treeId: string): TreeState} getState
 * @property {function(subscriberId: string, treeId: string, callback: function(treeId:string, oldState:object, newState: object)): Promise<void>} subscribeToStateChanged
 * 
 * Note: There is an existing implementation of TreeStateManager - flux-eco-ui-tree-state - available in the flux-eco-system,
 * but you are free to implement your own if desired.
 */
```
### TreeElementRenderer
``` javascript
/**
 * @typedef {Object} TreeElementRenderer
 * @property {string} name
 * @property {function(parentElement: object, treeState: TreeState)} render
 *
 * Note: There is an existing implementation of TreeElementRenderer - flux-eco-ui-tree-element - available in the flux-eco-system,
 * but you are free to implement your own if desired.
 */

```

## Usage

``` javascript
import {FluxUiTreeApi} from "(...)/flux-eco-ui-tree/src/Adapters/Api/FluxUiTreeApi.mjs";

const statePublisher = /* create a StatePublisher object */;
const treeStateManager = /* create a TreeStateManager object */;
const treeElementRenderer = /* create a TreeElementRenderer object */;

const fluxEcoUiTreeApi = await FluxUiTreeApi.new(statePublisher, treeStateManager, treeElementRenderer);
const renderTreeOnDataProvidedCallback = await fluxEcoUiTreeApi.createRenderTreeOnNodesProvidedCallback(
    document.getElementById('tree-container'),
    'tree-1',
    {
        // schema object describing the node data
        type: 'object',
        properties: {
            name: { type: 'string' }
        }
    }
);

// Retrieve the tree data from an external API
const treeNodes = await fetch('/api/tree-nodes').then(response => response.json());

// Render the tree when the data is received
renderTreeOnDataProvidedCallback(treeNodes);

```

The code above shows how to create a FluxUiTree component and render it in a container element. In this example, the createRenderTreeOnNodesProvidedCallback() function is used to create a callback that will render the tree when the data is provided. The renderTreeOnDataProvidedCallback() function is then called when the tree data is received from an external API.

## FluxUiTreeApi
The main API class for the FluxEcoUiTree component.

### new(statePublisher, treeStateManager, treeElementRenderer): FluxUiTreeApi
Creates a new FluxUiTreeApi instance.
- **statePublisher** - A **StatePublisher** object used to publish and subscribe to state changes.
- **treeStateManager** - A **TreeStateManager** object used to manage the tree state.
- **treeElementRenderer** - A **TreeElementRenderer** object used to render the tree in the UI.

### createRenderTreeOnNodesProvidedCallback(parentElement, treeId, nodeDataSchema, expandNodesOnRender): callback
Creates a callback function that can be used to render the tree when the tree data is provided.
- **parentElement** - The element to render the tree in.
- **treeId** - The ID of the tree.
- **nodeDataSchema** - The schema object describing the node data.
- **expandNodesOnRender** - Whether or not to expand the nodes on render. Default is false.
  
Returns the callback function that will render the tree when the tree data is provided.



