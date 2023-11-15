import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { BACKEND_URL } from '../../../config'

const InviteOperations = ({ invite, updateInviteStatus }) => {
  // Spin accept button (after click Find)
  const [acceptButtonSpinning, setAcceptButtonSpinning] = useState(false)
  const [declineButtonPing, setDeclineButtonPing] = useState(false)

  const handleAcceptInvite = async () => {
    setAcceptButtonSpinning(true)

    // Add the user as owner to the company
    await axios
      .put(
        `${BACKEND_URL}/companies/${invite.companyId}/add-owner/${invite.receiverId}`,
      )
      .then(() => {
        // Update the invite status to "accepted"
        updateInviteStatus(invite._id, 'accepted')
      })
      .catch((error) => {
        console.log(
          'ERROR in InviteOperations.jsx add user to company: ',
          error,
        )
      })

    // Timeout for stopping the animation after 2 seconds
    setTimeout(() => {
      setAcceptButtonSpinning(false)
    }, 2000)
  }

  return (
    <div id={`operations-${invite._id}`} key={invite._id}>
      <span className='text-xl'>
        <button
          className={`bg-gradient-to-r from-green-600 to-green-700 hover:from-green-400 hover:to-green-500 rounded-lg w-[82px] float-left ml-1 ${
            acceptButtonSpinning
              ? 'animate-spin-fast'
              : 'animate-bounce hover:animate-none'
          }`}
          data-test-id='accept-button'
          onClick={handleAcceptInvite}
          type='button'
        >
          Accept
        </button>
        <div className='pb-6'>
          <button
            className={`hover:bg-gradient-to-r bg-red-900/90 rounded-lg w-[82px] float-right mr-1 ${
              declineButtonPing ? 'animate-ping' : ''
            }`}
            data-test-id='decline-button'
            onClick={() => {
              setDeclineButtonPing(true)
              updateInviteStatus(invite._id, 'declined')
              setTimeout(() => {
                setDeclineButtonPing(false)
              }, 1000)
            }}
            type='button'
          >
            Decline
          </button>
        </div>
      </span>
    </div>
  )
}

InviteOperations.propTypes = {
  invite: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    companyId: PropTypes.string.isRequired,
    receiverId: PropTypes.string.isRequired,
    receiver: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      __v: PropTypes.number.isRequired,
    }).isRequired,
    senderId: PropTypes.string.isRequired,
    sender: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      __v: PropTypes.number.isRequired,
    }).isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  updateInviteStatus: PropTypes.func.isRequired,
}

export default InviteOperations
