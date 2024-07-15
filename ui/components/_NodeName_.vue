<!-- A dashboard 2 widget

-->
<template>
    <!-- Component must be wrapped in a block so props such as className and style can be passed in from parent -->
    <div className="_node_name_-wrapper" :class="props.class">
        <p>A skeleton UI widget</p>
    </div>
</template>

<script>
//import { markRaw } from 'vue'
//import { mapState } from 'vuex'

const logEvents = true  // whether to log incoming messages and events

export default {
    name: '_NodeName_',
    inject: ['$socket'],
    props: {
        /* do not remove entries from this - Dashboard's Layout Manager's will pass this data to your component */
        id: { type: String, required: true },
        props: { type: Object, default: () => ({}) },
        state: { type: Object, default: () => ({ enabled: false, visible: false }) }
    },
    setup (props) {
        //console.info('_NodeName_ setup with:', props)
        //console.debug('Vue function loaded correctly', markRaw)
    },
    data () {
        return {

        }
    },
    mounted () {
        this.$socket.on('widget-load:' + this.id, (msg) => {
            if (logEvents) console.log(`On widget-load ${JSON.stringify(msg)}`)
            // here we receive the replayed message from the server side data store
            this.processMsg(msg)     // pick up message values
            /*
            // load the latest message from the Node-RED datastore when this widget is loaded
            // storing it in our vuex store so that we have it saved as we navigate around
            havent worked out how to use this yet
            this.$store.commit('data/bind', {
                widgetId: this.id,
                msg
            })
            */
        })
        this.$socket.on('msg-input:' + this.id, (msg) => {
            if (logEvents) console.log(`On msg-input: ${JSON.stringify(msg)}`)
            // new message received
            this.processMsg(msg)

            /*
            // store the latest message in our client-side vuex store when we receive a new message
            this.$store.commit('data/bind', {
                widgetId: this.id,
                msg
            })
            */
        })

        // when the widget is loaded it gets sent the node properties
        if (logEvents) console.log(`mounted, props: ${JSON.stringify(this.props)}`)
        // pickup node properties to local data
        this.pickupProperties()
        // tell Node-RED that we're loading a new instance of this widget
        this.$socket.emit('widget-load', this.id)
    },
    unmounted () {
        /* Make sure, any events you subscribe to on SocketIO are unsubscribed to here */
        this.$socket?.off('widget-load:' + this.id)
        this.$socket?.off('msg-input:' + this.id)
    },
    computed: {
        //...mapState('data', ['messages']),
    },
    methods: {
        pickupProperties: function() {
            // pickup node properties from this.props and merge with base properties
            const props = this.props
            // ...
        },
        processMsg: function(msg) {
            // check whether msg.ui_update is present and is an object
            if (typeof msg.ui_update === 'object' && !Array.isArray(msg.ui_update) && msg.ui_update !== null) {
                // array of properties to allow ui_update for. Need to include class so it updates dynamically
                const propertiesToUpdate = ["class"]
                for (const [key, value] of Object.entries(msg.ui_update)) {
                    if (propertiesToUpdate.includes(key)) {
                        this.props[key] = value
                    }
                }
            }
            // check whether msg.class is present
            if ("class" in msg) {
                // update our local copy of props
                this.props.class = msg.class
            }
            // check whether msg.enabled is present
            if ("enabled" in msg) {
                // update our local copy of props
                this.props.enabled = msg.enabled
            }
            // ...
        },
    },
}
</script>

<style scoped>
    /* CSS is auto scoped, but using named classes is still recommended */
    @import "../stylesheets/_node_name_.css";
</style>
