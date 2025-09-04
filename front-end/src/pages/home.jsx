import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../component/Loading';
import { Bar } from 'react-chartjs-2';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:8000';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { useNavigate } from 'react-router-dom';


document.title = 'home'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const Home = () => {
  const labels = [];
  const dataValide = [];
  const [auth,setAuth]=useState(false);
  const nav =useNavigate()
  const [newDataValide, setNewDataVAlide] = useState([])
  const [newLabels, setNewLabels] = useState([])
  const [prixTotal, setPrixTotal] = useState(0);
  const token = localStorage.getItem('token')
if (!token) {
  nav('/login')
}
  // partie chart 
  useEffect(() => {


   


    const getChart = async () => {
try {
  

      const response = await axios.get('/api/chart', {
        headers: {
          Authorization: `bearer ${token}`
        }
      })
     
      const dataChart = response.data.commande
      setPrixTotal(response.data.prix.prix)
      dataChart.map((dataChart) => {
        if (dataChart.status === 'valider') {
          labels.push(dataChart.name)

          dataValide.push(dataChart.total)
        }
        setNewDataVAlide(dataValide)
        setNewLabels(labels)
      })
      //df
} catch (error) {
  console.log(error.response.status)

     setAuth(error.response.status)

}
    }
    getChart()


 
  }, [])


  const data = {

    labels: newLabels,
    datasets: [
      {
        label: 'les produits en commande valider ',
        data: newDataValide,
        backgroundColor: 'Green',
      }
    ],
  };


   if (auth === 401) {
      nav('/login')
    }







  return (<>
    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">dashbord de produits</h2>
    <div className=" mx-auto mt-8 p-6 bg-white rounded-lg shadow-md flex flex-row justify-around">
      <div className='border-2 mt-6 w-1/2 '>
        <h2 className='text-center'>les produits plus demander</h2>
        <h2 className='text-center'> total de vente:{prixTotal}dh</h2>
        <Bar
          data={data}
          style={{
            width: '600px',
            height: '400px',
            backgroundColor: '#f3f4f6',
            padding: '20px',
            borderRadius: '10px'
          }}
        />
      </div>

    </div>
  </>
  );
};

export default Home;