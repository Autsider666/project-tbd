import { useEffect, useState } from "react"

const CountDown = ({ seconds = 0 }) => {

    const [secondsDisplay, setSecondsDisplay] = useState()

    useEffect(() => {
        setSecondsDisplay(seconds)
        const timer = setInterval(() => {
            setSecondsDisplay(prev => prev - 1)

        }, 1000);
        return () => {
            clearInterval(timer)
        }
    }, [seconds, setSecondsDisplay])
    
    return Math.max(secondsDisplay,0)

}

export default CountDown