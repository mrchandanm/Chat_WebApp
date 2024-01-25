import React from 'react'

const UserMessageUi = ({m}) => {
  return (
    <div>
      User:{m?.content};
    </div>
  )
}

export default UserMessageUi
