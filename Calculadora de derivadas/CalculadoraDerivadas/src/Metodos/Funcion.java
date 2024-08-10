package Metodos;

import org.nfunk.jep.JEP;

public class Funcion {
    
    private String funcion = "";
    private double resultado = 0.0;
    private double valorX = 0.0;    
    private String error = "";
    
    JEP jep;
    
    
    public Funcion(){
        //...
    }
    
    public String getFuncion(){
        return this.funcion;
    }
    public void setFuncion(String funcion){
        this.funcion = funcion;
    }
    
    public void setValorX(double valorX){
        this.valorX = valorX;
    }
    
    public double getResultadoFuncion(){
        return this.resultado;
    }
    
    public String getError(){
        return this.error;
    }
    
    public void evaluar(double nro){
        jep = new JEP();
        
        this.jep.addStandardFunctions();
        this.jep.addStandardConstants();
        this.jep.addVariable("x", nro);
        this.jep.parseExpression(this.funcion);
        this.resultado = this.jep.getValue();
        this.error = (this.jep.hasError())? "Existe un error.":"No hay error.";
        
    }
    
}
