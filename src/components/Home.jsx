import React, { useEffect, useState } from 'react'
import StationCard from './StationCard'
import axios from 'axios'
import { config } from '../config'

const Home = () => {

    const [stations, setStations] = useState()


    const getStations = () => {
        let url = config.db.baseurl + 'stations'
        console.log(url)
        axios.get(url)
            .then(response => {
                console.log(response.data)
                setStations(response.data)
            })
            .catch(err => console.log(err.response.data))
    }


    useEffect(() => {
        getStations()
    }, [])

    return (
        <div className='cardsContainer'>
            {
                stations?.map(station => (
                    <StationCard
                        key={station.id}
                        info={station}
                    />
                ))
            }

        </div>
    )
}

export default Home