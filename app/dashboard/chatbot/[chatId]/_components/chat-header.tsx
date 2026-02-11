import { CircleUser } from 'lucide-react'
import React from 'react'

const ChatHeader = () => {
    return (
        <div className='flex items-center justify-between mt-4'>

            <h1 className='text-lg font-medium mb-4 flex items-center gap-2'> <CircleUser /> Gaurav Bhaiya (Senior)</h1>
        </div>
    )
}

export default ChatHeader
