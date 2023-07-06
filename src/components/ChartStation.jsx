import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { config } from '../config'
import { io } from "socket.io-client";
import { CSVLink } from "react-csv";
import { ExportToExcel } from './ExportToExcel'


const ChartStation = () => {
    const { station } = useParams()
    const navigate = useNavigate()

    const digits = (num) => {
        let digit = num < 10 ? '0' + num : num + ''
        return digit
    }

    const formatDate = (date) => {
        const fecha = new Date(date)
        let stringDate = fecha.getFullYear() + '-' + digits(fecha.getMonth() + 1) + '-' + digits(fecha.getDate())
        return stringDate
    }
    const formatDate1 = (date) => {
        const fecha = new Date(date)
        let stringDate = fecha.getFullYear() + '-' + digits(fecha.getMonth() + 1) + '-' + digits(fecha.getDate() + 2)
        return stringDate
    }

    const formatTime = (date) => {
        const time = new Date(date)
        let stringTime = digits(time.getHours() + ':' + digits(time.getMinutes()))
        return stringTime
    }


    const options = {
        backgroundColor: '#848484',
        color: "#212121"
    }


    const [registers, setRegisters] = useState()
    const [allRegisters, setAllRegisters] = useState([])
    const [csv, setCsv] = useState([])
    const [data, setData] = useState()
    const [update, setUpdate] = useState(0)
    const [download, setDownload] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [from, setFrom] = useState(formatDate(new Date()))
    const [to, setTo] = useState(formatDate(new Date()))


    const getRegistersRange = (from, toDate) => {
        console.log(from)
        console.log(formatDate1(toDate))
        let to = formatDate1(toDate)
        let url = config.db.baseurl + 'registers/' + station + '/date?'
            + 'from=' + from
            + '&to=' + to
        console.log(url)
        setFetching(true)
        axios.get(url)
            .then(response => {
                console.log(response.data)
                setRegisters(response.data)
                setFetching(false)
            })
            .catch(err => console.log(err.data))
    }

    const getAllRegisters = () => {
        let url = config.db.baseurl + 'registers/' + station
        console.log(url)
        setFetching(true)
        axios.get(url)
            .then(response => {
                console.log(response.data)
                setAllRegisters(response.data)
                setFetching(false)
            })
            .catch(err => console.log(err.data))
    }

    const formatData = (data) => {
        let dataformat = data?.map((reg, index) => ({ date: formatDate(reg.createdAt), time: formatTime(reg.createdAt), co: reg.values.CO, ox: reg.values.OX }))
        return dataformat
    }
    const formatCsv = (data) => {
        let csvformat = data?.map((reg, index) => ({ Nodo: station, fecha: formatDate(reg.createdAt), hora: formatTime(reg.createdAt), co: reg.values.CO, ox: reg.values.OX }))
        return csvformat
    }


    useEffect(() => {
        const socket = io("http://localhost:3500")
        socket.on("update", (msj) => {
            console.log(msj)
            getRegistersRange(from, to)
        })
    }, [])

    useEffect(() => {
        console.log(from)
        console.log(to)
        getRegistersRange(from, to)
    }, [from, to])

    useEffect(() => {
        setData(formatData(registers))
    }, [registers])

    useEffect(() => {
        setCsv(formatCsv(allRegisters))
    }, [allRegisters])




    return (
        <div className=''>
            <button
                className='HomeButton'
                onClick={() => navigate('/')}
                disabled={download && fetching}
            >Home</button>

            <button
                className='HomeButton'
                onClick={() => getRegistersRange()}
                disabled={download && fetching}
            >Actualizar</button>

            {!allRegisters.length > 0 &&
                <button
                    onClick={() => getAllRegisters()}
                    disabled={download && fetching}
                >Obtener todos los datos</button>
            }
            {allRegisters.length > 0 &&
                <ExportToExcel
                    apiData={csv}
                    fileName={`${station}`}
                    station={station}
                    setDownload={setDownload}
                    fetching={fetching}
                />

                // <CSVLink
                //     className='downLoadBtn'
                //     data={csv}
                //     filename={`${station}.csv`}
                // // headers={headers}
                // >
                //     Descargar CSV
                // </CSVLink>
            }

            <div className="dateContainer">
                <div className="dateField">
                    <label htmlFor="">Desde:</label>
                    <input type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                    />
                </div>
                <div className="dateField">
                    <label htmlFor="">Hasta:</label>
                    <input type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />
                </div>
            </div>

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