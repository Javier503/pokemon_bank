const ctx = document.getElementById('myChart').getContext('2d');

let myChart;
const grafico =(data,segmentos)=>{
   console.log(data)
   console.log(segmentos)
   myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: segmentos,
      datasets: [{
        label: 'Total $',
        data: data,
        backgroundColor: [
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1
  
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


}

// generar reporte de transacciones
const reporteGeneral = (type) => {
  if(myChart != null){
    myChart.destroy();
  }

  let user = dataUser();
  let abonoAll = JSON.parse(localStorage.getItem("abonos") || "[]");
  let retirosAll = JSON.parse(localStorage.getItem("retiros") || "[]");
  let data;
  if (type == 'general') {
    let abonosUser = abonoAll.map((item, index) => {
      if (item.cuenta == user.cuenta) {
        return item
      }
    })

    let retirosUser = retirosAll.map((item, index) => {
      if (item.cuenta == user.cuenta) {
        return item
      }
    })

     data = abonosUser.concat(retirosUser);
  } else if (type == 'abonos') {
    let abonosUser = abonoAll.map((item, index) => {
      if (item.cuenta == user.cuenta) {
        return item
      }
    })

    data = abonosUser;
  } else if(type == 'retiros'){
    let retirosUser = retirosAll.map((item, index) => {
      if (item.cuenta == user.cuenta) {
        return item
      }
    })

     data = retirosUser;
  }

  const tablaReporte = document.getElementById("tablaReporte");
  tablaReporte.innerHTML = "";
  let retirosTotal=0;
  let abonosTotal=0;
  data.map((item, index) => {
    if(item.abono){
     
      abonosTotal=Number(abonosTotal)+Number(item.abono);
    }else{
      retirosTotal=Number(retirosTotal)+Number(item.retiro);
    }
    

    let row = `<tr>
      <th scope="row">${item.cuenta}</th>
      <td>${item.abono ? 'Abono' : 'Retiro'}</td>
      <td>$${Number(item.abono ? item.abono : item.retiro).toFixed(2)}</td>
      <td>${item.date}</td>
      </tr>`;
    tablaReporte.insertAdjacentHTML("beforeend", row);

  })
  segmentos = type == 'general' ? ['Retiros','Abonos'] : [type];
  dataG= type == 'general' ? [retirosTotal,abonosTotal] : type == 'abonos' ? [abonosTotal] : [retirosTotal];        
  grafico(dataG,segmentos)
}

reporteGeneral('general');

