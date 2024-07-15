module.exports = function (RED) {
    function _NodeName_Node (config) {
        RED.nodes.createNode(this, config)

        const node = this

        // which group are we rendering this widget
        const group = RED.nodes.getNode(config.group)

        const base = group.getBase()

        // server-side event handlers
        const evts = {
            onAction: true,
            onInput: function (msg, send, done) {
                // does msg.ui_update exist and is an object?
                if (typeof msg.ui_update === 'object' && !Array.isArray(msg.ui_update) && msg.ui_update !== null) {
                    // array of strings containing properties to allow ui_update for
                    // No need to include class or className, they are handled automatically
                    const propertiesToUpdate = []
                    // yes it does, do any pre-processing required of the contents
                    msg.ui_update = handleSpecialPropertyUpdate(msg.ui_update)
                    // merge data into the properties in the state store
                    let statestore = base.stores.state
                    for (const [key, value] of Object.entries(msg.ui_update)) {
                        if (propertiesToUpdate.includes(key)) {
                            statestore.set(base, node, msg, key, value)
                        }
                    }
                }
                // msg.enabled is handled by the core code, updating the value in props when necessary

                // store the latest message for replay on screen refresh if this is required
                base.stores.data.save(base, node, msg)
                // call send here if you want message pass through to connected nodes in Node-RED
                //send(msg)
            },
            onSocket: {
                // add any required custom events here
                /*
                'my-custom-event': function (conn, id, msg) {
                    console.info('"my-custom-event" received:', conn.id, id, msg)
                    console.info('conn.id:', conn.id)
                    console.info('id:', id)
                    console.info('msg:', msg)
                    console.info('node.id:', node.id)
                    // emit a msg in Node-RED from this node
                    node.send(msg)
                }
                */
            }
        }

        // inform the dashboard UI that we are adding this node
        if (group) {
            group.register(node, config, evts)
        } else {
            node.error('No group configured')
        }
    }

    RED.nodes.registerType('_node_name_', _NodeName_Node)
}

function handleSpecialPropertyUpdate(ui_update) {
    // given a msg.ui_update object this massages any properties that need special handling
    return ui_update
}