import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { config } from '../config'
import { io } from "socket.io-client";
import { CSVLink } from "react-csv";
import { ExportToExcel } from './ExportToExcel'
import { BiHome } from 'react-icons/bi';
import { PiMicrosoftExcelLogo } from 'react-icons/pi';


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
        let dataformat = data?.map((reg, index) => ({ date: formatDate(reg.createdAt), time: formatTime(reg.createdAt), ha: reg.values.HA, ta: reg.values.TA, ts: reg.values.TS }))
        return dataformat
    }
    const formatCsv = (data) => {
        let csvformat = data?.map((reg, index) => ({ Nodo: station, fecha: formatDate(reg.createdAt), hora: formatTime(reg.createdAt), ha: reg.values.HA, ta: reg.values.TA, ts: reg.values.TS }))
        return csvformat
    }


    useEffect(() => {
        // const socket = io(config.db.baseurl0)
        // console.log(config.db.baseurl0)
        // socket.on("update", (msj) => {
        //     console.log(msj)
        //     getRegistersRange(from, to)
        // })
        if (!allRegisters.length > 0) {
            console.log('all registers')
            const interval = setInterval(() => getRegistersRange(from, to), 1000);
            return () => clearInterval(interval);
        }

    }, [allRegisters])

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

            <div className="navContainer">

                <button
                    className='navButton'
                    onClick={() => navigate('/home')}
                    disabled={download && fetching}
                > <BiHome />Inicio</button>

                {/* <button
                className='HomeButton'
                onClick={() => getRegistersRange(from, to)}
                disabled={download && fetching}
            >Actualizar</button> */}

                {!allRegisters.length > 0 &&
                    <button
                        className='navButton'
                        onClick={() => getAllRegisters()}
                        disabled={download && fetching}
                    >Obtener todos los datos <PiMicrosoftExcelLogo /></button>
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

            </div>


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
                    <h3>Datos Humedad ambiental</h3>
                    <LineChart width={800} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} >
                        <Line type="monotone" dataKey="ha"
                            stroke={config.styles.linecolor}
                            strokeWidth={config.styles.linewidth}
                            animationDuration={500}
                        />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="time" />
                        <YAxis dataKey={"ha"} />
                        <Tooltip animationDuration={200}
                            itemStyle={options}
                            contentStyle={options}
                        />
                    </LineChart>
                </div>

                <div className="chartContainer">
                    <h3>Datos Temperatura ambiental</h3>
                    <LineChart width={800} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="ta"
                            stroke={config.styles.linecolor}
                            strokeWidth={config.styles.linewidth}
                            animationDuration={500}
                        />
                        <CartesianGrid stroke="#ccc" strokeDasharray="10 10" />
                        <XAxis dataKey="time" />
                        <YAxis dataKey={"ta"} />
                        <Tooltip animationDuration={200}
                            itemStyle={options}
                            contentStyle={options}
                        />
                    </LineChart>
                </div>

                <div className="chartContainer">
                    <h3>Datos temperatura suelo</h3>
                    <LineChart width={800} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="ts"
                            stroke={config.styles.linecolor}
                            strokeWidth={config.styles.linewidth}
                            animationDuration={500}
                        />
                        <CartesianGrid stroke="#ccc" strokeDasharray="10 10" />
                        <XAxis dataKey="time" />
                        <YAxis dataKey={"ts"} />
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