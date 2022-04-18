const nextView = () => {
    if (!verificarSession()) {
        location.assign('login.html');
    }

}

nextView();

// cerrar session
const exit=()=>{
    localStorage.removeItem('session');
    location.assign('login.html');
}


// verificar session muerta
setInterval(() => {
    Swal.fire({
        title: 'Quieres extender la session?',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `Cerrar Session`,
    }).then((result) => {

        if (result.isConfirmed) {
            console.log("se extendio session")
        } else if (result.isDenied) {
            localStorage.removeItem('session');
            location.assign('login.html');
        }
    })
}, 60000);

const setInfoUser = () => {
    let user = dataUser();
    document.getElementById("nameUser").textContent = user.name + "-" + user.cuenta;
}

setInfoUser()

// operacion deposito
const deposito = async () => {
    const inputStep = 0.01
    const { value: data } = await Swal.fire({
        title: 'Ingresa la cantidad a depositar',
        input: 'number',
        inputAttributes: {
            step: inputStep
        },
        inputPlaceholder: '0.00'
    })
    if (data > 0) {
        abonar(data)
    } else {
        alertMessage('', 'Ingrese una cantidad valida', 'error');
    }
}


// hook para abonar
const abonar = (data) => {
    try {
        let user = dataUser();
        let fechaAbono = fecha();
        let abono = {
            cuenta: user.cuenta,
            abono: data,
            date: fechaAbono
        }
        let abonos = JSON.parse(localStorage.getItem("abonos") || "[]");
        abonos.push(abono);
        localStorage.setItem("abonos", JSON.stringify(abonos));
        modificarSaldoDeposito(data, fechaAbono);
        return true;
    } catch (error) {
        return error;
    }

}

// hook para modificar el saldo a favor
const modificarSaldoDeposito = (abono, fecha) => {

    let sumarSaldo = Number(abono);
    let user = dataUser();
    let accounts = JSON.parse(localStorage.getItem("accounts") || "[]");

    const newData = accounts.map((item, index) => {
        console.log()
        if (item.pin == user.token) {
            return {
                name: item.name,
                pin: item.pin,
                cuenta: item.cuenta,
                saldo: Number(Number(item.saldo) + sumarSaldo).toFixed(2),
                create: item.create,
                update: fecha
            }
        } else {
            return item;
        }
    });

    localStorage.setItem("accounts", JSON.stringify(newData));
    alertMessage('', 'Operacion Exitosa', 'success');
}



// operacion retiro
const retiro = async () => {
    const inputStep = 0.01
    const { value: data } = await Swal.fire({
        title: 'Ingresa la cantidad a retirar',
        input: 'number',
        inputAttributes: {
            step: inputStep
        },
        inputPlaceholder: '0.00'
    })
    if (data > 0) {
        retirarSaldo(data)
    } else {
        alertMessage('', 'Ingrese una cantidad valida', 'error');
    }
}


// hook para abonar
const retirarSaldo = (data) => {
    try {
        let user = dataUser();
        let fechaAbono = fecha();
        let retiro = {
            cuenta: user.cuenta,
            retiro: data,
            date: fechaAbono
        }
        let accounts = JSON.parse(localStorage.getItem("accounts") || "[]");

        const saldo = accounts.map((item, index) => {
            if (item.cuenta == user.cuenta) {
                return item.saldo
            }
        })

        if (Number(saldo[0]) < data) {
            alertMessage('', 'La cantidad supera el saldo disponible', 'error');
        } else {
            let retiros = JSON.parse(localStorage.getItem("retiros") || "[]");
            retiros.push(retiro);
            localStorage.setItem("retiros", JSON.stringify(retiros));
            modificarSaldoRetiro(data, fechaAbono);
            return true;
        }
    } catch (error) {
        return error;
    }

}

// hook para modificar el saldo a negativo
const modificarSaldoRetiro = (abono, fecha) => {

    let restarSaldo = Number(abono);
    let user = dataUser();
    let accounts = JSON.parse(localStorage.getItem("accounts") || "[]");

    const newData = accounts.map((item, index) => {

        if (item.pin == user.token) {
            return {
                name: item.name,
                pin: item.pin,
                cuenta: item.cuenta,
                saldo: Number(Number(item.saldo) - restarSaldo).toFixed(2),
                create: item.create,
                update: fecha
            }
        } else {
            return item;
        }
    });
    localStorage.setItem("accounts", JSON.stringify(newData));
    alertMessage('', 'Operacion Exitosa', 'success');
}

// generar reporte de transacciones
const reporteTransacciones = () => {
    window.jsPDF = window.jspdf.jsPDF
    const doc = new jsPDF();
    let user = dataUser();
    let abonoAll = JSON.parse(localStorage.getItem("abonos") || "[]");
    let retirosAll = JSON.parse(localStorage.getItem("retiros") || "[]");
    
    let abonosUser = abonoAll.map((item,index)=>{
        if(item.cuenta == user.cuenta){
            return item
        }
    }) 

    let retirosUser= retirosAll.map((item,index)=>{
        if(item.cuenta == user.cuenta){
            return item
        }
    }) 
    
    let data = abonosUser.concat(retirosUser);

    console.log(data)
    const tablaReporte = document.getElementById("tablaReporte");
    tablaReporte.innerHTML = "";
    data.map((item, index) => {
        let row = `<tr>
        <th scope="row">${item.cuenta}</th>
        <td>${item.abono ? 'Abono' : 'Retiro'}</td>
        <td>$${Number(item.abono ? item.abono : item.retiro).toFixed(2)}</td>
        <td>${item.date}</td>
        </tr>`;
        tablaReporte.insertAdjacentHTML("beforeend", row);
       
    })    
    doc.autoTable({ html: '#tabla' })
    doc.save('table.pdf')
}


// pagar servicios
const pagoServicio=async()=>{
    const { value: servicio } = await Swal.fire({
        title: 'Seleccione servicio a pagar',
        input: 'select',
        inputOptions: {
          'Internet': 'Internet',
          'Electricidad': 'Electricidad',
          'Cable': 'Cable',
          'Telefono':'Telefono'
        },
        
        showCancelButton: true,
      })
      
      if (servicio) {
        const inputStep = 0.01
        const { value: data } = await Swal.fire({
            title: 'Ingresa la cantidad a cancelar',
            input: 'number',
            inputAttributes: {
                step: inputStep
            },
            inputPlaceholder: '0.00'
        })
        if (data > 0) {
            // reutilizamos el hook de retirar saldo para debitar el costo del servicio como plus se puede enviar el tipo de operacion
            retirarSaldo(data);
            
        } else {
            alertMessage('', 'Ingrese una cantidad valida', 'error');
        }
      }else{
        Swal.fire(`Selecciona un servicio`)
      }
}