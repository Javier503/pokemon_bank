// crearCuenta
const crearCuenta=(data)=>{
    try {
        let accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
        const pins= accounts.map((item,index)=>{
            return item.pin
    
        })
        if(pins.includes(data.pin)){
            return false;
        }else{
            accounts.push(data);
            localStorage.setItem("accounts",JSON.stringify(accounts));
            return true;
        }       
    } catch (error) {
        return error;
    }
   
}




const createAccount = () => {
    let name = getInputValue('name');
    let pin = getInputValue('pin');
    let msgPin='El pin debe tener 4 digitos como minimo y maximo';
    let msgName='El nombre es obligatorio';
    let msgExito='Cuenta creada con exito';
    let msgFail='Error al crear la cuenta';
    
    
    // validamos que no deje el campo vacio de nombres
    if(name.length <= 0){
        alertMessage('',msgName,'error');
    // validamos los digitos del pin sean 4
    }else if(validate({key1: pin },constraints) != undefined){
        alertMessage('',msgPin,'error');
    // procedemos con la creacion de la cuenta
    }else{
        // obtenemos la fecha mediante el hook
        let fechaRegistro=fecha();
        // objeto de cuenta
        const account ={
            name:name,
            pin:pin,
            cuenta:(Math.floor(Math.random() * 10000) + 10000 * 10000).toString().substring(1),
            saldo:0.00,
            create:fechaRegistro,
            update:fechaRegistro
        }
        // llamamos al hook para crear cuentas y evaluamos
        if(crearCuenta(account) == true){
            alertMessage('',msgExito,'success').then(()=> window.history.back());    
        }else{
            alertMessage('',msgFail,'error');
        }
       
        
    }

  
}


