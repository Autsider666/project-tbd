import React from 'react'
import TabsWrapper from '../../components/TabsWrapper'
import { useChat } from '../../contexts/ChatContext'

const World = () => <div>World</div>
const Global = () => <div>Global</div>
const Whisper = () => <div>Whisper</div>

const content = [
    { label: 'World', Component: World },
    { label: 'Global', Component: Global },
    { label: 'Whisper', Component: Whisper },
]

const Chat = () => {

    const { chat } = useChat()
    console.log({ chat })

    return (
        <div>
            <TabsWrapper content={content} />
        </div>
    )
}

export default Chat