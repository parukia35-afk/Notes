/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import VueFileAgentNext from '@boindil/vue-file-agent-next'
import VuetifyUseDialog from 'vuetify-use-dialog'
import router from '@/router'
import pinia from '@/stores'
import vuetify from './vuetify'

import '@boindil/vue-file-agent-next/dist/vue-file-agent-next.css'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(VuetifyUseDialog, {
      snackbar: {
        closeButtonText: '關閉',
        snackbarProps: {
          timeout: 2000,
        },
      },
    })
    .use(router)
    .use(pinia)
    .use(VueFileAgentNext)
}
