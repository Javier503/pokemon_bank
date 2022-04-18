// hooks para no repetir tanto codigo

// constraints validate js
var constraints = {
    key1: {
         length: { is:4},
         
    },
};

// obtener fecha actual 
const fecha =()=>{
    const date = new Date();
    return date.toLocaleDateString();
}


// obtener el valor de algun input mediante id
const getInputValue=(id)=>{
    try {
        res= document.getElementById(id).value;
        return res;
    } catch (error) {
        console.warn(error)
    }
}


// generar alert dinamica
const alertMessage=async(title,message,type)=>{
    await Swal.fire(
        title,
        message,
        type
      )
}




const dataUser=()=>{
    let session = JSON.parse(localStorage.getItem("session") || false);
    return session[0]; 
}


// verificar session
const verificarSession =()=>{
    // aqui obtenemos la session en todo caso 
    // seria bueno validar el tiempo de experiacion
    let session = JSON.parse(localStorage.getItem("session") || false);
 
    if(session){
      
        return true;
    }else{
        return false;
    }
}


