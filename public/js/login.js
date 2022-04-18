// verificamos session existente
const nextView =()=>{
    if (verificarSession() ) {
        location.assign('cajero.html');
    }
    
}

nextView();
// verificamos si el existe el pin en localstorge 
// recomendacion usar algo mas que el pin para logearse para 
// evitar duplicados etc hay muchas vulnerabilidades en este login.
const verificarPin = (pin) => {
    let accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    
    const pins= accounts.map((item,index)=>{
        return item.pin

    })
    return pins.includes(pin);
}


// crear session
const crearSession=(pin)=>{
    let fechaLogin=fecha();
    let accounts = JSON.parse(localStorage.getItem("accounts") || "[]");

    const userInfo= accounts.map((item,index)=>{
       if(item.pin == pin){
           return {
               name:item.name,
               token:item.pin,
               cuenta:item.cuenta,
               date:fechaLogin
            }
       }
    });

    localStorage.setItem("session",JSON.stringify(userInfo));
}

const login = () => {
    let pin = getInputValue('pin');
    let msgPin = 'Pin invalido';
    let msgLogin = 'Bienvenido al Pokemon Bank';
    // validamos ingreso de pin
    if (validate({ key1: pin }, constraints) != undefined) {
        alertMessage('', msgPin, 'error');
    } else {
        
        
        if(verificarPin(pin)){
            crearSession(pin);
            alertMessage('', msgLogin, 'success').then(()=>nextView());
        }else{
            alertMessage('', msgPin, 'error');
        }
    }
}

