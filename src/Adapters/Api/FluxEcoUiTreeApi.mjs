/**
 * @typedef {TreeNode}
 * @property {string|null} parentId
 * @property {string} nodeId
 * @property {object} nodeData
 */

/**
 * @typedef {Object} StatePublisher
 * @async
 * @property {function(id:string, oldState:object, newState: object)} publish
 * @property {function(subscriberId:string, stateId:string, function(stateId:string, oldState:object, newState: object))} subscribe
 * @property {function(subscriberId:string, stateId:string)} unsubscribe
 *
 * Note: There is an existing implementation of StatePublisher - flux-eco-ui-state-broadcaster - available in the flux-eco-system,
 * but you are free to implement your own if desired.
 */

/**
 * @typedef {Object} TreeState
 */

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

/**
 * @typedef {Object} TreeElementRenderer
 * @property {string} name
 * @property {function(parentElement: object, treeState: TreeState)} render
 *
 * Note: There is an existing implementation of TreeElementRenderer - flux-eco-ui-tree-element - available in the flux-eco-system,
 * but you are free to implement your own if desired.
 */


/**
 * @type FluxEcoUiTreeApi
 */
export class FluxEcoUiTreeApi {
    name = "flux-eco-ui-tree";
    /**
     * @var {StatePublisher}
     */
    #statePublisher;
    /**
     * @var {TreeStateManager}
     */
    #treeStateManager;
    /**
     * @var {TreeElementRenderer}
     */
    #treeElementRenderer;


    /**
     * @param {StatePublisher} statePublisher
     * @param {TreeStateManager} treeStateManager
     * @param {TreeElementRenderer} treeElementRenderer
     */
    constructor(
        statePublisher,
        treeStateManager,
        treeElementRenderer
    ) {
        this.#statePublisher = statePublisher;
        this.#treeStateManager = treeStateManager;
        this.#treeElementRenderer = treeElementRenderer;
    }

    /**
     * @param {StatePublisher} statePublisher
     * @param {TreeStateManager} treeStateManager
     * @param {TreeElementRenderer} treeElementRenderer
     * @return {FluxEcoUiTreeApi}
     */
    static async new(statePublisher,
                     treeStateManager,
                     treeElementRenderer) {
        return new FluxEcoUiTreeApi(statePublisher, treeStateManager, treeElementRenderer)
    }

    /**
     * @param {object} parentElement
     * @param {string} treeId
     * @param {object} nodeDataSchema - a schema object describing the node data
     * @param {boolean} expandNodesOnRender
     * @return {Promise<function(array)>}
     */
    async createRenderTreeOnNodesProvidedCallback(parentElement, treeId, nodeDataSchema, expandNodesOnRender = false) {
        this.#treeStateManager.createTree(treeId, nodeDataSchema);
        /**
         * @param {TreeNode[]} treeNodes
         */
        const renderTreeOnDataProvidedCallback = (treeNodes) => {
            this.#renderTree(parentElement, treeId, expandNodesOnRender, treeNodes)
        }
        return renderTreeOnDataProvidedCallback;
    }

    /**
     * @param {object} parentElement
     * @param {string} treeId
     * @param {boolean} expandNodesOnRender
     * @param {TreeNode[]} treeNodes
     */
    async #renderTree(parentElement, treeId, expandNodesOnRender, treeNodes) {
        for await (const treeNode of treeNodes) {
            if (!treeNode.parentId) {
                await this.#treeStateManager.appendNodeToRoot(treeId, treeNode.nodeId, treeNode.nodeData, expandNodesOnRender);
            } else {
                await this.#treeStateManager.appendNodeToParentNode(treeId, treeNode.parentId, treeNode.nodeId, treeNode.nodeData, expandNodesOnRender);
            }
        }

        await this.#treeStateManager.subscribeToStateChanged(
            this.#treeElementRenderer.name, treeId, (treeStateChanged) => this.#treeElementRenderer.render(parentElement, treeStateChanged.newState)
        )

        await this.#treeElementRenderer.render(parentElement, await this.#treeStateManager.getState(treeId))
    }
}