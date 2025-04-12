import useRequest from './useRequest'
import { urls } from './urls'
import { User } from '../types/user'

const useAuth = () => {
  const Request = useRequest()

  const storeUserDetails = async (data: User): Promise<User> => {
    const res = await Request.post<User>(urls.user, data)
    return res.data
  }

  return { storeUserDetails }
}

export default useAuth
