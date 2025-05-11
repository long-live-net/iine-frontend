import { v4 as uuidv4 } from 'uuid'

export const useRouteKey = () => {
  const routeKeyId = useState<string>('routeKeyId', () => 'initial')
  const changeRouteKeyId = () => {
    routeKeyId.value = uuidv4()
  }
  return {
    routeKeyId: readonly(routeKeyId),
    changeRouteKeyId,
  }
}
