import axios from 'axios'
import React, { useEffect } from 'react'
import { config } from '../config'

const Dlete = () => {

    const from =200
    const to = 250

    useEffect(() => {
        for (let i = from; i < to; i++) {
            axios.delete(config.db.baseurl + 'registers/delete/' + i)
                .then(response => console.log(response.data))
                .catch(err => console.log(err))
        }
    }, [])

    return (
        <div>Dlete</div>
    )
}

export default Dlete