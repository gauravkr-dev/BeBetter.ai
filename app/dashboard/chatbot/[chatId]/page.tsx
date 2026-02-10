import React from 'react'
import ChatHeader from './_components/chat-header'
import ChatPart from './_components/chat-part'

const page = () => {
    return (
        <div className='px-4 md:px-12 max-h-screen'>
            <ChatHeader />
            <ChatPart />
        </div>
    )
}

export default page
