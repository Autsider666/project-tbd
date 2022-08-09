import { useEffect, useState } from "react"

const CountDown = ({ seconds }) => {

    const [secondsDisplay, setSecondsDisplay] = useState()

    useEffect(() => {
        setSecondsDisplay(seconds)
        const timer = setInterval(() => {
            setSecondsDisplay(prev => prev - 1)

        }, 1000);
        return () => {
            clearInterval(timer)
        }
    }, seconds, setSecondsDisplay)



    return secondsDisplay

}

export default CountDown