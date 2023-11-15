import axios from 'axios'
import { BACKEND_URL } from '../../../config.js'
import store from '../../store/store.jsx'
import { USER, USER_ID } from '../../store/actions.jsx'

const verifyToken = async (token) => {
  if (token) {
    await axios
      .get(`${BACKEND_URL}/auth/verify-token?token=${token}`)
      .then(async (response) => {
        const { userId } = response.data
        store.dispatch({
          type: USER_ID,
          payload: userId,
        })
        await axios
          .get(`${BACKEND_URL}/users/user/${userId}`)
          .then((usersResponse) => {
            const user = usersResponse.data
            store.dispatch({
              type: USER,
              payload: user,
            })
          })
          .catch((error) => {
            store.dispatch({
              type: USER,
              payload: null,
            })
            console.log('ERROR in verifyToken.jsx: ', error)
          })
      })
      .catch((error) => {
        store.dispatch({
          type: USER_ID,
          payload: null,
        })
        store.dispatch({
          type: USER,
          payload: null,
        })
        console.log('ERROR in verifyToken.jsx: ', error)
      })
  }
}

export default verifyToken
