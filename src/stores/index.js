import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

// import { useUserStore } from '@/stores/modules/user.js'
// export { useUserStore }
export * from '@/stores/modules/user.js' // 与上面等价
