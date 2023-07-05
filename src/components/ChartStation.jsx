import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { config } from '../config'

const ChartStation = () => {
    const { station } = useParams()
    const navigate = useNavigate()

    const options = {
        backgroundColor: '#848484',
        color: "#212121"
    }


    const [registers, setRegisters] = useState()
    const [data, setData] = useState()
    const [update, setUpdate] = useState(0)

    const digits = (num) => {
        let digit = num < 10 ? '0' + num : num + ''
        return digit
    }

    const formatDate = (date) => {
        const fecha = new Date(date)
        let stringDate = fecha.getFullYear() + '-' + digits(fecha.getMonth() + 1) + '-' + digits(fecha.getDate())
        return stringDate
    }

    const formatTime = (date) => {
        const time = new Date(date)
        let stringTime = digits(time.getHours() + ':' + digits(time.getMinutes()))
        return stringTime
    }

    const getRegisters = () => {
        let url = config.db.baseurl + 'registers/' + station
        console.log(url)
        axios.get(url)
            .then(response => {
                console.log(response.data)
                setRegisters(response.data)
            })
            .catch(err => console.log(err.data))
    }

    const formatRegisters = () => {
        let data = registers?.map((reg, index) => ({ date: formatDate(reg.createdAt), time: formatTime(reg.createdAt), co: reg.values.CO, ox: reg.values.OX }))
        console.log(data)
        setData(data)
    }

    useEffect(() => {
        getRegisters()
    }, [update])

    useEffect(() => {
        formatRegisters()
    }, [registers])



    return (
        <div className=''>
            <button
                className='HomeButton'
                onClick={() => navigate('/')}
            >Home</button>

            <button
                className='HomeButton'
                onClick={() => setUpdate(update + 1)}
            >Actualizar</button>



            <h1>{station}</h1>

            <div className="chartsContainer">

                <div className="chartContainer">
                    <h3>Datos CO</h3>
                    <LineChart width={800} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} >
                        <Line type="monotone" dataKey="co" stroke="#8884d8"
                            animationDuration={500}
                        />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="time" />
                        <YAxis dataKey={"co"} />
                        <Tooltip animationDuration={200}
                            itemStyle={options}
                            contentStyle={options}
                        />
                    </LineChart>
                </div>

                <div className="chartContainer">
                    <h3>Datos OX</h3>
                    <LineChart width={800} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="ox" stroke="#8884d8"
                            animationDuration={500}
                        />
                        <CartesianGrid stroke="#ccc" strokeDasharray="10 10" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip animationDuration={200}
                            itemStyle={options}
                            contentStyle={options}
                        />
                    </LineChart>
                </div>
            </div>

        </div>
    )
}

export default ChartStation