class Utils {
    constructor() {

     }
    imc(peso, altura) {

        return peso/(altura*altura);
  
     }
  }
  
  const utils = new Utils();
  
  module.exports = utils; 